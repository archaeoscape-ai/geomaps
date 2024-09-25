from django.urls import path

from efeo import views

urlpatterns = [
    path("maps/", views.MapListView.as_view(), name="map-list"),
    path("maps/<int:pk>/", views.MapDetailView.as_view(), name="map-detail"),
    path(
        "maps/<int:pk>/config/",
        views.MapConfigView.as_view(),
        name="map-cofig",
    ),
    path("site-types/", views.SiteTypeListView.as_view(), name="site-type-list"),
    path(
        "maps/<int:pk>/sites/",
        views.MapSiteListView.as_view(),
        name="map-sites",
    ),
    path(
        "sites/<int:pk>/",
        views.SiteDetailView.as_view(),
        name="site-detail",
    ),
    path(
        "maps/<int:pk>/notes/",
        views.MapNoteList.as_view(),
        name="map-notes",
    ),
    path(
        "maps/<int:pk>/notes/geom/",
        views.MapNoteListForMap.as_view(),
        name="map-notes-for-map",
    ),
    path(
        "maps/<int:map_pk>/notes/<int:pk>/",
        views.MapNoteDetail.as_view(),
        name="map-note-detail",
    ),
]
