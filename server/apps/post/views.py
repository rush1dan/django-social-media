from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from .models import Post, Like
from apps.user.serializers import UserSerializer, UserInfoSerializer
from .serializers import PostCreateSerializer, get_serialized_user_posts, LikeCreateSerializer

from apps.user.utils import is_following
from traceback import print_exc as print_error

@api_view(['POST'])
@permission_classes([IsAuthenticated])
## Retrieve posts for test
def post_create_view(request):
    try:
        requestingUser = request.user

        serializer = PostCreateSerializer(data=request.data)
        if serializer.is_valid():  
            post = serializer.save(user_id=requestingUser.id)
            return Response("Post created", status=201)
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
            serialized_posts_data = get_serialized_user_posts(targetUser)
            return Response(serialized_posts_data, status=200)
        else:
            return Response("Invalid Request", status=400)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likes_view(request, pk):
    try:
        requestingUser = request.user
        targetPost = Post.objects.get(id=pk)

        ##Since no request data so no need for a serializer

        liked = Like.objects.filter(liker=requestingUser, post=targetPost)
        if liked:      #If this user already liked this post
            liked.delete()
            return Response("Like Deleted", status=200)
        else:
            Like.objects.create(post=targetPost, liker=requestingUser)
            return Response("Like created", status=201)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)

