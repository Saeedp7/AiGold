from django.db import models
from django.conf import settings
from products.models import Product
from django.utils import timezone
from zarinpal import ZarinPal
from decimal import Decimal

class Cart(models.Model):
    cart_id = models.CharField(max_length=50, null=True, blank=True, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=None, blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def total_quantity(self):
        return self.cartitems.all().count()
    
    @property
    def total_price(self):
        value =  sum(float(i.total_price) for i in self.cartitems.all())
        value = "{:.2f}".format(value)
        return value
    
class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='user_id',  blank=True, null=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='product_id')
    quantity = models.PositiveIntegerField(default=1)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    wage = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name = 'cart_items')

    def __str__(self):
        return f'{self.quantity} of {self.product.name} Done'
    
    def save(self, *args, **kwargs):
        if not self.product.is_available:
            raise ValueError(f"Product {self.product.name} is not available")
        super().save(*args, **kwargs)

    @property
    def total_price(self):
        product = self.product.price
        quantity = Decimal(self.quantity)
        value = float(product) * float(quantity)
        return value

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    address = models.TextField()
    contact_info = models.CharField(max_length=100)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_paid = models.BooleanField(default=False)
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_authority = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # New fields for tracking
    STATUS_CHOICES  = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES , default='PENDING')
    tracking_number = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f'Order {self.transaction_id} by {self.user.username}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'Item {self.product.name} in Order {self.order.transaction_id}'

class Discount(models.Model):
    code = models.CharField(max_length=20, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'Discount {self.code}: {self.amount} and {self.discount_percentage}%'
