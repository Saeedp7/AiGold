from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import math

def validate_file_size(value):
    filesize = value.size

    if filesize > 10485760:  # 10 MB limit
        raise ValidationError("The maximum file size that can be uploaded is 10 MB")
    else:
        return value
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    meta_keywords = models.TextField(blank=True)
    meta_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    product_code = models.CharField(max_length=50)
    product_standard = models.CharField(max_length=50)
    weight = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    wages = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # New field for storing calculated price
    has_stone = models.BooleanField(default=False)
    stone_type = models.CharField(max_length=100, blank=True, null=True)
    stone_weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, validators=[MinValueValidator(Decimal('0.00'))])
    stone_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, validators=[MinValueValidator(Decimal('0.00'))])
    stone_material = models.CharField(max_length=100, blank=True, null=True)
    is_new = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    thumbnail = models.ImageField(upload_to='products/thumbnails/', validators=[validate_file_size])
    owner = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate the price
        self.price = self.calculated_price
        super().save(*args, **kwargs)

    @property
    def calculated_price(self):
        gold_price_per_gram = Product.get_latest_gold_price()
        if gold_price_per_gram is not None:
            product_price = self.weight * gold_price_per_gram
            wage = (self.wages / 100) * product_price
            income = (product_price + wage) * Decimal(0.07)
            tax = (income + wage) * Decimal(0.09)
            total_price = product_price + wage + income + tax

            if self.has_stone:
                total_price += self.stone_price

            return math.ceil(total_price)
        else:
            return 0

    @staticmethod
    def get_latest_gold_price():
        try:
            gold_price = GoldenPrice.objects.filter(slug='18ayar').latest('timestamp')
            return gold_price.price
        except GoldenPrice.DoesNotExist:
            return None

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', validators=[validate_file_size])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Image for {self.product.name}'

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reviews', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review by {self.user.username} for {self.product.name}'

class Rating(models.Model):
    product = models.ForeignKey(Product, related_name='ratings', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='ratings', on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Rating {self.rating} by {self.user.username} for {self.product.name}'

class GoldenPrice(models.Model):
    slug = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=10, decimal_places=2)
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    last_update = models.TimeField()
    jalali_last_update = models.TimeField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.price}"