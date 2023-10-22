from rest_framework import serializers
from .models import Post, Like
from django.contrib.auth.models import User
from apps.user.serializers import UserSerializer, get_serialized_user_info
from apps.comment.serializers import get_serialized_user_comments

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


class LikeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['post', 'liker']

    def validate(self, data):   ##Check if user has already liked this post; if so then invalidate
        if Like.objects.filter(liker=data['liker'], post=data['post']):
            raise serializers.ValidationError("User already liked this post")
        return data

    def create(self, validated_data):
        like = Like.objects.create(**validated_data)
        return like
    
def get_serialized_like(like):
    serialized_user_data = get_serialized_user_info(like.liker, exclude=['bio', 'followers'])
    final_serialized_data = {}
    final_serialized_data['user'] = serialized_user_data
    return final_serialized_data

def get_serialized_post_likes(post):
    likes_data = []
    for like in post.likes.all():
        likes_data.append(get_serialized_like(like))
    return likes_data

def get_serialized_post(post, exclude_user=False):
    serialized_user_data = get_serialized_user_info(post.author, exclude=['bio', 'followers'])
    serialized_post_data = PostSerializer(post).data
    
    final_serialized_data = {}
    if not exclude_user:
        final_serialized_data['user'] = serialized_user_data
    final_serialized_data['post'] = serialized_post_data
    final_serialized_data['likes'] = get_serialized_post_likes(post)
    final_serialized_data['comments'] = get_serialized_user_comments(post)

    return final_serialized_data

def get_serialized_user_posts(user):
    posts_data = {}
    posts_data['user'] = get_serialized_user_info(user, exclude=['bio', 'followers'])
    posts_list = []
    for post in user.posts.all():
        posts_list.append(get_serialized_post(post, exclude_user=True))
    posts_data['posts'] = posts_list
    return posts_data

def get_serialized_posts(posts):
    posts_list = []
    for post in posts:
        posts_list.append(get_serialized_post(post))
    return posts_list