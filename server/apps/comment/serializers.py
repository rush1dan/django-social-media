from rest_framework import serializers
from apps.post.models import Post
from .models import Comment
from django.contrib.auth.models import User
from apps.user.serializers import UserSerializer, get_serialized_user_info

## For creating post
class CommentCreateSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Comment
        fields = ['text']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        user = User.objects.get(id=user_id)
        post_id = validated_data.pop('post_id')
        post = Post.objects.get(id=post_id)
        comment = Comment.objects.create(post=post, author=user, **validated_data)
        return comment
    

## For retrieving comment data
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        exclude = ['post', 'author']


def get_serialized_user_comment(comment):
    serialized_user_data = get_serialized_user_info(comment.author, exclude=['bio', 'followers'])
    serialized_comment_data = CommentSerializer(comment).data
    
    final_serialized_data = {}
    final_serialized_data['user'] = serialized_user_data
    final_serialized_data['comment'] = serialized_comment_data

    return final_serialized_data

def get_serialized_user_comments(post):
    comments_data = []
    for comment in post.comments.all():
        comments_data.append(get_serialized_user_comment(comment))
    return comments_data