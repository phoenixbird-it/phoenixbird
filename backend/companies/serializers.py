from rest_framework import serializers

from .models import CompanySettings


class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySettings
        fields = [
            'company_name', 'tagline',
            'phone_primary', 'phone_secondary', 'whatsapp_number',
            'email_primary', 'email_enquiries',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country',
            'google_maps_url', 'office_hours',
            'facebook_url', 'instagram_url', 'linkedin_url', 'twitter_url',
            'logo',
        ]
