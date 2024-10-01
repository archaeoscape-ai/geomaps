from rest_framework import permissions


class AdminOrStandardPermission(permissions.BasePermission):
    """
    Custom permission for map site API requests
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.user.is_admin or request.user.is_standard:
            return True

        if request.method == "POST":
            return False

        return True

    def has_object_permission(self, request, view, obj):

        if not request.user.is_authenticated:
            return False

        if request.user.is_admin or request.user.is_standard:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        return False


class MapNotePermission(permissions.BasePermission):
    """
    Custom permission for map notes
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return True

    def has_object_permission(self, request, view, obj):

        if not request.user.is_authenticated:
            return False

        if request.user.is_admin or request.user.is_standard:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        if obj.created_by == request.user:
            return True

        return False


class AdminOrCreatorPermission(permissions.BasePermission):
    """
    Custom permission for map notes
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return True

    def has_object_permission(self, request, view, obj):

        if not request.user.is_authenticated:
            return False

        if request.user.is_admin or request.user.is_standard:
            return True

        if request.method in permissions.SAFE_METHODS:
            return True

        if obj.created_by == request.user:
            return True

        return False
