from django_cron import CronJobBase, Schedule
from .tasks import fetch_gold_price
from products.models import Product
from products.utils import get_latest_gold_price
from decimal import Decimal
from .utils import send_sms
import math

class FetchGoldPriceCronJob(CronJobBase):
    RUN_EVERY_MINS = 60  # every hour

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'products.cron.fetch_gold_price_cron_job'  # a unique code

    def do(self):
        fetch_gold_price()

class FetchProductPriceCronJob(CronJobBase):
    RUN_EVERY_MINS = 60  # every hour

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'products.cron.fetch_products_price_cron_job'  # a unique code

    def do(self):
        gold_price_per_gram = get_latest_gold_price()
        if gold_price_per_gram is not None:
            products = Product.objects.all()
            for product in products:
                old_price = product.price
                product_price = product.weight * gold_price_per_gram
                wage = (product.wages / 100) * product_price
                income = (product_price + wage) * Decimal(0.07)
                tax = (income + wage) * Decimal(0.09)
                total_price = product_price + wage + income + tax

                if product.has_stone:
                    total_price += product.stone_price

                product.price = math.ceil(total_price)
                product.save()

            send_sms(
                '09120929331',  # Replace with actual phone number
                'قیمت محصولات سایت به روز رسانی گردید'
            )
            print('Successfully updated products prices')
        else:
           print('Failed to retrieve gold price')