from django.urls import path
from apps.comment import views as comment_views

urlpatterns = [
    path('comments/<int:pk>/', comment_views.comments_view)
]