from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, generics, status
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .permissions import AdminOnlyPermission
from .serializers import (
    CustomCookieTokenRefreshSerializer,
    CustomTokenObtainPairSerializer,
    UserInfoSerializer,
    UserUpdateSerializer,
)


class CustomObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get(settings.AUTH_REFRESH_TOKEN_NAME):
            # # # Move refresh token from body to HttpOnly cookie

            refresh_token_name = settings.AUTH_REFRESH_TOKEN_NAME
            persist = request.data.get("persist", False)
            max_age = response.data["lifetime"] if persist else None

            response.set_cookie(
                refresh_token_name,
                response.data[refresh_token_name],
                max_age=max_age,
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            # Remove from body
            del response.data[refresh_token_name]
            del response.data["lifetime"]

        return super().finalize_response(request, response, *args, **kwargs)


class CustomCookieTokenRefreshView(TokenRefreshView):
    serializer_class = CustomCookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get(settings.AUTH_REFRESH_TOKEN_NAME):
            # # # Move refresh token from body to HttpOnly cookie

            refresh_token_name = settings.AUTH_REFRESH_TOKEN_NAME
            persist = request.data.get("persist", False)
            max_age = response.data["lifetime"] if persist else None

            response.set_cookie(
                refresh_token_name,
                response.data[refresh_token_name],
                max_age=max_age,
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            # Remove from body
            del response.data[refresh_token_name]
            del response.data["lifetime"]

        return super().finalize_response(request, response, *args, **kwargs)


class LogoutView(APIView):
    renderer_classes = [JSONRenderer]
    permission_classes = []

    @swagger_auto_schema(
        responses={"200": "OK", "400": "Bad Request"},
        operation_id="LogoutUser",
        operation_description="Logout user and  clean cookies",
    )
    def post(self, request, *args, **kwargs):
        response = Response()

        response.set_cookie(
            "sessionid", None, max_age=1, httponly=True
        )  # logout from django admin!
        response.set_cookie(
            settings.AUTH_REFRESH_TOKEN_NAME,
            None,
            max_age=1,
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )

        return response


class UserListView(generics.ListAPIView):
    serializer_class = UserInfoSerializer
    queryset = User.objects.all()
    permission_classes = [AdminOnlyPermission]

    filter_backends = (
        filters.SearchFilter,
        filters.OrderingFilter,
    )
    search_fields = ("first_name", "last_name", "email")
    ordering_fields = ("last_name", "first_name")
    ordering = ("last_name",)


class RequestUserDetailView(APIView):
    renderer_classes = [JSONRenderer]
    permission_classes = []

    @swagger_auto_schema(
        responses={"200": "OK", "400": "Bad Request", "401": "Unauthorized"},
        operation_id="UserDetail",
        operation_description="Get details for request user",
    )
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        data = UserInfoSerializer(user).data
        return Response(status=status.HTTP_200_OK, data=data)

    @swagger_auto_schema(
        responses={"200": "OK", "400": "Bad Request"},
        operation_id="UserDetailUpdate",
        operation_description="Update details for request user",
        request_body=UserUpdateSerializer,
    )
    def put(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        data = self.request.data

        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.save()

        user_data = UserInfoSerializer(user).data
        return Response(status=status.HTTP_200_OK, data=user_data)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserUpdateSerializer
    queryset = User.objects.all()
    permission_classes = [AdminOnlyPermission]
