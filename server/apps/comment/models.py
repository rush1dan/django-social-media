from django.db import models
from django.contrib.auth.models import User
from apps.post.models import Post

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'Comment by user {self.author.get_username} on {self.post} post'
    
    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'

