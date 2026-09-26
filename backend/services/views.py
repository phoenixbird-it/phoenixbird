from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import Service
from .serializers import ServiceListSerializer, ServiceDetailSerializer


class ServiceListView(ListAPIView):
    serializer_class = ServiceListSerializer
    queryset = Service.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']


class ServiceDetailView(RetrieveAPIView):
    serializer_class = ServiceDetailSerializer
    queryset = Service.objects.filter(is_active=True)
    lookup_field = 'slug'
