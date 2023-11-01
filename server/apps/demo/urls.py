from django.urls import path
from apps.demo import views as demo_views

urlpatterns = [
    path('demo_register/', demo_views.register_view),
]