from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models.functions import TruncDay
from django.db.models import Sum, Count, Avg, F
from django.http import JsonResponse
from Cart.models import Order, OrderItem, CartItem, Cart
from Users.models import UserModel
from ticket.models import Ticket
from products.models import Product, Rating, Review, GoldenPrice
from Cart.cron import UpdatePricesCronJob
from products.cron import FetchGoldPriceCronJob, FetchProductPriceCronJob
from Users.cron import CheckExpiredOTPs


@api_view(['GET'])
def analytics_summary(request):
    data = {
        # Sales Analytics
        'total_sales': Order.objects.filter(status='Completed').aggregate(total_sales=Sum('total_price'))['total_sales'],
        'sales_over_time': Order.objects.filter(status='Completed').annotate(date=TruncDay('created_at')).values('date').annotate(total_sales=Sum('total_price')).order_by('date'),
        'sales_by_category': OrderItem.objects.filter(order__status='Completed').values('product__category__name').annotate(total_sales=Sum('price')).order_by('-total_sales'),
        'average_order_value': Order.objects.filter(status='Completed').aggregate(avg_value=Avg('total_price'))['avg_value'],

        # User Analytics
        'total_users': UserModel.objects.count(),
        'new_users_over_time': UserModel.objects.annotate(date=TruncDay('user_register_at')).values('date').annotate(new_users=Count('user_id')).order_by('date'),
        'user_retention_rate': calculate_user_retention_rate(),
        'most_active_users': Order.objects.values('user__phone_number').annotate(total_orders=Count('user_id')).order_by('-total_orders'),
        'user_registration_by_gender': UserModel.objects.values('gender').annotate(total=Count('user_id')).order_by('-total'),
        'inactive_users': UserModel.objects.filter(order__isnull=True).count(),

        # Cart Analytics
        'most_added_to_cart_products': CartItem.objects.values('product__name').annotate(total_added=Count('id')).order_by('-total_added'),
        'total_carts': Cart.objects.count(),
        'total_cart_items': CartItem.objects.count(),
        'conversion_rate': Order.objects.filter(status='Completed').count() / CartItem.objects.count() if CartItem.objects.count() > 0 else 0,

        # Order Analytics
        'total_orders': Order.objects.count(),
        'order_status_distribution': Order.objects.values('status').annotate(count=Count('id')),
        'average_order_processing_time': Order.objects.filter(status='Delivered').annotate(processing_time=F('updated_at') - F('created_at')).aggregate(avg_processing_time=Avg('processing_time'))['avg_processing_time'],

        # Ticket Analytics
        'total_tickets': Ticket.objects.count(),
        'tickets_by_category': Ticket.objects.values('category').annotate(total=Count('id')).order_by('-total'),
        'ticket_status_distribution': Ticket.objects.values('status').annotate(count=Count('id')).order_by('-count'),
        'average_ticket_resolution_time': Ticket.objects.filter(status='closed').annotate(resolution_time=F('updated_at') - F('created_at')).aggregate(avg_resolution_time=Avg('resolution_time'))['avg_resolution_time'],
        'tickets_over_time': Ticket.objects.annotate(date=TruncDay('created_at')).values('date').annotate(total_tickets=Count('id')).order_by('date'),
        'tickets_per_user': Ticket.objects.values('user__phone_number').annotate(total_tickets=Count('id')).order_by('-total_tickets'),
        'percentage_order_related_tickets': (Ticket.objects.filter(category='order').count() / Ticket.objects.count() * 100) if Ticket.objects.count() > 0 else 0,

        # Product Analytics
        'total_products': Product.objects.count(),
        'available_products': Product.objects.filter(is_available=True).count(),
        'unavailable_products': Product.objects.count() - Product.objects.filter(is_available=True).count(),
        'most_reviewed_products': Review.objects.values('product__name').annotate(total_reviews=Count('id')).order_by('-total_reviews'),
        'highest_rated_products': list(Product.objects.annotate(avg_rating=Avg('ratings__rating')).order_by('-avg_rating').values('name', 'avg_rating')[:10]),
        'lowest_rated_products': list(Product.objects.annotate(avg_rating=Avg('ratings__rating')).order_by('avg_rating').values('name', 'avg_rating')[:10]),
        'average_product_rating': Rating.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'],
        'category_performance': OrderItem.objects.filter(order__status='Completed').values('product__category__name').annotate(total_sales=Sum('price')),
        'new_products_over_time': Product.objects.annotate(date=TruncDay('created_at')).values('date').annotate(new_products=Count('product_id')).order_by('date'),
        'featured_products_performance': list(Product.objects.filter(is_featured=True).annotate(total_sales=Sum('orderitem__price')).values('name', 'total_sales').order_by('-total_sales')),
        'current_gold_price': GoldenPrice.objects.latest('timestamp').price,
        'gold_price_trends': list(GoldenPrice.objects.annotate(date=TruncDay('timestamp')).values('date').annotate(avg_price=Avg('price')).order_by('date')),
    }

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def trigger_cron_jobs(request):
    job_type = request.data.get('job_type')

    if job_type == 'update_prices':
        cron_job = UpdatePricesCronJob()
    elif job_type == 'fetch_gold_price':
        cron_job = FetchGoldPriceCronJob()
    elif job_type == 'fetch_products_price':
        cron_job = FetchProductPriceCronJob()
    elif job_type == 'check_expired_otps':
        cron_job = CheckExpiredOTPs()
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid job type specified.'}, status=400)

    cron_job.do()  # Manually trigger the cron job
    return JsonResponse({'status': 'success', 'message': f'{job_type} cron job triggered successfully.'})


def calculate_user_retention_rate():
    total_users = UserModel.objects.count()
    active_users = UserModel.objects.filter(order__isnull=False).distinct().count()  # Users who have made at least one order
    if total_users > 0:
        return (active_users / total_users) * 100
    return 0
