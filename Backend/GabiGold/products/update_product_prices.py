import requests
from django.core.management.base import BaseCommand
from .models import Product
from .utils import get_gold_price

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
