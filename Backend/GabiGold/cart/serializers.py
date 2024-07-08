from rest_framework import serializers
from .models import CartItem, Order, OrderItem, Discount
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'weight', 'wage']

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['product', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'contact_info', 'total_price', 'is_paid', 'transaction_id', 'items', 'status']

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
    
class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'
