from rest_framework import generics, permissions, filters, status
from .models import Category, Product, ProductImage, Review, Rating, GoldenPrice
from .serializers import CategorySerializer, ProductSerializer, ProductCreateUpdateSerializer, ReviewSerializer, RatingSerializer, GoldenPriceSerial
from .utils import get_latest_gold_price
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CategoryDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
   
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related('category').prefetch_related('images')
    serializer_class = ProductSerializer
    
class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        print(f"Incoming request data: {request.data}")
        print(f"Incoming request files: {request.FILES}")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_instance = serializer.save()
        return Response(self.get_serializer(updated_instance).data)

        
class ProductByCategoryListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    ordering_fields = ['product_id']  # Make sure 'created_at' is a field in your model
    ordering = ['-product_id']  # Default ordering



    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Product.objects.filter(category__id=category_id).order_by('product_id')

class ProductSearchListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'brand', 'product_code', 'product_standard', 'stone_type', 'stone_material']  # Removed 'description' since it's not a field
    ordering_fields = ['calculated_price', 'weight', 'wage']
    filterset_fields = ['product_code', 'weight', 'wage', 'is_new', 'is_featured', 'is_available']

    def get_queryset(self):
        queryset = Product.objects.all()
        min_weight = self.request.query_params.get('min_weight', None)
        max_weight = self.request.query_params.get('max_weight', None)
        min_wages = self.request.query_params.get('min_wages', None)
        max_wages = self.request.query_params.get('max_wages', None)

        if min_weight is not None:
            queryset = queryset.filter(weight__gte=min_weight)
        if max_weight is not None:
            queryset = queryset.filter(weight__lte=max_weight)
        if min_wages is not None:
            queryset = queryset.filter(wage__gte=min_wages)
        if max_wages is not None:
            queryset = queryset.filter(wage__lte=max_wages)

        return queryset

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoldPriceView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        gold_price_per_gram = get_latest_gold_price()
        return Response({'gold_price_per_gram': gold_price_per_gram})
    
class DailyPriceView(APIView):
    def get(self, request):
        prices = GoldenPrice.objects.all()
        serializer = GoldenPriceSerial(prices, many=True)
        return Response(serializer.data)

class ReviewListView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    ordering_fields = ['created_at']  # Make sure 'created_at' is a field in your model
    ordering = ['created_at']  # Default ordering

    def get_queryset(self):
        """
        This view should return a list of all the reviews
        for the product as determined by the product_id portion of the URL.
        """
        product_id = self.kwargs['pk']
        return Review.objects.filter(product_id=product_id).order_by('-created_at')
    
class AdminReviewListView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admins can access

class AdminReviewDeleteView(generics.DestroyAPIView):
    queryset = Review.objects.all()
    permission_classes = [permissions.IsAdminUser]  # Only admins can delete