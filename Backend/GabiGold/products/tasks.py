import requests
from .models import GoldenPrice
from datetime import datetime


def fetch_gold_price():
    url = 'https://sourcearena.ir/api/?token=ad87a7f78ba729d918ea3769838e53a2&currency&v2'
    headers = {
        'User-Agent': 'PostmanRuntime/7.39.0',
        'Accept': 'application/json'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise exception for bad responses (4xx or 5xx)
        data = response.json()
        for item_key, item_value in data.items():
            if item_key == '18ayar' or  item_key == 'nim' or item_key == 'gerami' or item_key == 'abshodeh' or item_key == 'rob' or item_key == 'bahar' or item_key == 'sekkeh' or item_key=='usd_xau' or item_key=='usd' or item_key=='eur':
                print(item_key)
                print(item_value)
                GoldenPrice.objects.update_or_create(
                    slug=item_key,
                    defaults={
                        'name': item_key,
                        'price': item_value['value'],
                        'change': item_value['change_val'],
                        'change_percent': item_value['change_pct'],
                        'min_price': "0",
                        'max_price': "0",
                        'last_update': datetime.strptime(item_value['last_update'], '%Y-%m-%d %H:%M:%S'),
                        'jalali_last_update': datetime.strptime(item_value['last_update'], '%Y-%m-%d %H:%M:%S'),
                    }
                )

        print('Data updated successfully')

    except requests.exceptions.RequestException as e:
        print(f'Error fetching data: {e}')
