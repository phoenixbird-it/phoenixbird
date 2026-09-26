import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_enquiry_notification(enquiry):
    """Notify the company inbox of a new manpower enquiry. Failures are logged, never raised to the user."""

    subject = f'New Manpower Enquiry: {enquiry.name} ({enquiry.get_industry_display()})'
    service_label = enquiry.service.title if enquiry.service else enquiry.service_name_freeform
    location_label = enquiry.location.name if enquiry.location else enquiry.location_freeform

    body = (
        f'A new manpower enquiry has been submitted on the PHOENIX BIRDS website.\n\n'
        f'Name: {enquiry.name}\n'
        f'Company: {enquiry.company_name or "-"}\n'
        f'Mobile: {enquiry.mobile_number}\n'
        f'WhatsApp: {enquiry.whatsapp_number or "-"}\n'
        f'Industry: {enquiry.get_industry_display()}\n'
        f'Service: {service_label}\n'
        f'Manpower Required: {enquiry.manpower_required or "-"}\n'
        f'Location: {location_label}\n'
        f'Preferred Start Date: {enquiry.preferred_start_date or "-"}\n\n'
        f'Message:\n{enquiry.message or "-"}\n'
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
        logger.exception('Failed to send enquiry notification email for enquiry id=%s', enquiry.pk)
