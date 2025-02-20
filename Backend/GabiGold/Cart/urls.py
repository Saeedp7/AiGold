from django.urls import path
from .views import CartView, CheckoutView, PaymentVerifyView, OrderListView, OrderDetailView, ClearCartView, ConfirmOrderView, AdminOrderUpdateView, DiscountCodeListCreateView, DiscountCodeDetailView, UpdateOrderStatusView, ValidateDiscountCodeView, AdminOrderListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/<int:pk>/', CartView.as_view(), name='cart_item_detail'),
    path('cart/clear/', ClearCartView.as_view(), name='clear_cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('confirm-order/', ConfirmOrderView.as_view(), name='confirm_order'),
    path('payment/verify/<str:authority>/', PaymentVerifyView.as_view(), name='payment_verify'),
    path('orders/', OrderListView.as_view(), name='orders'),
    path('adminorders/', AdminOrderListView.as_view(), name='orders'),
    path('orders/<str:transaction_id>/', OrderDetailView.as_view(), name='order_detail'),
    path('orders/<int:pk>/', AdminOrderUpdateView.as_view(), name='admin-order-update'),
    path('orders/<int:order_id>/status/', UpdateOrderStatusView.as_view(), name='order-status-update'),
    path('discount_codes/', DiscountCodeListCreateView.as_view(), name='discount-code-list-create'),
    path('discount_codes/<int:pk>/', DiscountCodeDetailView.as_view(), name='discount-code-detail'),
    path('validate-discount/', ValidateDiscountCodeView.as_view(), name='validate_discount'),  # New endpoint
]

