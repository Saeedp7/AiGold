from django.db import models
from django.conf import settings
from Cart.models import Order

def validate_file_size(value):
    filesize = value.size

    if filesize > 10485760:  # 10 MB limit
        raise ValidationError("The maximum file size that can be uploaded is 10 MB")
    else:
        return value
    
class Ticket(models.Model):
    CATEGORY_CHOICES = [
        ('order', 'Not Completed Orders'),
        ('general', 'General Question'),
        ('technical', 'Technical Issues'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('pending', 'Pending'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tickets')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.title} - {self.user.username}'

class TicketMessage(models.Model):
    ticket = models.ForeignKey(Ticket, related_name='messages', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message by {self.user.username} on {self.ticket.title}'

class Attachment(models.Model):
    ticket_message = models.ForeignKey(TicketMessage, related_name='attachments', on_delete=models.CASCADE)
    file = models.FileField(upload_to='attachments/', validators=[validate_file_size])
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Attachment for {self.ticket_message.ticket.title} by {self.ticket_message.user.username}'
