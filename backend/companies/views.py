from rest_framework.generics import RetrieveAPIView

from .models import CompanySettings
from .serializers import CompanySettingsSerializer


class CompanySettingsView(RetrieveAPIView):
    serializer_class = CompanySettingsSerializer

    def get_object(self):
        return CompanySettings.load()
