from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from .models import Post
from apps.user.serializers import UserSerializer, UserInfoSerializer
from .serializers import PostCreateSerializer, get_serialized_user_posts

from traceback import print_exc as print_error

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
## Retrieve own posts
def posts_view(request, pk):
    try:
        requestingUser = request.user
        targetUser = User.objects.get(id=pk)
        if request.method == 'GET':
            serialized_posts_data = get_serialized_user_posts(requestingUser)
            return Response(serialized_posts_data, status=200)
        elif request.method == 'POST':
            serializer = PostCreateSerializer(data=request.data)
            if serializer.is_valid():  
                post = serializer.save(user_id=requestingUser.id)
                return Response("Post created", status=201)
            else:
                return Response("Invalid Request", status=400)
        else:
            return Response("Invalid Request", status=400)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)

