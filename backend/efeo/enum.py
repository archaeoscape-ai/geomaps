from django.db import models


class WmsImageType(models.TextChoices):
    JPEG = "jpeg", "jpeg"
    PNG = "png", "png"


class LayerType(models.TextChoices):
    VECTOR = "VECTOR", "VECTOR"
    RASTER = "RASTER", "RASTER"
