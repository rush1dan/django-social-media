from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from .models import UserInfo
from django.contrib.auth import authenticate
from apps.user.serializers import UserCreateSerializer, UserSerializer, get_serialized_user_info
from apps.post.serializers import get_serialized_user_posts
from django.core.exceptions import ObjectDoesNotExist
from .utils import is_following

from traceback import print_exc as print_error

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register_view(request):
    try:
        # Use this block if unique email needs to be enforced
        # try:
        #     user = User.objects.get(email=request.data['email'])
        #     return Response("User Already Exists.", status=400)
        # except ObjectDoesNotExist:
        #     print("User doesn't exist...Good to go.")
        
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():   #Will be false for non-unique/null username
            user = serializer.save()
            return Response("User Created", status=201)
        else:
            return Response("Invalid Data", status=400)
    except Exception as ex:
        return Response("Something went wrong", status=500)
    

    ## Authentications requires unique username and password only for default User model

# @api_view(['POST'])
# def login_view(request):
#     try:
#         user = authenticate(username=request.data['username'], password=request.data['password'])
#         if user is not None:
#             return Response("User Authenticated", status=200)
#         else:
#             return Response("Invalid Credentials", status=401)
#     except Exception as ex:
#         return Response("Something went wrong", status=500)

## Login to be handled through JWT authentication


## Send in the access token in the Authorization header of the request like Authorization: 'Bearer [access token]'
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    try:
        user = request.user
        serialized_user = get_serialized_user_info(user, exclude=['followers'])
        return Response(serialized_user, status=200)
    except Exception as ex:
        return Response("Something went wrong", status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request, pk):
    try:
        requestingUser = request.user
        if requestingUser.id == pk:   #user viewing own profile
            serialized_posts_data = get_serialized_user_posts(requestingUser, requestingUser)
            return Response(serialized_posts_data, status=200)
        else:   #not own profile
            targetUser = User.objects.get(id=pk)
            if is_following(requesting_user=requestingUser, target_user=targetUser):     #user following this profile's user
                serialized_posts_data = get_serialized_user_posts(requestingUser, targetUser)
                return Response(serialized_posts_data, status=200)
            else:   #user not following this profile's user
                return Response('Not following', status=403)
    except Exception as ex:
        print_error()
        return Response('Something went wrong', status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_view(request, pk):
    try:
        requestingUser = request.user
        targetUser = User.objects.get(id=pk)

        if is_following(requesting_user=requestingUser, target_user=targetUser):
            targetUser.info.followers.remove(requestingUser.info)   #type:ignore
            return Response(f'Unfollowed {targetUser.first_name} {targetUser.last_name}', status=200)
        elif requestingUser.id != pk:
            targetUser.info.followers.add(requestingUser.info)  #type:ignore
            return Response(f'Following {targetUser.first_name} {targetUser.last_name}', status=200)
        else:
            return Response("Invalid Request", status=400)
    except Exception as ex:
        print_error()
        return Response('Something went wrong', status=500)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def following_view(request):
    try:
        requestingUser = request.user
        followed_users = requestingUser.info.followed_users
        serialized_data = [get_serialized_user_info(user, exclude=['bio', 'followers']) for user in followed_users]
        return Response(serialized_data, status=200)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def followers_view(request):
    try:
        requestingUser = request.user
        follower_users = requestingUser.info.follower_users
        serialized_data = [get_serialized_user_info(user, exclude=['bio', 'followers']) for user in follower_users]
        return Response(serialized_data, status=200)
    except Exception as ex:
        print_error()
        return Response("Something went wrong", status=500)