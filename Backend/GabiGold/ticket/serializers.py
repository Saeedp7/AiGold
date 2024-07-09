from rest_framework import serializers
from .models import Ticket, TicketMessage, Attachment
from Cart.models import Order
from Cart.serializers import OrderSerializer

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'file', 'uploaded_at']

class TicketMessageSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = TicketMessage
        fields = ['id', 'user', 'message', 'created_at', 'attachments']

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Message cannot be empty.")
        return value

class TicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.username')
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'user', 'category', 'status', 'title', 'description', 'order', 'created_at', 'updated_at', 'messages']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title is required.")
        return value

    def validate_category(self, value):
        if not value:
            raise serializers.ValidationError("Category is required.")
        return value

    def validate(self, data):
        if data['category'] == 'order':
            order_id = self.initial_data.get('order_id')
            if not order_id:
                raise serializers.ValidationError("An order must be selected for 'Not Completed Orders' category.")
            try:
                order = Order.objects.get(id=order_id, user=self.context['request'].user)
                if order.status == 'DELIVERED':
                    raise serializers.ValidationError("Cannot select an order that is already delivered.")
            except Order.DoesNotExist:
                raise serializers.ValidationError("Order does not exist or does not belong to the user.")
        return data

    def create(self, validated_data):
        order_id = self.initial_data.get('order_id')
        if validated_data['category'] == 'order' and order_id:
            order = Order.objects.get(id=order_id)
            validated_data['order'] = order
        return super().create(validated_data)
