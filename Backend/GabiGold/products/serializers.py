from rest_framework import serializers
from .models import Category, Product, ProductImage, Review, Rating

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'meta_keywords', 'meta_description')

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
        instance.save()
        return instance

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image', 'created_at')

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('id', 'product', 'user', 'text', 'created_at')

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'product', 'user', 'rating', 'created_at')

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    ratings = RatingSerializer(many=True, read_only=True)
    calculated_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_average_rating(self, obj):
        avg_rating = obj.ratings.aggregate(models.Avg('rating'))['rating__avg']
        return avg_rating if avg_rating is not None else 0

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
