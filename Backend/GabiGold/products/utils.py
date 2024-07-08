from .models import GoldenPrice

def get_latest_gold_price():
    try:
        gold_price = GoldenPrice.objects.filter(slug='18ayar').latest('timestamp')
        return gold_price.price
    except GoldenPrice.DoesNotExist:
        return None
