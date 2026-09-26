from django.core.validators import MinValueValidator, RegexValidator
from django.db import models

from core.models import TimeStampedModel
from locations.models import Location
from services.models import Service

phone_validator = RegexValidator(
    regex=r'^\+?[0-9\s-]{7,15}$',
    message='Enter a valid phone number.',
)


class IndustryChoice(models.TextChoices):
    HOTEL_HOSPITALITY = 'hotel_hospitality', 'Hotel / Hospitality'
    HOSPITAL_HEALTHCARE = 'hospital_healthcare', 'Hospital / Healthcare'
    INDUSTRIAL = 'industrial', 'Industrial'
    MANUFACTURING = 'manufacturing', 'Manufacturing'
    CORPORATE = 'corporate', 'Corporate'
    COMMERCIAL = 'commercial', 'Commercial'
    RESORT = 'resort', 'Resort'
    RESIDENCY = 'residency', 'Residency'
    OTHER = 'other', 'Other'


class EnquiryStatus(models.TextChoices):
    NEW = 'new', 'New'
    CONTACTED = 'contacted', 'Contacted'
    IN_DISCUSSION = 'in_discussion', 'In Discussion'
    PROPOSAL_SENT = 'proposal_sent', 'Proposal Sent'
    CONVERTED = 'converted', 'Converted'
    CLOSED = 'closed', 'Closed'


class Enquiry(TimeStampedModel):
    name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200, blank=True)
    mobile_number = models.CharField(max_length=20, validators=[phone_validator])
    whatsapp_number = models.CharField(max_length=20, blank=True, validators=[phone_validator])

    industry = models.CharField(max_length=30, choices=IndustryChoice.choices)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='enquiries')
    service_name_freeform = models.CharField(max_length=200, blank=True, help_text='Used if the requested service is not in the catalog')

    manpower_required = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='enquiries')
    location_freeform = models.CharField(max_length=200, blank=True)

    preferred_start_date = models.DateField(null=True, blank=True)
    message = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=EnquiryStatus.choices, default=EnquiryStatus.NEW)
    admin_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Enquiries'

    def __str__(self):
        return f'{self.name} - {self.get_industry_display()} ({self.created_at:%Y-%m-%d})'
