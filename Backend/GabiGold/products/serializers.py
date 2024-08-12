from rest_framework import serializers
from django.db.models import Avg
from .models import Category, Product, ProductImage, Review, Rating, GoldenPrice
from django.contrib.auth import get_user_model
import json
User = get_user_model()

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name','last_name','phone_number')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'meta_keywords', 'meta_description', 'created_at', 'updated_at')

    def validate(self, attrs):
        # Ensure all fields are provided
        if not all(attrs.values()):
            raise serializers.ValidationError("All fields are required.")
        return attrs

    def create(self, validated_data):
        # Check if category with the same name exists
        name = validated_data['name']
        existing_category = Category.objects.filter(name=name).first()
        if existing_category:
            raise serializers.ValidationError("Category with this name already exists.")
        
        # Create new category
        category = Category.objects.create(**validated_data)
        return category
    def update(self, instance, validated_data):
        # Update existing category instance
        instance.name = validated_data.get('name', instance.name)
        instance.meta_keywords = validated_data.get('meta_keywords', instance.meta_keywords)
        instance.meta_description = validated_data.get('meta_description', instance.meta_description)
        instance.save(update_fields=['name', 'meta_keywords', 'meta_description', 'updated_at'])
        return instance

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image', 'created_at', 'id')

class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('product_id', 'name',)  # Include only basic fields

class ReviewSerializer(serializers.ModelSerializer):
    user_details = UserDetailSerializer(source='user', read_only=True)
    product = SimpleProductSerializer(read_only=True) 
    
    class Meta:
        model = Review
        fields = ('id', 'product', 'user_details', 'text', 'created_at')

class RatingSerializer(serializers.ModelSerializer):
    user_details = UserDetailSerializer(source='user', read_only=True)

    class Meta:
        model = Rating
        fields = ('id', 'product', 'user_details', 'rating', 'created_at')

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    ratings = RatingSerializer(many=True, read_only=True)
    calculated_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    average_rating = serializers.SerializerMethodField()
    category_details = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_average_rating(self, obj):
        avg_rating = obj.ratings.aggregate(avg_rating=Avg('rating'))['avg_rating']
        return avg_rating if avg_rating is not None else 0

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        extra_kwargs = {
            'description': {'required': False},
            'thumbnail': {'required': False},
        }

    def create(self, validated_data):
        request = self.context['request']
        images = request.FILES.getlist('images')
        thumbnail = request.FILES.get('thumbnail')

        product = Product.objects.create(**validated_data)

        if thumbnail:
            product.thumbnail = thumbnail

        if images:
            for image in images:
                ProductImage.objects.create(product=product, image=image)

        product.save()
        return product
    
    def update(self, instance, validated_data):
        request = self.context['request']

        # Handle non-file fields
        for attr, value in validated_data.items():
            if attr not in ['thumbnail', 'images', 'removed_images', 'removed_thumbnail']:
                setattr(instance, attr, value)

        # Handle thumbnail separately
        if 'thumbnail' in request.FILES:
            instance.thumbnail = request.FILES['thumbnail']
        elif 'removed_thumbnail' in request.data:
            instance.thumbnail = None
        elif 'thumbnail' in request.data and not request.data['thumbnail'].startswith('http'):
            instance.thumbnail = request.data['thumbnail']

        images = request.FILES.getlist('images')
        if images:
            for image in images:
                ProductImage.objects.create(product=instance, image=image)

        removed_images = request.data.get('removed_images')
        if removed_images:
            try:
                removed_images = json.loads(removed_images)
                instance.images.filter(id__in=removed_images).delete()
            except json.JSONDecodeError as e:
                print(f"Error decoding removed_images: {str(e)}")

        instance.save()
        return instance

    
class GoldenPriceSerial(serializers.ModelSerializer):
    class Meta:
        model = GoldenPrice
        fields = '__all__'
