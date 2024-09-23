"""setup URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

admin.site.site_header = "EFEO Admin Page"
admin.site.site_title = "EFEO Administration"

router = DefaultRouter()

api_schema_view = get_schema_view(
    openapi.Info(
        title="EFEO API",
        default_version="v1",
        description="Swagger docs for EFEO API",
        contact=openapi.Contact(email="dev@lunageo.com"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("accounts/", include("accounts.urls")),
    path("efeo/", include("efeo.urls")),
]

if settings.SHOW_API_DOCS:
    urlpatterns += [
        path(
            "docs/ca9ad096-d229-4691-972c-57853ac65a86/swagger/",
            api_schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
    ]
