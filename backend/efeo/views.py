from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from efeo.filters import CaseInsensitiveOrderingFilter
from efeo.models import Map, MapConfig, MapNote, Site, SiteType
from efeo.permissions import AdminOrStandardPermission, MapNotePermission
from efeo.serializers import (
    MapConfigSerializer,
    MapNoteGeomSerializer,
    MapNoteSerializer,
    MapSerializer,
    SiteSerializer,
    SiteTypeSerializer,
)


class MapListView(generics.ListAPIView):
    serializer_class = MapSerializer
    queryset = Map.objects.all()


class MapConfigView(APIView):

    @swagger_auto_schema(
        responses={
            "200": "OK",
            "400": "Bad Request",
            "403": "Forbidden",
            "201": "Created",
        },
        operation_id="MaLayerConfiguration",
        operation_description="Map layer configurations",
    )
    def get(self, request, *args, **kwargs):
        map = get_object_or_404(Map, pk=self.kwargs["pk"])
        user = self.request.user

        if not user.is_authenticated:
            return Response(status=status.HTTP_403_FORBIDDEN)

        config_obj = MapConfig.objects.filter(map=map, user=user).last()

        if not config_obj:
            return Response(status=status.HTTP_200_OK, data=[])

        res = MapConfigSerializer(config_obj).data
        return Response(status=status.HTTP_200_OK, data=res)

    def post(self, request, *args, **kwargs):
        map = get_object_or_404(Map, pk=self.kwargs["pk"])
        user = self.request.user

        if not user.is_authenticated:
            return Response(status=status.HTTP_403_FORBIDDEN)

        obj = MapConfig.objects.filter(map=map, user=user).last()

        config_json = request.data.get("config", {})

        if not obj:
            obj = MapConfig.objects.create(map=map, user=user, config=config_json)
            res = MapConfigSerializer(obj).data
            return Response(status=status.HTTP_200_OK, data=res)

        obj.config = config_json
        obj.save()
        res = MapConfigSerializer(obj).data
        return Response(status=status.HTTP_200_OK, data=res)


class SiteTypeListView(generics.ListAPIView):
    serializer_class = SiteTypeSerializer
    queryset = SiteType.objects.all()


class MapSiteListView(generics.ListCreateAPIView):
    serializer_class = SiteSerializer
    permission_classes = [AdminOrStandardPermission]

    filter_backends = (
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    )
    filterset_fields = (
        "created_by",
        "ik_id_starred",
    )
    search_fields = ("english_name", "french_name", "khmer_name")
    ordering_fields = ("english_name",)
    ordering = ("english_name",)

    def get_queryset(self):
        map = get_object_or_404(Map, pk=self.kwargs["pk"])
        return Site.objects.filter(map=map)

    def perform_create(self, serializer):
        map = get_object_or_404(Map, pk=self.kwargs["pk"])
        serializer.save(map=map, created_by=self.request.user)


class SiteDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AdminOrStandardPermission]
    serializer_class = SiteSerializer
    queryset = Site.objects.all()


class MapNoteList(generics.ListCreateAPIView):
    filter_backends = (
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    )
    filterset_fields = ("created_by",)
    search_fields = ("title", "body")
    ordering_fields = ("title",)
    ordering = ("title",)

    serializer_class = MapNoteSerializer
    permission_classes = [MapNotePermission]

    def get_queryset(self):
        map = get_object_or_404(Map, pk=self.kwargs["pk"])
        return MapNote.objects.filter(map=map)

    def perform_create(self, serializer):
        map = get_object_or_404(Map, pk=self.kwargs["pk"])
        serializer.save(map=map, created_by=self.request.user)


class MapNoteListForMap(MapNoteList):
    pagination_class = None
    serializer_class = MapNoteGeomSerializer


class MapNoteDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MapNoteSerializer
    permission_classes = [MapNotePermission]

    def get_queryset(self):
        map = get_object_or_404(Map, pk=self.kwargs["map_pk"])
        return MapNote.objects.filter(map=map)

    def perform_update(self, serializer):
        map = get_object_or_404(Map, pk=self.kwargs["map_pk"])
        serializer.save(map=map)
