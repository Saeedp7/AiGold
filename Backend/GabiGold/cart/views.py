from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import CartItem, Order, OrderItem, Discount
from .serializers import CartItemSerializer, OrderSerializer, DiscountCodeSerializer
from django.utils import timezone
from zarinpal import ZarinPal  # Assuming Zarinpal library for payment integration is correctly configured
from django.conf import settings

class CartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        weight = request.data.get('weight')
        wage = request.data.get('wage')
        cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product, weight=weight, wage=wage)
        if not created:
            cart_item.quantity = request.data.get('quantity', cart_item.quantity)
            cart_item.weight = weight
            cart_item.wage = wage
            cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        cart_item = CartItem.objects.filter(user=request.user, product=product).first()
        if cart_item:
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CheckoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        address = request.user.profile.address  # Assuming address is stored in user profile
        contact_info = request.user.phone_number  # Assuming contact_info is stored in user profile
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items:
            return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.calculated_price * item.quantity for item in cart_items)
        transaction_id = f"{request.user.id}-{timezone.now().strftime('%Y%m%d%H%M%S')}"

        discount_code = request.data.get('discount_code')
        discount = Discount.objects.filter(code=discount_code).first()

        if discount and discount.start_date <= timezone.now().date() <= discount.end_date:
            if discount.amount > 0 :
                total_price -= discount.amount
            else : 
                total_price -= (total_price * (discount.discount_percentage/100))

        order = Order.objects.create(
            user=request.user,
            address=address,
            contact_info=contact_info,
            total_price=total_price,
            transaction_id=transaction_id
        )

        for item in cart_items:
            OrderItem.objects.create(order=order, product=item.product, price=item.product.calculated_price)
            item.product.is_available = False
            item.product.save()

        cart_items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class ConfirmOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = get_object_or_404(Order, id=order_id, user=request.user)

        # Assuming you have payment integration using Zarinpal
        zarinpal = Zarinpal(settings.ZARINPAL_MERCHANT_ID)
        zarinpal.set_currency('IRT')
        zarinpal.set_amount(order.total_price)
        zarinpal.set_callback_url(f"{settings.BASE_URL}/cart/payment/verify/")
        zarinpal.set_description(f"Payment for order {order.transaction_id}")
        zarinpal.set_mobile(request.user.phone_number)
        zarinpal.set_email(request.user.email)

        result = zarinpal.request_payment()
        if result['status'] == 100:
            order.payment_authority = result['authority']
            order.save()
            return Response({"url": zarinpal.get_payment_url(result['authority'])})
        else:
            order.delete()
            return Response({"detail": "Payment request failed"}, status=status.HTTP_400_BAD_REQUEST)

class PaymentVerifyView(generics.GenericAPIView):
    def get(self, request):
        authority = request.GET.get('Authority')
        order = get_object_or_404(Order, payment_authority=authority)

        zarinpal = Zarinpal(settings.ZARINPAL_MERCHANT_ID)
        result = zarinpal.verify_payment(authority, order.total_price)

        if result['status'] == 100:
            order.is_paid = True
            order.save()
            return Response(OrderSerializer(order).data)
        else:
            order.delete()
            return Response({"detail": "Payment verification failed"}, status=status.HTTP_400_BAD_REQUEST)

class OrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        if 'all' in self.request.GET and self.request.user.is_staff:
            return Order.objects.all()
        elif 'details' in self.request.GET:
            transaction_id = self.request.GET.get('transaction_id')
            return Order.objects.filter(transaction_id=transaction_id)
        return Order.objects.filter(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_object(self):
        transaction_id = self.kwargs.get('transaction_id')
        return get_object_or_404(self.get_queryset(), transaction_id=transaction_id)
    
    def get(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
class AdminOrderUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def put(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = self.get_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DiscountCodeListCreateView(generics.ListCreateAPIView):
    queryset = Discount.objects.all()
    serializer_class = DiscountCodeSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class DiscountCodeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Discount.objects.all()
    serializer_class = DiscountCodeSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
