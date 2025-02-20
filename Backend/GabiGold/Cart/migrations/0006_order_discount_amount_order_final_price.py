# Generated by Django 5.0.6 on 2024-08-11 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cart', '0005_cartitem_price_alter_cartitem_cart'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='discount_amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AddField(
            model_name='order',
            name='final_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
    ]
