from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

from efeo.models import (
    Map,
    MapConfig,
    MapNote,
    Site,
    SiteType,
    VectorTileLayer,
    WmsLayer,
    XYZLayer,
)


@admin.register(Map)
class MapAdmin(LeafletGeoAdmin):
    list_display = ["title", "uid", "zoom_level", "center", "is_deleted"]
    readonly_fields = ("uid", "deleted_at")

    def get_queryset(self, request):
        # Override the default queryset to include soft-deleted items
        return (
            Map.all_objects.all()
        )  # Use all_objects to get both deleted and non-deleted entries

    def is_deleted(self, obj):
        return obj.deleted_at is not None

    # is_deleted.boolean = True  # Display as a boolean icon (✔/✘) in the admin
    is_deleted.short_description = "Deleted"  # Column header name


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


@admin.register(Site)
class SiteAdmin(LeafletGeoAdmin):
    list_display = (
        "map",
        "site_type",
        "english_name",
        "french_name",
        "khmer_name",
        "created_by",
    )
    readonly_fields = ("uid", "deleted_at")


@admin.register(WmsLayer)
class WmsLayerAdmin(admin.ModelAdmin):
    list_display = ("alias", "wms_url", "created_on")


@admin.register(XYZLayer)
class XYZLayerAdmin(admin.ModelAdmin):
    list_display = ("alias", "tiles_url", "created_on")


@admin.register(VectorTileLayer)
class VectorTileLayerAdmin(admin.ModelAdmin):
    list_display = ("alias", "tiles_url", "created_on")
