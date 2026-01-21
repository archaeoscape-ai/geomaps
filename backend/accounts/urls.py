from accounts import views
from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path("token/", views.CustomObtainTokenPairView.as_view(), name="token-obtain-pair"),
    path(
        "token/refresh/",
        views.CustomCookieTokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("token/logout/", views.LogoutView.as_view(), name="token-logout"),
    path("me/", views.RequestUserDetailView.as_view(), name="request-user-detail"),
    path("users/<int:pk>/", views.UserDetailView.as_view(), name="user-detail"),
]
