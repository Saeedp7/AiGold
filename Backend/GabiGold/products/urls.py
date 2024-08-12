from django.urls import path

from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailAPIView.as_view(), name='category-detail'),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/create/', views.ProductCreateView.as_view(), name='product-create'),
    path('products/<int:pk>/', views.ProductDetailAPIView.as_view(), name='product-detail'),
    path('products/<int:pk>/update/', views.ProductUpdateView.as_view(), name='product-update'),
    path('products/by-category/<int:category_id>/', views.ProductByCategoryListView.as_view(), name='product-by-category'),
    path('products/search/', views.ProductSearchListView.as_view(), name='product-search'),
    path('products/<int:pk>/reviews/', views.ReviewCreateView.as_view(), name='product-review-create'),
    path('products/<int:pk>/previews/', views.ReviewListView.as_view(), name='product-review-list'),
    path('products/<int:pk>/ratings/', views.RatingCreateView.as_view(), name='product-rating-create'),
    path('reviews/', views.AdminReviewListView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', views.AdminReviewDeleteView.as_view(), name='review-delete'),
    path('gold-price/', views.GoldPriceView.as_view(), name='gold-price'),
    path('day-price/', views.DailyPriceView.as_view(), name='daily-price'),
]
