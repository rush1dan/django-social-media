from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User
from apps.user.serializers import UserSerializer, get_serialized_user_info

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



def get_serialized_user_post(post):
    serialized_user_data = get_serialized_user_info(post.author, exclude=['bio', 'followers'])
    serialized_post_data = PostSerializer(post).data
    
    final_serialized_data = {}
    final_serialized_data['user'] = serialized_user_data
    final_serialized_data['post'] = serialized_post_data

    return final_serialized_data

def get_serialized_user_posts(user):
    posts_data = []
    for post in user.posts.all():
        posts_data.append(get_serialized_user_post(post))
    return posts_data