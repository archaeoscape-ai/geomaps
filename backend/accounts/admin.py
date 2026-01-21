from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import Organization, PasswordResetRequest


class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "contact_email", "uid")
    readonly_fields = ("uid",)


admin.site.register(Organization, OrganizationAdmin)  # noqa


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (("Personal info"), {"fields": ("first_name", "last_name", "organization")}),
        (
            ("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_display = (
        "email",
        "first_name",
        "last_name",
        "organization",
        "is_active",
    )
    list_filter = ("organization",)
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)
    readonly_fields = ("date_joined",)


admin.site.register(get_user_model(), CustomUserAdmin)  # noqa


class PasswordResetRequestAdmin(admin.ModelAdmin):
    list_display = ("received_on", "user", "confirmed", "confirmed_on")
    list_filter = ("user", "confirmed")


admin.site.register(PasswordResetRequest, PasswordResetRequestAdmin)  # noqa
