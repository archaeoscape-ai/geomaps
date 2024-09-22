from django.conf import settings
from rest_framework import permissions


class ApiSecretKeyPermission(permissions.BasePermission):
    """
    Allows only API requests by users with secret key
    """

    def has_permission(self, request, view):

        if not settings.API_SECRET_KEY:
            return False

        if 'HTTP_AUTHORIZATION' not in request.META:
            return False

        token = request.META['HTTP_AUTHORIZATION']
        return token == settings.API_SECRET_KEY
