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
        "worksite-types/",
        views.WorksiteTypeListView.as_view(),
        name="worksite-type-list",
    ),
    path(
        "site-resource-types/",
        views.SiteResourceTypeListView.as_view(),
        name="site-resource-type-list",
    ),
    path(
        "individuals/",
        views.IndividualsListView.as_view(),
        name="individuals-list",
    ),
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
        "sites/<int:pk>/resources/",
        views.SiteResourceListView.as_view(),
        name="site-resource-list",
    ),
    path(
        "site-resources/<int:pk>/",
        views.SiteResourceDetailView.as_view(),
        name="site-resource-detail",
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
    path(
        "fieldseasons/",
        views.FieldSeasonListView.as_view(),
        name="fieldseason-list",
    ),
    path(
        "trenches/",
        views.TrenchListView.as_view(),
        name="trench-list",
    ),
    path(
        "sites/<int:pk>/worksites/",
        views.WorksiteListView.as_view(),
        name="map-worksites",
    ),
    path(
        "worksites/<int:pk>/resources/",
        views.WorksiteResourceListView.as_view(),
        name="worksite-resource-list",
    ),
]
