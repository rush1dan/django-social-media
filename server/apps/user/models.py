from django.db import models
from django.contrib.auth.models import User


def user_image(instance, filename):
    return f'user/{instance.id}/{filename}'

class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='info')
    image = models.ImageField(upload_to=user_image, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    followers = models.ManyToManyField('self', symmetrical=False, blank=True, null=True, related_name='following')

    @property
    def followed_users(self) -> list[User]:
        return [userInfo.user for userInfo in self.following.all()] #type:ignore

    @property
    def follower_users(self) -> list[User]:
        return [userInfo.user for userInfo in self.followers.all()] #type:ignore

    def __str__(self) -> str:
        return self.user.username
