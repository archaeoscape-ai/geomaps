import os
import uuid

from django.contrib.gis.db import models as geomodels
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from setup.storage import DataStorage

from .enum import LayerType, WmsImageType
from .managers import AllObjectsManager, SoftDeleteManager

FS = DataStorage()


class SoftDeletableModel(models.Model):
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self, *args, **kwargs):
        super(SoftDeletableModel, self).delete(*args, **kwargs)

    def restore(self):
        self.deleted_at = None
        self.save()


class SiteResourceType(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Arch Site Resource Type"
        verbose_name_plural = "Arch Site Resource Types"


class Individuals(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Individual"
        verbose_name_plural = "Individuals"


def get_site_resource_dir(instance, filename):
    return os.path.join(str(instance.site.uid), "resources", filename)


class SiteResource(models.Model):
    site = models.ForeignKey(
        "efeo.Site", related_name="resources", on_delete=models.CASCADE
    )
    resource_type = models.ForeignKey("efeo.SiteResourceType", on_delete=models.PROTECT)
    caption = models.CharField(max_length=128, blank=True)
    author = models.ForeignKey("efeo.Individuals", null=True, on_delete=models.SET_NULL)
    resource_date = models.DateField(blank=True, null=True)
    resource_file = models.FileField(
        max_length=255, storage=FS, upload_to=get_site_resource_dir
    )
    notes = models.TextField(blank=True)

    created_by = models.ForeignKey(
        "accounts.User", blank=True, null=True, on_delete=models.SET_NULL
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.resource_file.name

    class Meta:
        verbose_name = "Arch Site Resource"
        verbose_name_plural = "Arch Site Resources"


class Map(SoftDeletableModel):
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    center = geomodels.PointField(srid=4326, dim=2)
    zoom_level = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(24)]
    )

    wms_layers = models.ManyToManyField("efeo.WmsLayer", blank=True)
    xyz_layers = models.ManyToManyField("efeo.XYZLayer", blank=True)
    vector_tile_layers = models.ManyToManyField("efeo.VectorTileLayer", blank=True)

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Map"
        verbose_name_plural = "Maps"


class MapConfig(models.Model):
    user = models.ForeignKey("accounts.User", null=True, on_delete=models.CASCADE)
    map = models.ForeignKey(
        "efeo.Map", related_name="map_confgis", on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    config = models.JSONField()

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name_plural = "Map Layer Configurations"


class SiteType(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Arch Site Type"
        verbose_name_plural = "Arch Site Types"


class Site(SoftDeletableModel):
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

    db_resolved = models.SmallIntegerField(null=True)

    created_by = models.ForeignKey(
        "accounts.User", blank=True, null=True, on_delete=models.SET_NULL
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.english_name

    class Meta:
        verbose_name = "Arch Site"
        verbose_name_plural = "Arch Sites"


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
        verbose_name = "Map Note"
        verbose_name_plural = "Map Notes"


class AbstractLayer(models.Model):
    alias = models.CharField(max_length=128)
    abstract = models.TextField(blank=True)
    description = models.TextField(blank=True)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.alias

    class Meta:
        abstract = True


class WmsLayer(AbstractLayer):
    wms_url = models.URLField(max_length=255)
    image_type = models.CharField(
        max_length=32, choices=WmsImageType.choices, default="png"
    )
    layer_type = models.CharField(
        max_length=64, choices=LayerType.choices, default="VECTOR"
    )
    use_as_tile_layer = models.BooleanField(default=False)

    @property
    def is_raster(self):
        return self.geoserver_layer.layer_type == "RASTER"

    @property
    def is_vector(self):
        return self.geoserver_layer.layer_type == "VECTOR"

    class Meta:
        verbose_name = "Layers - WMS"
        verbose_name_plural = "Layers - WMS"


class XYZLayer(AbstractLayer):
    tiles_url = models.URLField("Tiles URL", max_length=255)

    class Meta:
        verbose_name = "Layers - XYZ"
        verbose_name_plural = "Layers - XYZ"


class VectorTileLayer(AbstractLayer):
    tiles_url = models.URLField("Tiles URL", max_length=255)

    class Meta:
        verbose_name = "Layers - Vector Tiles"
        verbose_name_plural = "Layers - Vector Tiles"


class WorksiteType(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Worksite Type"
        verbose_name_plural = "Worksite Types"


class Worksite(models.Model):
    uid = models.UUIDField(default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=128)
    worksite_type = models.ForeignKey(
        WorksiteType, null=True, on_delete=models.SET_NULL
    )
    method = models.CharField(max_length=16)
    archsite = models.ForeignKey(
        Site, related_name="worksites", null=True, on_delete=models.SET_NULL
    )
    location = geomodels.PointField(srid=4326)
    looted = models.BooleanField(null=True)
    cultivated = models.BooleanField(null=True)
    cleared = models.BooleanField(null=True)
    threatened = models.BooleanField(null=True)

    created_by = models.ForeignKey(
        "accounts.User", related_name="created_worksites", on_delete=models.PROTECT
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Worksite"
        verbose_name_plural = "Worksites"


class FieldSeason(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Field Season"
        verbose_name_plural = "Field Seasons"


class Trench(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Trench"
        verbose_name_plural = "Trenches"


class WorksiteResourceType(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Worksite Resource Type"
        verbose_name_plural = "Worksite Resource Types"


class WorksiteResource(models.Model):
    worksite = models.ForeignKey(
        "efeo.Worksite", related_name="resources", on_delete=models.CASCADE
    )
    resource_type = models.ForeignKey(
        "efeo.WorksiteResourceType", on_delete=models.PROTECT
    )
    caption = models.CharField(max_length=128, blank=True)
    resource_date = models.DateField(blank=True, null=True)
    resource_file = models.FileField(
        max_length=255, storage=FS, upload_to=get_site_resource_dir
    )

    gcs_id = models.PositiveIntegerField(blank=True, null=True)
    context = models.CharField(max_length=128, blank=True)
    trench = models.ForeignKey("efeo.Trench", on_delete=models.PROTECT)
    fieldseason = models.ForeignKey("efeo.FieldSeason", on_delete=models.PROTECT)

    created_by = models.ForeignKey(
        "accounts.User", blank=True, null=True, on_delete=models.SET_NULL
    )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.resource_file.name

    class Meta:
        verbose_name = "Worksite Resource"
        verbose_name_plural = "Worksite Resources"
