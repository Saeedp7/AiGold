from django.contrib import admin
from .models import Ticket, TicketMessage, Attachment

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'status', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__phone_number', 'created_at', 'updated_at', 'status')
    list_filter = ('category', 'status', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'user', 'created_at')
    search_fields = ('ticket__title', 'user__username')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('ticket_message', 'file', 'uploaded_at')
    search_fields = ('ticket_message__ticket__title', 'ticket_message__user__username')
    date_hierarchy = 'uploaded_at'
    ordering = ('-uploaded_at',)
