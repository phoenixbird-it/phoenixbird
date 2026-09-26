from django.contrib import admin

from .models import Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'is_primary', 'is_active', 'display_order')
    list_editable = ('is_primary', 'is_active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
