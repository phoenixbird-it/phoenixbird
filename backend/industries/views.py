from rest_framework.generics import ListAPIView

from .models import Industry
from .serializers import IndustrySerializer


class IndustryListView(ListAPIView):
    serializer_class = IndustrySerializer
    queryset = Industry.objects.filter(is_active=True)
