from django.conf import settings
from django.http import HttpResponse

from .sitemaps import sitemaps


def robots_txt(request):
    frontend_url = settings.FRONTEND_BASE_URL.rstrip('/')
    content = (
        'User-agent: *\n'
        'Allow: /\n'
        'Disallow: /admin/\n'
        'Disallow: /api/\n\n'
        f'Sitemap: {frontend_url}/sitemap.xml\n'
    )
    return HttpResponse(content, content_type='text/plain')


def sitemap_xml(request):
    frontend_url = settings.FRONTEND_BASE_URL.rstrip('/')
    urls = []
    for sitemap_cls in sitemaps.values():
        sitemap = sitemap_cls()
        for item in sitemap.items():
            loc = f'{frontend_url}{sitemap.location(item)}'
            urls.append({
                'loc': loc,
                'changefreq': sitemap.changefreq(item) if callable(sitemap.changefreq) else sitemap.changefreq,
                'priority': sitemap.priority(item) if callable(sitemap.priority) else sitemap.priority,
            })

    xml_items = '\n'.join(
        f'  <url><loc>{u["loc"]}</loc><changefreq>{u["changefreq"]}</changefreq><priority>{u["priority"]}</priority></url>'
        for u in urls
    )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'{xml_items}\n'
        '</urlset>'
    )
    return HttpResponse(xml, content_type='application/xml')
