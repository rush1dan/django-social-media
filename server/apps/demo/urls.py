from django.urls import path
from apps.demo import views as demo_views

urlpatterns = [
    path('demo_register/', demo_views.register_view),
    path('demo_post/<int:pk>/', demo_views.post_create_view)
]