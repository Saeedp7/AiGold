from rest_framework import serializers
from .models import CartItem, Order, OrderItem, Discount, Cart
from products.models import Product
from products.serializers  import ProductSerializer
from Users.serializers import UserSerializer
class CartSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Cart
        fields = ['id', 'cart_id', 'user']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'weight', 'wage', 'cart','price']

    def validate(self, data):
        product = data.get('product')
        if not product.is_available:
            raise serializers.ValidationError(f"Product {product.name} is not available")
        return data
    
    def create(self, validated_data):
        if CartItem.objects.filter(product=validated_data['product']).exists():
            cartitem = CartItem.objects.filter(product=validated_data['product']).first()
            cartitem.quantity = cartitem.quantity + int(validated_data['quantity'])
            cartitem.save()
            return cartitem
        else:
            cartitem = CartItem.objects.create(**validated_data)
            return cartitem

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields ='__all__'

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
    
    
class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'
