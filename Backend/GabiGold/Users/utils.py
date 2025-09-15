import logging

from django.conf import settings
from libs.melipayamak import Api


logger = logging.getLogger(__name__)

def send_otp(mobile: str, otp: str) -> bool:

    username = settings.MELLIPAYAMAK_USERNAME
    password = settings.MELLIPAYAMAK_PASSWORD
    sender = settings.MELLIPAYAMAK_SENDER_NUMBER

    if not all([username, password, sender]):
        raise ValueError("Mellipayamak credentials are not set properly in settings.")

    try:
        api = Api(username, password)
        sms = api.sms()
        text = f"کد اعتبارسنجی شما {otp} می باشد لغو 11"
        response = sms.send(mobile, sender, text)
        return isinstance(response, dict) and str(response.get("Value")) == "0"
    except Exception as exc:  # pragma: no cover - network errors handled generically
        logger.error("Error sending OTP: %s", exc)
        return False