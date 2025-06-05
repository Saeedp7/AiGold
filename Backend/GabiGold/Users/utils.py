import requests
from django.conf import settings
from libs.melipayamak import Api

def send_otp(mobile, otp):
    username = settings.MELLIPAYAMAK_USERNAME
    password = settings.MELLIPAYAMAK_PASSWORD
    sender = settings.MELLIPAYAMAK_SENDER_NUMBER

    if not all([username, password, sender]):
            raise ValueError("Mellipayamak credentials are not set properly in settings.")

    api = Api(username, password)
    sms = api.sms()
    _from = '10007136340201'
    text = f'کد اعتبارسنجی شما {otp} می باشد لغو 11'
    response = sms.send(mobile, _from, text)

    if isinstance(response, dict) and response.get('Value') == 0:
       return True
    else:
       return False
    except Exception as e:
       print(f"Error sending OTP: {e}")
       return False