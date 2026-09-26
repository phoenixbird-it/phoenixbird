from rest_framework import serializers

from .models import Service


class ServiceListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'slug', 'category', 'category_display', 'short_description', 'image', 'icon', 'display_order']


class ServiceDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'slug', 'category', 'category_display', 'short_description', 'long_description', 'image', 'icon']
