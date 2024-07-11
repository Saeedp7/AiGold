from rest_framework import serializers
from .models import Wishlist

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'created_at']
    def validate(self, attrs):
        user = self.context['request'].user
        product = attrs.get('product')

        if Wishlist.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("This product is already in your wishlist.")
        
        return attrs
