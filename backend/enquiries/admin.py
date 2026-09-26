from django.contrib import admin

from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'company_name', 'mobile_number', 'industry',
        'service_display', 'location_display', 'manpower_required', 'status', 'created_at',
    )
    list_editable = ('status',)
    list_filter = ('status', 'industry', 'created_at')
    search_fields = ('name', 'company_name', 'mobile_number')
    readonly_fields = (
        'name', 'company_name', 'mobile_number', 'whatsapp_number',
        'industry', 'service', 'service_name_freeform', 'manpower_required',
        'location', 'location_freeform', 'preferred_start_date', 'message', 'created_at', 'updated_at',
    )
    fieldsets = (
        ('Enquiry Details', {
            'fields': (
                'name', 'company_name', 'mobile_number', 'whatsapp_number',
                'industry', 'service', 'service_name_freeform', 'manpower_required',
                'location', 'location_freeform', 'preferred_start_date', 'message',
            )
        }),
        ('Follow-up', {'fields': ('status', 'admin_notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    @admin.display(description='Service')
    def service_display(self, obj):
        return obj.service.title if obj.service else obj.service_name_freeform

    @admin.display(description='Location')
    def location_display(self, obj):
        return obj.location.name if obj.location else obj.location_freeform

    def has_add_permission(self, request):
        return False
