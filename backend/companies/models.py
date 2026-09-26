from django.core.exceptions import ValidationError
from django.db import models

from core.models import TimeStampedModel


class CompanySettings(TimeStampedModel):
    """
    Singleton table holding editable company/contact information.
    Managed entirely through Django Admin so contact details can change
    without touching frontend code.
    """

    company_name = models.CharField(max_length=255, default='PHOENIX BIRDS')
    tagline = models.CharField(max_length=255, blank=True, default='Professional Manpower & Facility Support Solutions')

    phone_primary = models.CharField(max_length=20, blank=True)
    phone_secondary = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, help_text='Include country code, e.g. 91XXXXXXXXXX')
    email_primary = models.EmailField(blank=True)
    email_enquiries = models.EmailField(blank=True)

    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True, default='Madurai')
    state = models.CharField(max_length=100, blank=True, default='Tamil Nadu')
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True, default='India')

    google_maps_url = models.URLField(blank=True)
    office_hours = models.CharField(max_length=255, blank=True, default='Mon - Sat: 9:00 AM - 6:00 PM')

    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)

    logo = models.ImageField(upload_to='company/', blank=True, null=True)

    class Meta:
        verbose_name = 'Company Settings'
        verbose_name_plural = 'Company Settings'

    def __str__(self):
        return self.company_name

    def clean(self):
        if not self.pk and CompanySettings.objects.exists():
            raise ValidationError('Only one Company Settings record may exist. Edit the existing one instead.')

    def save(self, *args, **kwargs):
        self.full_clean(exclude=None, validate_unique=False)
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
