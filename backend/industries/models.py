from django.db import models
from django.utils.text import slugify

from core.models import ActivableModel, TimeStampedModel


class Industry(TimeStampedModel, ActivableModel):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    short_description = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='industries/', blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, help_text='Icon identifier, e.g. lucide icon name')

    class Meta(ActivableModel.Meta):
        verbose_name_plural = 'Industries'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
