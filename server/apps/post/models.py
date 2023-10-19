from django.db import models
from django.contrib.auth.models import User

def upload_to(instance, filename):
    return f'post/{instance.id}/{filename}'

class Post(models.Model):
    description = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to=upload_to, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(User, related_name='likes_set', blank=True, verbose_name='Likes')

    def __str__(self) -> str:
        return f'{self.author.username} - {self.id}'    #type:ignore #to suppress error indication as id will be generated later
    
    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

