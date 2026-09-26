from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base model providing created/updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ActivableModel(models.Model):
    """Abstract base model for content that can be toggled active/inactive and ordered."""

    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ['display_order', 'id']
