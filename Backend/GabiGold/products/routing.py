# routing.py
from django.urls import re_path
from .consumers import GoldPriceConsumer

websocket_urlpatterns = [
    re_path(r'shop/gold-price/$', GoldPriceConsumer.as_asgi()),
]
