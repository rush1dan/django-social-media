from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth.models import User
from apps.user.serializers import UserCreateSerializer
from apps.post.serializers import PostCreateSerializer, get_serialized_post
from apps.user.utils import is_following

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
    
@api_view(['POST'])
## Create post for user
def post_create_view(request, pk):
    try:
        requestingUser = User.objects.get(id=pk)

        serializer = PostCreateSerializer(data=request.data)
        if serializer.is_valid():  
            post = serializer.save(user_id=requestingUser.pk)
            return Response(get_serialized_post(requestingUser, post), status=201)
        else:
            return Response("Invalid Request", status=400)

    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)
    

@api_view(['POST'])
def follow_view(request, pk):
    try:
        requestingUser = User.objects.get(id=request.query_params.get('requesting_id'))
        targetUser = User.objects.get(id=pk)

        if is_following(requesting_user=requestingUser, target_user=targetUser):
                targetUser.info.followers.remove(requestingUser.info)   #type:ignore
                return Response({'is_following': False}, status=200)
        elif requestingUser.id != pk:   #type:ignore
            targetUser.info.followers.add(requestingUser.info)  #type:ignore
            return Response({'is_following': True}, status=200)
        else:
            return Response("Invalid Request", status=400)
    except Exception as ex:
        print_error()
        return Response('Something went wrong', status=500)
