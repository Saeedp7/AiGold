import requests
from django.conf import settings
API_KEY = (settings.KAVENEGAR_API_KEY)
def send_otp(mobile, otp):
    """
    Send message.
    """
    url=f"https://api.kavenegar.com/v1/{API_KEY}/verify/lookup.json?receptor={mobile}&token={otp}&template=gabigold&type=sms"
    # url = f"https://2factor.in/API/V1/{settings.SMS_API_KEY}/SMS/{mobile}/{otp}/Your OTP is"
    # payload = ""
    # headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = requests.get(url)
    print(response)
    return bool(response.ok)