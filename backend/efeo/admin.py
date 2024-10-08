from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

from efeo.models import (
    FieldSeason,
    Individuals,
    Map,
    MapConfig,
    MapNote,
    Site,
    SiteResource,
    SiteResourceType,
    SiteType,
    Trench,
    VectorTileLayer,
    WmsLayer,
    Worksite,
    WorksiteResource,
    WorksiteResourceType,
    WorksiteType,
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


@admin.register(WorksiteType)
class WorksiteTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(SiteResourceType)
class SiteResourceTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Individuals)
class IndividualsAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(SiteResource)
class SiteResourceAdmin(admin.ModelAdmin):
    list_display = ("site", "resource_type", "created_by", "created_on")


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


@admin.register(Worksite)
class WorksiteAdmin(LeafletGeoAdmin):
    list_display = (
        "name",
        "worksite_type",
        "archsite",
        "created_by",
    )
    readonly_fields = ("uid",)


@admin.register(WmsLayer)
class WmsLayerAdmin(admin.ModelAdmin):
    list_display = ("alias", "wms_url", "created_on")


@admin.register(XYZLayer)
class XYZLayerAdmin(admin.ModelAdmin):
    list_display = ("alias", "tiles_url", "created_on")


@admin.register(VectorTileLayer)
class VectorTileLayerAdmin(admin.ModelAdmin):
    list_display = ("alias", "tiles_url", "created_on")
    list_display = ("alias", "tiles_url", "created_on")


@admin.register(FieldSeason)
class FieldSeasonAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Trench)
class TrenchAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(WorksiteResourceType)
class WorksiteResourceTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(WorksiteResource)
class WorksiteResourceAdmin(admin.ModelAdmin):
    list_display = (
        "worksite",
        "resource_type",
        "caption",
        "trench",
        "fieldseason",
        "created_by",
        "created_on",
    )
