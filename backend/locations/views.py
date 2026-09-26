from rest_framework.generics import ListAPIView

from .models import Location
from .serializers import LocationSerializer


class LocationListView(ListAPIView):
    serializer_class = LocationSerializer
    queryset = Location.objects.filter(is_active=True)
