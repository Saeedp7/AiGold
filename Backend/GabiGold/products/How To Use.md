# Product App Documentation

This documentation covers the API endpoints, models, and their usage for the product app, which is part of a gold and jewelry web application. The product app handles the creation, updating, listing, searching, and reviewing of products.

## Models

### Category

Represents a product category.

- **name**: Name of the category.
- **meta_keywords**: Keywords for SEO.
- **meta_description**: Description for SEO.

### Product

Represents a product.

- **category**: ForeignKey to `Category`.
- **name**: Name of the product.
- **brand**: Brand of the product.
- **product_code**: Unique code for the product.
- **product_standard**: Standard of the product.
- **weight**: Weight of the product.
- **wages**: Wages for the product.
- **has_stone**: Boolean indicating if the product has a stone.
- **stone_type**: Type of stone.
- **stone_weight**: Weight of the stone.
- **stone_price**: Price of the stone per gram.
- **stone_material**: Material of the stone.
- **is_new**: Boolean indicating if the product is new.
- **is_featured**: Boolean indicating if the product is featured.
- **is_available**: Boolean indicating if the product is available.
- **thumbnail**: Thumbnail image of the product.
- **created_at**: Timestamp when the product was created.
- **calculated_price**: Property that calculates the price based on the gold price, wages, and other factors.

### ProductImage

Represents an image of a product.

- **product**: ForeignKey to `Product`.
- **image**: Image file.
- **created_at**: Timestamp when the image was uploaded.

### Review

Represents a review for a product.

- **product**: ForeignKey to `Product`.
- **user**: ForeignKey to `User`.
- **text**: Text of the review.
- **created_at**: Timestamp when the review was created.

### Rating

Represents a rating for a product.

- **product**: ForeignKey to `Product`.
- **user**: ForeignKey to `User`.
- **rating**: Integer rating value between 1 and 5.
- **created_at**: Timestamp when the rating was created.

## Serializers

### CategorySerializer

Serializes `Category` objects.

### ProductSerializer

Serializes `Product` objects, including related images, reviews, ratings, and calculated price.

### ProductCreateUpdateSerializer

Serializes `Product` objects for creation and updating.

### ProductImageSerializer

Serializes `ProductImage` objects.

### ReviewSerializer

Serializes `Review` objects.

### RatingSerializer

Serializes `Rating` objects.

## Views

### CategoryListView

Lists all categories.

- **URL**: `/api/categories/`
- **Method**: `GET`

### ProductListView

Lists all products.

- **URL**: `/api/products/`
- **Method**: `GET`

### ProductCreateView

Creates a new product.

- **URL**: `/api/products/create/`
- **Method**: `POST`
- **Permissions**: Admin only

### ProductUpdateView

Updates an existing product.

- **URL**: `/api/products/<int:pk>/update/`
- **Method**: `PUT`, `PATCH`
- **Permissions**: Admin only

### ProductByCategoryListView

Lists products by category.

- **URL**: `/api/products/by-category/<int:category_id>/`
- **Method**: `GET`

### ProductSearchListView

Searches and filters products by various criteria.

- **URL**: `/api/products/search/`
- **Method**: `GET`
- **Search Fields**: `name`, `description`, `brand`, `product_code`, `product_standard`, `stone_type`, `stone_material`
- **Ordering Fields**: `calculated_price`, `weight`, `wages`
- **Filter Fields**: `weight`, `wages`, `is_new`, `is_featured`, `is_available`
- **Query Parameters**: `min_weight`, `max_weight`, `min_wages`, `max_wages`

### ReviewCreateView

Creates a new review for a product.

- **URL**: `/api/products/<int:pk>/reviews/`
- **Method**: `POST`
- **Permissions**: Authenticated users

### RatingCreateView

Creates a new rating for a product.

- **URL**: `/api/products/<int:pk>/ratings/`
- **Method**: `POST`
- **Permissions**: Authenticated users

### GoldPriceView

Retrieves the current gold price per gram.

- **URL**: `/api/gold-price/`
- **Method**: `GET`

## Cron Job for Updating Prices

A cron job can be set up to update the prices of products based on the current gold price every hour. The following management command can be used:

### Management Command

Create a management command in `management/commands/update_product_prices.py`.

```python
import requests
from django.core.management.base import BaseCommand
from yourapp.models import Product
from yourapp.utils import get_gold_price

class Command(BaseCommand):
    help = 'Update product prices based on the current gold price.'

    def handle(self, *args, **kwargs):
        gold_price_per_gram = get_gold_price()
        if gold_price_per_gram is not None:
            products = Product.objects.all()
            for product in products:
                product_price = product.weight * gold_price_per_gram
                wage = (product.wages / 100) * product_price
                income = (product_price + wage) * 0.07
                tax = (income + wage) * 0.09
                total_price = product_price + wage + income + tax

                if product.has_stone:
                    stone_price = product.stone_weight * product.stone_price
                    total_price += stone_price

                product.calculated_price = total_price
                product.save()

            self.stdout.write(self.style.SUCCESS('Successfully updated product prices'))
        else:
            self.stdout.write(self.style.ERROR('Failed to retrieve gold price'))
```

### Cron Job Setup

Set up a cron job to run the management command every hour.

1. Open the crontab file:

```sh
crontab -e
```

2. Add the following line:

```sh
0 * * * * /path/to/your/virtualenv/bin/python /path/to/your/project/manage.py update_product_prices
```

Replace the paths with the appropriate values for your environment.

## API Endpoints Summary

### Category Endpoints

- **List Categories**: `GET /api/categories/`

### Product Endpoints

- **List Products**: `GET /api/products/`
- **Create Product**: `POST /api/products/create/`
- **Update Product**: `PUT /api/products/<int:pk>/update/` or `PATCH /api/products/<int:pk>/update/`
- **List Products by Category**: `GET /api/products/by-category/<int:category_id>/`
- **Search and Filter Products**: `GET /api/products/search/`

### Review Endpoints

- **Create Review**: `POST /api/products/<int:pk>/reviews/`

### Rating Endpoints

- **Create Rating**: `POST /api/products/<int:pk>/ratings/`

### Gold Price Endpoint

- **Get Gold Price**: `GET /api/gold-price/`

## Frontend Integration

- **Browse Products by Category**: Use the `/api/products/by-category/<int:category_id>/` endpoint.
- **Search and Filter Products**: Use the `/api/products/search/` endpoint with appropriate query parameters.
- **Product Details**: Fetch product details, images, reviews, and ratings using the `/api/products/<int:pk>/` endpoint.
- **User Reviews and Ratings**: Post reviews and ratings using the `/api/products/<int:pk>/reviews/` and `/api/products/<int:pk>/ratings/` endpoints.
- **Gold Price**: Retrieve the current gold price using the `/api/gold-price/` endpoint.

---

With this comprehensive setup, the product app now includes all required functionalities for managing and displaying products, handling reviews and ratings, and dynamically updating prices based on the gold price. Next, let's proceed to the Cart and Order app.