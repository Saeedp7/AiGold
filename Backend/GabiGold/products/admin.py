from django.contrib import admin
from .models import Category, Product, ProductImage, Review, Rating

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'product_code', 'category', 'weight', 'wages','price', 'is_available', 'created_at')
    search_fields = ('name', 'brand', 'product_code', 'category__name')
    list_filter = ('category', 'is_available', 'is_new', 'is_featured')
    inlines = [ProductImageInline]

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Review)
admin.site.register(Rating)
