from decimal import Decimal
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.conf import settings
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import CartItem, Order, OrderItem, Discount, Cart
from .serializers import CartItemSerializer, OrderSerializer, DiscountCodeSerializer
from django.utils import timezone
import requests
import json
from products.models import Product
from products.utils import send_sms

# Sandbox or Production mode
if settings.SANDBOX:
    sandbox = 'sandbox'
else:
    sandbox = 'www'

ZP_API_REQUEST = f"https://{sandbox}.zarinpal.com/pg/rest/WebGate/PaymentRequest.json"
ZP_API_VERIFY = f"https://{sandbox}.zarinpal.com/pg/rest/WebGate/PaymentVerification.json"
ZP_API_STARTPAY = f"https://{sandbox}.zarinpal.com/pg/StartPay/"

CallbackURL = 'http://localhost:3000/checkout/success'

def send_zarinpal_request(amount, description, phone, callback_url):
    print("Sending Zarinpal request...")
    data = {
        "MerchantID": settings.ZARINPAL_MERCHANT_ID,
        "Amount": amount,
        "Description": description,
        "Phone": phone,
        "CallbackURL": callback_url,
    }
    data = json.dumps(data)
    headers = {'content-type': 'application/json', 'content-length': str(len(data))}
    try:
        response = requests.post(ZP_API_REQUEST, data=data, headers=headers, timeout=10)
        print(f"Zarinpal request response status code: {response.status_code}")
        print(f"Zarinpal request response text: {response.text}")
        if response.status_code == 200:
            response = response.json()
            if response['Status'] == 100:
                print(f"Zarinpal request successful, authority: {response['Authority']}")
                return {'status': True, 'url': ZP_API_STARTPAY + str(response['Authority']), 'authority': response['Authority']}
            else:
                raise Exception(f"APIException[{response['Status']}] {response.get('Message', 'Unknown error')}")
        raise Exception(f"APIException[{response.status_code}] {response.text}")
    except requests.exceptions.Timeout:
        raise Exception('APIException[timeout] Request timed out')
    except requests.exceptions.ConnectionError:
        raise Exception('APIException[connection error] Connection error')

def verify_zarinpal_payment(amount, authority):
    print("Verifying Zarinpal payment...")
    data = {
        "MerchantID": settings.ZARINPAL_MERCHANT_ID,
        "Amount": float(amount),
        "Authority": authority,
    }
    data = json.dumps(data)
    headers = {'content-type': 'application/json', 'content-length': str(len(data))}
    response = requests.post(ZP_API_VERIFY, data=data, headers=headers)
    print(f"Zarinpal verify response status code: {response.status_code}")
    print(f"Zarinpal verify response text: {response.text}")
    if response.status_code == 200:
        response = response.json()
        if response['Status'] == 100:
            print(f"Zarinpal verify successful, RefID: {response['RefID']}")
            return {'status': True, 'RefID': response['RefID']}
        else:
            return {'status': False, 'code': str(response['Status'])}
    return {'status': False, 'code': 'error'}

