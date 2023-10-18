from django.db import models
from django.contrib.auth import get_user_model
from apps.post.models import Post

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    text = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'Comment by user {self.author.get_username} on {self.post} post'
    
    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'

