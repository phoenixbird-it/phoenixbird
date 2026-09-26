from django.db import models

from core.models import TimeStampedModel
from enquiries.models import phone_validator


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=150)
    mobile_number = models.CharField(max_length=20, validators=[phone_validator])
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.subject or "General Enquiry"}'
