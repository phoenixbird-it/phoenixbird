import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_contact_notification(message):
    subject = f'New Contact Message: {message.subject or "General Enquiry"}'
    body = (
        f'A new contact message has been submitted on the PHOENIX BIRDS website.\n\n'
        f'Name: {message.name}\n'
        f'Mobile: {message.mobile_number}\n'
        f'Subject: {message.subject or "-"}\n\n'
        f'Message:\n{message.message}\n'
    )

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ENQUIRY_RECEIVER_EMAIL],
            fail_silently=False,
        )
    except Exception:
        logger.exception('Failed to send contact notification email for message id=%s', message.pk)
