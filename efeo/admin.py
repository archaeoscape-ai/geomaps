from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

from efeo.models import Map, MapConfig, MapNote, SiteType


@admin.register(Map)
class MapAdmin(LeafletGeoAdmin):
    list_display = ["title", "uid", "zoom_level", "center"]
    readonly_fields = ("uid",)


@admin.register(MapConfig)
class MapConfigAdmin(admin.ModelAdmin):
    list_display = ("map", "user", "created_on", "updated_on")


@admin.register(SiteType)
class SiteTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(MapNote)
class MapNoteAdmin(LeafletGeoAdmin):
    list_display = ("created_on", "created_by", "title", "map")
    list_filter = ("map", "created_on")
