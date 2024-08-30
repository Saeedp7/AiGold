import requests
from django.conf import settings
from libs.melipayamak import Api

def send_otp(mobile, otp):
    api = Api(MELLIPAYAMAK_USERNAME, MELLIPAYAMAK_PASSWORD)
    sms = api.sms()
    _from = '10007136340201'
    text = f'کد اعتبارسنجی شما {otp} می باشد لغو 11'
    response = sms.send(mobile, _from, text)
    print(response)
    return bool(response.ok)