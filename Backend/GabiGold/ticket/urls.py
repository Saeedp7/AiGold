from django.urls import path
from .views import TicketListCreateView, TicketDetailView, TicketMessageCreateView, TicketStatusUpdateView, AdminTicketListView

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('tickets/<int:ticket_id>/messages/', TicketMessageCreateView.as_view(), name='ticket-message-create'),
    path('tickets/<int:pk>/status/', TicketStatusUpdateView.as_view(), name='ticket-status-update'),
    path('admintickets/', AdminTicketListView.as_view(), name='admin-ticket-list'),
]