class CartView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            carts = Cart.objects.filter(user=request.user)
            if carts.exists():
                if carts.count() > 1:
                    # Merge multiple carts into one
                    main_cart = carts.first()
                    for cart in carts[1:]:
                        for item in cart.cart_items.all():
                            item.cart = main_cart
                            item.save()
                        cart.delete()
                    cart = main_cart
                else:
                    cart = carts.first()
            else:
                cart = Cart.objects.create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
            cart, created = Cart.objects.get_or_create(cart_id=request.session.session_key)
        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, product_id=product_id)

        if not product.is_available:
            return Response({'error': f"Product {product.name} is not available"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
            cart, created = Cart.objects.get_or_create(cart_id=request.session.session_key)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': request.data.get('quantity', 1), 'weight': product.weight, 'wage': product.wage, 'price': product.price}
        )

        if created:
            cart_item.user = request.user if request.user.is_authenticated else None
            cart_item.session_key = request.session.session_key if not request.user.is_authenticated else None
        else:
            cart_item.quantity = request.data.get('quantity', cart_item.quantity)
            cart_item.weight = product.weight
            cart_item.wage = product.wage
            cart_item.price = product.price
        cart_item.save()

        # Update the cart user if the user is authenticated
        if request.user.is_authenticated:
            cart.user = request.user
            cart.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk=None):
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
            cart, created = Cart.objects.get_or_create(cart_id=request.session.session_key)

        cart_item = get_object_or_404(CartItem, pk=pk, cart=cart)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ClearCartView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
            cart, created = Cart.objects.get_or_create(cart_id=request.session.session_key)
        
        CartItem.objects.filter(cart=cart).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CheckoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        address = user.address  # Assuming address is a field in UserModel
        contact_info = user.phone_number  # Assuming contact_info is stored in user model
        payment_type = request.data.get('payment_type')

        print("Starting checkout process...")
        if not address or not contact_info:
            return Response({"detail": "Address or contact information is missing."}, status=status.HTTP_400_BAD_REQUEST)

        cart = Cart.objects.filter(user=user).first()
        if not cart or not cart.cart_items.exists():
            return Response({"detail": "Cart is empty or not found"}, status=status.HTTP_400_BAD_REQUEST)

        for item in cart.cart_items.all():
            if not item.product.is_available:
                return Response({"detail": f"Product {item.product.name} is not available"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(float(item.total_price) for item in cart.cart_items.all())
        transaction_id = f"{user.user_id}{timezone.now().strftime('%Y%m%d%H%M%S')}"

        discount_code = request.data.get('discount_code')
        discount_amount = 0
        discount = Discount.objects.filter(code=discount_code).first()

        if discount_code:
            discount = Discount.objects.filter(code=discount_code).first()
            if discount and discount.start_date <= timezone.now().date() <= discount.end_date:
                if discount.amount > 0:
                    discount_amount = float(discount.amount)
                else:
                    discount_amount = float(total_price * float(discount.discount_percentage / Decimal('100')))
                total_price -= discount_amount
            else:
                return Response({"detail": "Invalid or expired discount code"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=user,
            address=address,
            contact_info=contact_info,
            total_price=Decimal(total_price),
            discount_amount=Decimal(discount_amount),
            transaction_id=transaction_id,
            status='PENDING'
        )

        for item in cart.cart_items.all():
            OrderItem.objects.create(order=order, product=item.product, price=item.product.calculated_price)

        if payment_type == 'card':
            try:
                print("Sending payment request to Zarinpal...")
                result = send_zarinpal_request(total_price, f"Payment for order {order.transaction_id}", user.phone_number, CallbackURL)
                print(f"Payment request result: {result}")
                if result['status']:
                    order.payment_authority = result['authority']
                    order.save()
                    return Response({"redirect_link": result['url']})
                else:
                    order.delete()
                    return Response({"detail": "Payment request failed"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                order.delete()
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            send_sms(
                user.phone_number,
                f'Thank you for your order! Your order ID is {order.transaction_id}.'
            )
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class PaymentVerifyView(generics.GenericAPIView):
    def get(self, request, authority):
        order = get_object_or_404(Order, payment_authority=authority)

        print("Verifying payment with Zarinpal...")
        result = verify_zarinpal_payment(order.total_price, authority)
        print(f"Payment verification result: {result}")
        if result['status']:
            order.is_paid = True
            order.status = 'COMPLETED'
            order.save()

            for item in order.items.all():
                item.product.is_available = False
                item.product.save()

            cart = Cart.objects.filter(user=order.user).first()
            if cart:
                cart.cart_items.all().delete()

            send_sms(
                order.user.phone_number,
                f'Your payment for order ID {order.transaction_id} was successful. Thank you!'
            )
            # Convert decimal to float for JSON serialization
            order_data = OrderSerializer(order).data
            return Response({"order_id": order.id, "message": "Payment successful", "order_data": order_data}, status=status.HTTP_200_OK)
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
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = OrderSerializer


    

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

class UpdateOrderStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES ):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        if new_status == 'SHIPPED':
            order.tracking_number = request.data.get('tracking_number', '')
        order.save()
        send_sms(
            order.user.phone_number,
            f'Your order ID {order.transaction_id} has been {order.status}.'
        )
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

class ConfirmOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = get_object_or_404(Order, id=order_id, user=request.user)

        result = send_zarinpal_request(order.total_price, f"Payment for order {order.transaction_id}", request.user.phone_number, CallbackURL)
        if result['status']:
            order.payment_authority = result['authority']
            order.save()
            return Response({"url": result['url']})
        else:
            order.delete()
            return Response({"detail": "Payment request failed"}, status=status.HTTP_400_BAD_REQUEST)

class ValidateDiscountCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')
        discount = Discount.objects.filter(code=code, is_active=True).first()

        if not discount or discount.start_date > timezone.now().date() or discount.end_date < timezone.now().date():
            return Response({"valid": False, "message": "Invalid or expired discount code."}, status=status.HTTP_400_BAD_REQUEST)

        discount_data = {
            "amount": discount.amount,
            "percentage": discount.discount_percentage
        }

        return Response({"valid": True, "discount": discount_data}, status=status.HTTP_200_OK)