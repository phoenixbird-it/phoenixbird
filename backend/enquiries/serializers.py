from rest_framework import serializers

from locations.models import Location
from services.models import Service

from .models import Enquiry


class EnquiryCreateSerializer(serializers.ModelSerializer):
    location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.filter(is_active=True), required=False, allow_null=True)
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.filter(is_active=True), required=False, allow_null=True)

    class Meta:
        model = Enquiry
        fields = [
            'name', 'company_name', 'mobile_number', 'whatsapp_number',
            'industry', 'service', 'service_name_freeform',
            'manpower_required', 'location', 'location_freeform',
            'preferred_start_date', 'message',
        ]

    def validate(self, attrs):
        if not attrs.get('location') and not attrs.get('location_freeform'):
            raise serializers.ValidationError({'location': 'Location is required.'})
        if not attrs.get('service') and not attrs.get('service_name_freeform'):
            raise serializers.ValidationError({'service': 'Please select the required service.'})
        return attrs

    def validate_message(self, value):
        if value and len(value) > 3000:
            raise serializers.ValidationError('Message is too long (max 3000 characters).')
        return value
