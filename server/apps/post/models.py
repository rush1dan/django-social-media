from django.db import models
from django.contrib.auth.models import User

def upload_to(instance, filename):
    return f'user_{instance.author.id}/posts/{filename}'

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    description = models.TextField(blank=False, null=False)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'{self.author.username} - {self.id}'    #type:ignore #to suppress error indication as id will be generated later
    
    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')

    def __str__(self) -> str:
        return f'Like {self.id} by {self.liker.username} on post {self.post.id}'    #type:ignore

    class Meta:
        verbose_name = 'Like'
        verbose_name_plural = 'Likes'

