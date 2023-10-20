from django.urls import path
from apps.user import views as user_views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', user_views.register_view),
    #path('login/', views.login_view)


    path('token/', user_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('test/', user_views.authentication_test_view)
]