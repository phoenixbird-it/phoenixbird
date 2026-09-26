from django.contrib import admin

from .models import CompanySettings


@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Company', {'fields': ('company_name', 'tagline', 'logo')}),
        ('Contact', {'fields': ('phone_primary', 'phone_secondary', 'whatsapp_number', 'email_primary', 'email_enquiries')}),
        ('Address', {'fields': ('address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'google_maps_url', 'office_hours')}),
        ('Social Media', {'fields': ('facebook_url', 'instagram_url', 'linkedin_url', 'twitter_url')}),
    )

    def has_add_permission(self, request):
        return not CompanySettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
