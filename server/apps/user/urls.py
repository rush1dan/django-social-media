from django.urls import path
from apps.user import views

urlpatterns = [
    path('register/', views.register_view),
    path('login/', views.login_view)
]