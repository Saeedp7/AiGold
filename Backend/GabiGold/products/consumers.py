# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GoldenPrice

class GoldPriceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Adding to group to receive updates
        await self.channel_layer.group_add("gold_price", self.channel_name)
        await self.accept()
        # Send initial gold price
        await self.send_gold_price()

    async def disconnect(self, close_code):
        # Removing from group on disconnect
        await self.channel_layer.group_discard("gold_price", self.channel_name)

    @database_sync_to_async
    def get_latest_gold_price(self):
        # Fetching the latest price from the database
        try:
            return GoldenPrice.objects.filter(slug='18ayar').latest('timestamp').price
        except GoldenPrice.DoesNotExist:
            return "No price available"

    async def send_gold_price(self):
        # Sending the latest gold price to the client
        gold_price = await self.get_latest_gold_price()
        await self.send(text_data=json.dumps({'gold_price': str(gold_price)}))

    # You can call this method periodically to update all clients
    async def send_updates(self):
        await self.send_gold_price()
