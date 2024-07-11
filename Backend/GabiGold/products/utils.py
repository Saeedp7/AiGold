from kavenegar import KavenegarAPI, APIException, HTTPException
from django.conf import settings
from .models import GoldenPrice

def get_latest_gold_price():
    try:
        gold_price = GoldenPrice.objects.filter(slug='18ayar').latest('timestamp')
        return gold_price.price
    except GoldenPrice.DoesNotExist:
        return None
    
def send_sms(to, message):
    try:
        api = KavenegarAPI(settings.KAVENEGAR_API_KEY)
        params = {
            'sender': '1000689696',  # Optional: You can set your sender number here
            'receptor': to,
            'message': message,
        }
        response = api.sms_send(params)
        print(response)
    except APIException as e:
        print(f'APIException: {e}')
    except HTTPException as e:
        print(f'HTTPException: {e}')
