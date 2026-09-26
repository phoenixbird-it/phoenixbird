import logging

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Ensure API errors never leak internal details to the client."""

    response = exception_handler(exc, context)

    if response is not None:
        return response

    logger.exception('Unhandled API exception', exc_info=exc)
    return Response(
        {'detail': 'Something went wrong on our end. Please try again shortly.'},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
