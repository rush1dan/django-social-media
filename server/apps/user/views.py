from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from apps.user.serializers import (UserCreateSerializer)
from django.core.exceptions import ObjectDoesNotExist

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register_view(request):
    try:
        # Use this block if unique email needs to be enforced
        # try:
        #     user = User.objects.get(email=request.data['email'])
        #     return Response("User Already Exists.", status=400)
        # except ObjectDoesNotExist:
        #     print("User doesn't exist...Good to go.")
        
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():   #Will be false for non-unique/null username
            user = serializer.save()
            return Response("User Created", status=201)
        else:
            return Response("Invalid Data", status=400)
    except Exception as ex:
        return Response("Something went wrong", status=500)
    

    ## Authentications requires unique username and password only for default User model

@api_view(['POST'])
def login_view(request):
    try:
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            return Response("User Authenticated", status=200)
        else:
            return Response("Invalid Credentials", status=401)
    except Exception as ex:
        return Response("Something went wrong", status=500)