from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .emails import send_enquiry_notification
from .serializers import EnquiryCreateSerializer


class EnquiryThrottle(AnonRateThrottle):
    scope = 'enquiry_submit'


class EnquiryCreateView(APIView):
    throttle_classes = [EnquiryThrottle]

    def post(self, request):
        serializer = EnquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry = serializer.save()
        send_enquiry_notification(enquiry)
        return Response(
            {'detail': 'Thank you for contacting PHOENIX BIRDS. Our team will get in touch with you shortly.'},
            status=status.HTTP_201_CREATED,
        )
