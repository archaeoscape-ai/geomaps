from rest_framework import permissions


class AdminOnlyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if not request.user.is_admin:
            return False

        return True


class AdminOnlyPermissionForUnsafeMethods(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method not in permissions.SAFE_METHODS:
            if not request.user.is_admin:
                return False

            return True

        return True

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        if request.method not in permissions.SAFE_METHODS:
            if not request.user.is_admin:
                return False
            return True

        return True
