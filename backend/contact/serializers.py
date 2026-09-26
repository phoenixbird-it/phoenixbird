from rest_framework import serializers

from .models import ContactMessage


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'mobile_number', 'subject', 'message']

    def validate_message(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError('Message is too short.')
        if len(value) > 3000:
            raise serializers.ValidationError('Message is too long (max 3000 characters).')
        return value
