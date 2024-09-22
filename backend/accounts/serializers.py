from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions as django_exceptions
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from .models import Organization

User = get_user_model()


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ("id", "name", "contact_email", "description", "logo")


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name")


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""

    class Meta:
        model = get_user_model()
        fields = ["email", "password"]
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}

    def create(self, validated_data):
        """Create and return a user with encrypted password."""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class UserInfoSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer()

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "organization",
            "app_role_id",
            "app_role_name",
            "is_admin",
        )


class UserUpdateSerializer(serializers.ModelSerializer):
    is_admin = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "is_admin",
            "app_role_id",
            "app_role_name",
        )

    def update(self, instance, validated_data):
        is_admin = validated_data.pop("is_admin", None)
        instance = super().update(instance, validated_data)

        if is_admin is not None:
            admin_group, _ = Group.objects.get_or_create(name="Administrator")
            if is_admin:
                instance.groups.add(admin_group)
            else:
                instance.groups.remove(admin_group)

        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        # Custom token names
        data[settings.AUTH_REFRESH_TOKEN_NAME] = str(refresh)
        data[settings.AUTH_ACCESS_TOKEN_NAME] = str(refresh.access_token)
        # used to keep exact expiration time, will be removed from body before sending to client!
        data["lifetime"] = refresh.lifetime

        return data

    @classmethod
    def get_token(cls, user):
        token = super(CustomTokenObtainPairSerializer, cls).get_token(user)

        # TODO: Get user group goes here

        # Add custom claims
        token["username"] = (
            user.email if user.USERNAME_FIELD == "email" else user.username
        )
        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser
        return token


class CustomCookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        # Check if refresh token was included
        refresh_token = self.context["request"].COOKIES.get(
            settings.AUTH_REFRESH_TOKEN_NAME
        )
        if not refresh_token:
            raise InvalidToken(_("No valid refresh token found!"))
        attrs["refresh"] = refresh_token
        refresh = self.token_class(attrs["refresh"])

        data = {settings.AUTH_ACCESS_TOKEN_NAME: str(refresh.access_token)}

        if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS"):
            if settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION"):
                try:
                    # Attempt to blacklist the given refresh token
                    refresh.blacklist()
                except AttributeError:
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            data["refresh"] = str(refresh)
            data["lifetime"] = refresh.lifetime

        return data


class PasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(style={"input_type": "password"})

    status_codes = {
        "This field may not be blank.": 601,
        "This password is too short. It must contain at least 8 characters.": 602,
        "This password is entirely numeric.": 603,
        "This password is too common.": 604,
        "The password is too similar to the username.": 605,
        "The password is too similar to the email address.": 606,
        "The password is too similar to the first name.": 607,
        "The password is too similar to the last name.": 608,
    }

    def validate(self, attrs):
        user = self.context["request"].user
        assert user is not None

        try:
            validate_password(attrs["new_password"], user)
        except django_exceptions.ValidationError as e:
            errors = []
            for msg in list(e.messages):
                try:
                    status_code = self.status_codes[msg]
                except Exception:
                    status_code = 600

                errors.append({"code": status_code, "message": msg})

            raise serializers.ValidationError({"new_password_errors": errors})

        return super(PasswordSerializer, self).validate(attrs)


class PasswordChangeSerializer(PasswordSerializer):
    old_password = serializers.CharField(style={"input_type": "password"})


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.CharField()

    def validate(self, attrs):
        email = attrs["email"]

        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "There is no user with this email"}
            )

        return super(PasswordResetSerializer, self).validate(attrs)


class PasswordResetConfirmSerializer(PasswordSerializer):
    token = serializers.CharField()


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password")
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}


class UserGroupUpdateSerializer(serializers.Serializer):
    group_id = serializers.IntegerField()
