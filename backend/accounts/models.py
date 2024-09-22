import os
import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError  # noqa
from django.db import models
from django.utils.translation import gettext as _

from setup.storage import DataStorage

FS = DataStorage()


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Valid e-mail must be provided!")
        user = self.model(email=self.normalize_email(email), **extra)
        user.username
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(email, password, **extra_fields)


def get_organization_logo_dir(instance, filename):
    return os.path.join(str(instance.uid), "resources", "logo", filename)


class Organization(models.Model):
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    contact_email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(
        storage=FS, upload_to=get_organization_logo_dir, max_length=255, blank=True
    )

    def __str__(self):
        return self.name


class User(AbstractUser):
    # making user email unique
    AbstractUser._meta.get_field("email")._unique = True

    # add custom fields
    username = models.CharField(max_length=255, blank=True)
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True)
    activation_token = models.CharField(max_length=64, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    @property
    def is_admin(self):
        return self.groups.exists() and self.groups.first().name == "Administrator"

    @property
    def is_standard(self):
        return self.groups.exists() and self.groups.first().name == "Standard"

    @property
    def is_readonly(self):
        return self.groups.exists() and self.groups.first().name == "Read-Only"

    @property
    def app_role_name(self):
        return self.groups.first().name if self.groups.exists() else ""

    @property
    def app_role_id(self):
        return self.groups.first().id if self.groups.exists() else None

    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return "{} {}".format(self.first_name, self.last_name)
        return self.username

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name_plural = "Users"


class PasswordResetRequest(models.Model):
    received_on = models.DateTimeField(auto_now_add=True)
    uid = models.UUIDField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    confirmed_on = models.DateTimeField(null=True)

    def __str__(self):
        return self.received_on.isoformat()

    class Meta:
        verbose_name_plural = "Users - password resets"
