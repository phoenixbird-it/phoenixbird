from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .emails import send_contact_notification
from .serializers import ContactMessageCreateSerializer


class ContactThrottle(AnonRateThrottle):
    scope = 'contact_submit'


class ContactMessageCreateView(APIView):
    throttle_classes = [ContactThrottle]

    def post(self, request):
        serializer = ContactMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        send_contact_notification(message)
        return Response(
            {'detail': 'Thank you for reaching out to PHOENIX BIRDS. We will respond to you shortly.'},
            status=status.HTTP_201_CREATED,
        )
