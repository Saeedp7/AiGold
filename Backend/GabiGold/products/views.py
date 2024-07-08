from rest_framework import generics, permissions, filters, status
from .models import Category, Product, ProductImage, Review, Rating
from .serializers import CategorySerializer, ProductSerializer, ProductCreateUpdateSerializer, ReviewSerializer, RatingSerializer
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
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAdminUser]
    
class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Product.objects.filter(category__id=category_id)

class ProductSearchListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'brand', 'product_code', 'product_standard', 'stone_type', 'stone_material']
    ordering_fields = ['calculated_price', 'weight', 'wages']
    filterset_fields = ['weight', 'wages', 'is_new', 'is_featured', 'is_available']

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
            queryset = queryset.filter(wages__gte=min_wages)
        if max_wages is not None:
            queryset = queryset.filter(wages__lte=max_wages)

        return queryset

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoldPriceView(APIView):
    def get(self, request):
        gold_price_per_gram = get_latest_gold_price()
        return Response({'gold_price_per_gram': gold_price_per_gram})
