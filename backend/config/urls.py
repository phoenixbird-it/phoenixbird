from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from core.views import robots_txt, sitemap_xml

api_v1_patterns = [
    path('services/', include('services.urls')),
    path('industries/', include('industries.urls')),
    path('locations/', include('locations.urls')),
    path('enquiries/', include('enquiries.urls')),
    path('contact/', include('contact.urls')),
    path('company-settings/', include('companies.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns)),
    path('robots.txt', robots_txt, name='robots-txt'),
    path('sitemap.xml', sitemap_xml, name='sitemap-xml'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
