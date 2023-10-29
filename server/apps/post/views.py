from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from apps.user.models import UserInfo
from .models import Post, Like
from apps.user.serializers import UserSerializer, UserInfoSerializer
from .serializers import PostCreateSerializer, get_serialized_user_posts, get_serialized_posts, get_serialized_post_likes, get_serialized_post

from apps.user.utils import is_following
from traceback import print_exc as print_error

@api_view(['POST'])
@permission_classes([IsAuthenticated])
## Create post for user
def post_create_view(request):
    try:
        requestingUser = request.user

        serializer = PostCreateSerializer(data=request.data)
        if serializer.is_valid():  
            post = serializer.save(user_id=requestingUser.id)
            return Response(get_serialized_post(requestingUser, post), status=201)
        else:
            return Response("Invalid Request", status=400)

    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
## Retrieve posts for test
def posts_view(request, pk):
    try:
        requestingUser = request.user
        targetUser = User.objects.get(id=pk)
        
        if is_following(requesting_user=requestingUser, target_user=targetUser) or requestingUser.id == pk:
            serialized_posts_data = get_serialized_user_posts(requestingUser, targetUser)
            return Response(serialized_posts_data, status=200)
        else:
            return Response("Invalid Request", status=400)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed_view(request):
    try:
        requestingUser = request.user
        followedUserInfos = requestingUser.info.following.all()
        followedUsers = [followedUserInfo.user for followedUserInfo in followedUserInfos]
        relevantUsers = [requestingUser]
        relevantUsers.extend(followedUsers)
        relevantPosts = [post for post in Post.objects.filter(author__in=relevantUsers).order_by('-updated_at')]
        
        serialized_posts = get_serialized_posts(requestingUser, relevantPosts)
        return Response(serialized_posts, status=200)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def likes_view(request, pk):
    try:
        requestingUser = request.user
        targetPost = Post.objects.get(id=pk)

        if request.method == 'POST':
            ##Since no request data so no need for a serializer

            liked = Like.objects.filter(liker=requestingUser, post=targetPost)
            if liked:      #If this user already liked this post
                liked.delete()
                return Response("Like Deleted", status=200)
            else:
                Like.objects.create(post=targetPost, liker=requestingUser)
                return Response("Like created", status=201)
        elif request.method == 'GET':
            serialized_likes_data = get_serialized_post_likes(targetPost)
            return Response(serialized_likes_data, status=200)
        else:
            return Response("Invalid Request", status=400)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)

