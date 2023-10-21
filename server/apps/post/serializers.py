from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User
from apps.user.serializers import UserSerializer

## For creating post
class PostCreateSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Post
        fields = ['description', 'image']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        user = User.objects.get(id=user_id)
        post = Post.objects.create(author=user, **validated_data)
        return post
    

## For retrieving post
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        exclude = ['author']