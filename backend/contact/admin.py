from django.contrib import admin

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'mobile_number', 'subject', 'is_read', 'created_at')
    list_editable = ('is_read',)
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'mobile_number', 'message')
    readonly_fields = ('name', 'mobile_number', 'subject', 'message', 'created_at', 'updated_at')

    def has_add_permission(self, request):
        return False
