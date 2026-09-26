from rest_framework import serializers

from .models import Industry


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id', 'name', 'slug', 'short_description', 'description', 'image', 'icon', 'display_order']
