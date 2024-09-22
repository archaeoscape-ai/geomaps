from rest_framework import serializers

from efeo.models import Map, MapConfig, MapNote, Site, SiteType


class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        fields = ("id", "title", "zoom_level", "center")


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
