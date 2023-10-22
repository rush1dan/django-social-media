from django.contrib.auth.models import User
from .models import UserInfo
from traceback import print_exc as print_error

## If requesting user is following target user
def is_following(requesting_user, target_user):
    try:
        return UserInfo.objects.filter(user=target_user, followers=requesting_user.info)
    except Exception as ex:
        print_error()
        return False
    

## If requesting user is followedby target user
def is_followedby(requesting_user, target_user):
    try:
        return UserInfo.objects.filter(user=requesting_user, followers=target_user.info)
    except Exception as ex:
        print_error()
        return False