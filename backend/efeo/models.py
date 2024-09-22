import uuid

from django.contrib.gis.db import models as geomodels
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Map(models.Model):
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    center = geomodels.PointField(srid=4326, dim=2)
    zoom_level = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(24)]
    )

    def __str__(self) -> str:
        return self.title


class MapConfig(models.Model):
    user = models.OneToOneField("accounts.User", null=True, on_delete=models.CASCADE)
    map = models.ForeignKey(
        "efeo.Map", related_name="map_confgis", on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    config = models.JSONField()

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name_plural = "Map layer configuration"


class SiteType(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name


class Site(models.Model):
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    map = models.ForeignKey("efeo.Map", related_name="sites", on_delete=models.CASCADE)
    site_type = models.ForeignKey("efeo.SiteType", null=True, on_delete=models.SET_NULL)
    location = geomodels.PointField(srid=4326, dim=2)

    english_name = models.CharField(max_length=255)
    french_name = models.CharField(max_length=255, blank=True)
    khmer_name = models.CharField(max_length=255, blank=True)
    alternative_name = models.CharField(max_length=255, blank=True)
    alternative_khmer_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    ik_id_starred = models.BooleanField(null=True)

    created_by = models.ForeignKey(
        "accounts.User", blank=True, null=True, on_delete=models.SET_NULL
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.english_name


class MapNote(models.Model):
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=128)
    body = models.TextField(max_length=255)
    geom = geomodels.PointField(srid=4326)
    map = models.ForeignKey("efeo.Map", related_name="notes", on_delete=models.CASCADE)
    created_by = models.ForeignKey(
        "accounts.User", related_name="created_notes", on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note: {self.title}"

    class Meta:
        verbose_name = "Note"
        verbose_name_plural = "Notes"
