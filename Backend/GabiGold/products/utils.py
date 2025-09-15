import logging
from django.conf import settings
from django.core.cache import cache

from libs.melipayamak import Api
from .models import GoldenPrice

logger = logging.getLogger(__name__)


def get_latest_gold_price():
    try:
        gold_price = GoldenPrice.objects.filter(slug='18ayar').latest('timestamp')
        cache.set('latest_gold_price', gold_price.price, settings.CACHE_TTL)
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
        logger.info("SMS response: %s", response)
        
    except Exception as e:  # pragma: no cover - network errors handled generically
        logger.error("Error sending SMS: %s", e)