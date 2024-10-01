from rest_framework import serializers

from efeo.models import (
    Map,
    MapConfig,
    MapNote,
    Site,
    SiteResource,
    SiteResourceType,
    SiteType,
    VectorTileLayer,
    WmsLayer,
    XYZLayer,
)


class WmsLayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WmsLayer
        fields = "__all__"


class XYZLayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = XYZLayer
        fields = "__all__"


class VectorTileLayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = VectorTileLayer
        fields = "__all__"


class MapSerializer(serializers.ModelSerializer):

    class Meta:
        model = Map
        fields = (
            "id",
            "title",
            "zoom_level",
            "center",
        )


class MapDetailSerializer(serializers.ModelSerializer):

    wms_layers = WmsLayerSerializer(many=True)
    xyz_layers = XYZLayerSerializer(many=True)
    vector_tile_layers = VectorTileLayerSerializer(many=True)

    class Meta:
        model = Map
        fields = (
            "id",
            "title",
            "zoom_level",
            "center",
            "wms_layers",
            "xyz_layers",
            "vector_tile_layers",
        )
        read_only_fields = ("wms_layers", "xyz_layers", "vector_tile_layers")


class MapConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapConfig
        fields = ("id", "user", "map", "config", "created_on", "updated_on")
        read_only_fields = ("user",)


class SiteTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteType
        fields = ("id", "name")


class SiteSerializer(serializers.ModelSerializer):

    site_type_name = serializers.ReadOnlyField(source="site_type.name")

    class Meta:
        model = Site
        fields = (
            "id",
            "site_type",
            "site_type_name",
            "map",
            "location",
            "english_name",
            "french_name",
            "khmer_name",
            "alternative_name",
            "alternative_khmer_name",
            "description",
            "ik_id_starred",
            "created_by",
            "created_on",
            "updated_on",
        )
        read_only_fields = ("map", "created_by", "created_on", "updated_on")


class MapNoteSerializer(serializers.ModelSerializer):

    owner_name = serializers.ReadOnlyField(source="created_by.full_name")

    class Meta:
        model = MapNote
        fields = (
            "id",
            "geom",
            "title",
            "body",
            "map",
            "owner_name",
            "created_by",
            "created_on",
            "updated_on",
        )
        read_only_fields = ("created_by", "map")


class MapNoteGeomSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapNote
        fields = ("id", "geom")


class SiteResourceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteResourceType
        fields = ("id", "name")


class SiteResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteResource
        fields = (
            "id",
            "site",
            "resource_type",
            "caption",
            "author",
            "resource_date",
            "resource_file",
            "notes",
            "created_by",
            "created_on",
        )
        read_only_fields = ("site", "created_by", "created_on")
