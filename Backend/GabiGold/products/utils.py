from .models import GoldenPrice

def get_latest_gold_price():
    try:
        gold_price = GoldPrice.objects.filter(slug='TALA_18').latest('timestamp')
        return gold_price.price
    except GoldPrice.DoesNotExist:
        return None
