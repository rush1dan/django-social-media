from django.db import models
from django.contrib.auth.models import User


def user_image(instance, filename):
    return f'user/{instance.id}/{filename}'

class UserInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=user_image, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return self.user.username
