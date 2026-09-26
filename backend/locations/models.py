from django.db import models
from django.utils.text import slugify

from core.models import ActivableModel, TimeStampedModel


class Location(TimeStampedModel, ActivableModel):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    state = models.CharField(max_length=100, default='Tamil Nadu')
    is_primary = models.BooleanField(default=False, help_text='Marks currently served core locations (e.g. Madurai)')

    class Meta(ActivableModel.Meta):
        pass

    def __str__(self):
        return f'{self.name}, {self.state}'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
