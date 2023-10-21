from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from .models import Post
from apps.user.serializers import UserSerializer, UserInfoSerializer
from .serializers import PostCreateSerializer, PostSerializer

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
    


def get_serialized_user_post(post):
    serialized_user_data = UserSerializer(post.author).data
    serialized_post_data = PostSerializer(post).data
    serialized_user_info_data = UserInfoSerializer(post.author.info).data

    del serialized_post_data['likes']
    usef_info_keys_to_remove = ['bio', 'followers']
    for key in usef_info_keys_to_remove:
        del serialized_user_info_data[key]

    user_data = {}
    user_data.update(serialized_user_data)
    user_data.update(serialized_user_info_data)
    
    final_serialized_data = {}
    final_serialized_data['user'] = user_data
    final_serialized_data['post'] = serialized_post_data

    return final_serialized_data

def get_serialized_user_posts(user):
    posts_data = []
    for post in user.posts.all():
        posts_data.append(get_serialized_user_post(post))
    return posts_data

