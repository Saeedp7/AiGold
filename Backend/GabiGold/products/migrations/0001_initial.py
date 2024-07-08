# Generated by Django 5.0.6 on 2024-07-08 01:16

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('meta_keywords', models.TextField(blank=True)),
                ('meta_description', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='GoldenPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('change', models.DecimalField(decimal_places=2, max_digits=10)),
                ('change_percent', models.DecimalField(decimal_places=2, max_digits=10)),
                ('min_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('max_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('last_update', models.TimeField()),
                ('jalali_last_update', models.TimeField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('product_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('brand', models.CharField(max_length=100)),
                ('product_code', models.CharField(max_length=50)),
                ('product_standard', models.CharField(max_length=50)),
                ('weight', models.DecimalField(decimal_places=2, max_digits=10)),
                ('wages', models.DecimalField(decimal_places=2, max_digits=10)),
                ('has_stone', models.BooleanField(default=False)),
                ('stone_type', models.CharField(blank=True, max_length=100, null=True)),
                ('stone_weight', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('stone_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('stone_material', models.CharField(blank=True, max_length=100, null=True)),
                ('is_new', models.BooleanField(default=False)),
                ('is_featured', models.BooleanField(default=False)),
                ('is_available', models.BooleanField(default=True)),
                ('thumbnail', models.ImageField(upload_to='products/thumbnails/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='products.category')),
            ],
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='products/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='products.product')),
            ],
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to='products.product')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ratings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='products.product')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
