from django.contrib.auth.models import User
from .models import UserInfo
from rest_framework import serializers

## For sending information regarding user to the requesting client
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #exclude = ['password']
        fields = ['id', 'username', 'first_name', 'last_name']      #id required to access profile link


## For registering user
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        userInfo = UserInfo.objects.create(user=user)
        return user
    

## Creating and sending user info
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        exclude = ['user']