from rest_framework.response import Response
from rest_framework.decorators import api_view

from apps.user.serializers import UserCreateSerializer

from traceback import print_exc as print_error

@api_view(['POST'])
def register_view(request):
    try:
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():   #Will be false for non-unique/null username
            user = serializer.save()
            return Response("User Created", status=201)
        else:
            return Response("Invalid Data", status=400)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)
