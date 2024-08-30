from libs.melipayamak import Api
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
        # Add "لغو 11" at the end of the message as required
        message = f"{message} لغو 11"
        
        # Initialize the MelliPayamak API with your credentials
        api = Api(settings.MELLIPAYAMAK_USERNAME, settings.MELLIPAYAMAK_PASSWORD)
        sms = api.sms()
        
        # Send the SMS
        response = sms.send(to, settings.MELLIPAYAMAK_SENDER_NUMBER, message)
        print(response)
        
    except Exception as e:
        print(f'Error sending SMS: {e}')