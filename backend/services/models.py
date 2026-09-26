from django.db import models
from django.utils.text import slugify

from core.models import ActivableModel, TimeStampedModel


class ServiceCategory(models.TextChoices):
    HOSPITALITY = 'hospitality', 'Hospitality Manpower'
    HOSPITAL = 'hospital', 'Hospital Manpower'
    INDUSTRIAL = 'industrial', 'Industrial Manpower'
    FACILITY_MANAGEMENT = 'facility_management', 'Facility Management'
    CLEANING = 'cleaning', 'Cleaning Services'
    GARDEN_LANDSCAPE = 'garden_landscape', 'Garden & Landscape Services'
    CORPORATE = 'corporate', 'Corporate Manpower'
    COMMERCIAL = 'commercial', 'Commercial Support Services'


class Service(TimeStampedModel, ActivableModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(max_length=30, choices=ServiceCategory.choices)
    short_description = models.CharField(max_length=255, blank=True)
    long_description = models.TextField(blank=True)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, help_text='Icon identifier, e.g. lucide icon name')

    class Meta(ActivableModel.Meta):
        pass

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
