# tasks.py
from celery import shared_task
import requests
from .models import GoldPrice

@shared_task
def fetch_gold_price():
    response = requests.get('https://sourcearena.ir/api/?token=ad87a7f78ba729d918ea3769838e53a2&currency&v2')
    if response.status_code == 200:
        data = response.json().get('data', [])
        for item in data:
            if item['slug'] == 'TALA_18':
                GoldPrice.objects.update_or_create(
                    slug=item['slug'],
                    defaults={
                        'name': item['name'],
                        'price': item['price'],
                        'change': item['change'],
                        'change_percent': item['change_percent'],
                        'min_price': item['min_price'],
                        'max_price': item['max_price'],
                        'last_update': item['last_update'],
                        'jalali_last_update': item['jalali_last_update']
                    }
                )
