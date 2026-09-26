from django.conf import settings
from django.contrib.sitemaps import Sitemap

from industries.models import Industry
from services.models import Service

STATIC_PAGES = [
    ('', 1.0, 'weekly'),
    ('about', 0.8, 'monthly'),
    ('services', 0.9, 'weekly'),
    ('industries', 0.8, 'monthly'),
    ('why-choose-us', 0.6, 'monthly'),
    ('how-we-work', 0.6, 'monthly'),
    ('service-areas', 0.6, 'monthly'),
    ('request-manpower', 0.9, 'weekly'),
    ('contact', 0.7, 'monthly'),
]


class StaticViewSitemap(Sitemap):
    def items(self):
        return STATIC_PAGES

    def location(self, item):
        path, _, _ = item
        return f'/{path}'

    def priority(self, item):
        return item[1]

    def changefreq(self, item):
        return item[2]


class ServiceSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8

    def items(self):
        return Service.objects.filter(is_active=True)

    def location(self, obj):
        return f'/services/{obj.slug}'

    def lastmod(self, obj):
        return obj.updated_at


class IndustrySitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.6

    def items(self):
        return Industry.objects.filter(is_active=True)

    def location(self, obj):
        return f'/industries#{obj.slug}'


sitemaps = {
    'static': StaticViewSitemap,
    'services': ServiceSitemap,
    'industries': IndustrySitemap,
}
