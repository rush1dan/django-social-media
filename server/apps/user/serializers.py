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
    

## Sending user info
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        exclude = ['user']

class UserInfoEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['bio', 'image']

    def update(self, instance, validated_data):
        instance.bio = validated_data['bio']
        instance.image = validated_data['image']
        instance.save()
        return instance


## For retrieving custom required JSON data
def get_serialized_user_info(user, fields = ['id', 'username', 'first_name', 'last_name', 'bio', 'image'], exclude=[]):
    serialized_user_data = UserSerializer(user).data
    serialized_userinfo_data = UserInfoSerializer(user.info).data
    del serialized_userinfo_data['id']

    final_serialized_data = serialized_user_data
    final_serialized_data.update(serialized_userinfo_data)

    copy_data = final_serialized_data.copy()

    for key in copy_data:
        if key not in fields or key in exclude:
            del final_serialized_data[key]

    return final_serialized_data

def get_serialized_users(users):
    serialized_user_data = []
    for user in users:
        serialized_user_data.append(get_serialized_user_info(user, exclude=['bio', 'followers']))
    return serialized_user_data