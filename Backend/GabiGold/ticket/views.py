from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Ticket, TicketMessage, Attachment
from .serializers import TicketSerializer, TicketMessageSerializer, AttachmentSerializer
from products.utils import send_sms

class IsAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user

class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        ticket = serializer.save(user=self.request.user)
        
        # Handle file attachments
        files = self.request.FILES.getlist('attachments')
        ticket_message = TicketMessage.objects.create(ticket=ticket, user=self.request.user, message=ticket.description)
        for file in files:
            Attachment.objects.create(ticket_message=ticket_message, file=file)

class AdminTicketListView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Ticket.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset
    
class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAdminOrOwner]

class TicketMessageCreateView(generics.CreateAPIView):
    serializer_class = TicketMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
            ticket = Ticket.objects.get(pk=self.kwargs['ticket_id'])
            if ticket.user != self.request.user and not self.request.user.is_staff:
                raise PermissionDenied("You do not have permission to add messages to this ticket.")
            ticket_message = serializer.save(user=self.request.user, ticket=ticket)
            
            # Handle file attachments
            files = self.request.FILES.getlist('attachments')
            for file in files:
                Attachment.objects.create(ticket_message=ticket_message, file=file)
            
            # Automatically update ticket status
            if self.request.user.is_staff:
                ticket.status = 'pending'
            else:
                ticket.status = 'open'
            ticket.save()
            send_sms(
                ticket.user.phone_number,
                f'به تیکت شما "{ticket.title}" پاسخ داده شده است. لطفاً برای جزئیات به حساب کاربری خود مراجعه کنید.'
            )
    def create(self, request, *args, **kwargs):
        print("Request data: %s", request.data)
        print("Request files: %s", request.FILES)
        response = super().create(request, *args, **kwargs)
        print("Response data: %s", response.data)
        return response

class TicketStatusUpdateView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        ticket = self.get_object()
        status = request.data.get('status')
        if status not in ['pending', 'closed']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        ticket.status = status
        ticket.save()
        send_sms(
            ticket.user.phone_number,
            f'وضعیت تیکت شما "{ticket.title}" به {ticket.status} به‌روزرسانی شد.'
        )
        return Response({'status': 'Ticket status updated successfully'})
