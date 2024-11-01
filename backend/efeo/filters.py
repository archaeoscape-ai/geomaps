from django.db.models.functions import Lower
from django_filters import rest_framework as filters
from rest_framework.filters import OrderingFilter

from .models import Site


class CaseInsensitiveOrderingFilter(OrderingFilter):

    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)

        if ordering:
            new_ordering = []
            for field in ordering:
                if field.startswith("-"):
                    new_ordering.append(Lower(field[1:]).desc())
                else:
                    new_ordering.append(Lower(field).asc())
            return queryset.order_by(*new_ordering)

        return queryset


class SiteFilter(filters.FilterSet):
    english_name = filters.CharFilter(
        field_name="english_name", lookup_expr="icontains"
    )
    french_name = filters.CharFilter(field_name="french_name", lookup_expr="icontains")
    khmer_name = filters.CharFilter(field_name="khmer_name", lookup_expr="icontains")
    alternative_name = filters.CharFilter(
        field_name="alternative_name", lookup_expr="icontains"
    )
    alternative_khmer_name = filters.CharFilter(
        field_name="alternative_khmer_name", lookup_expr="icontains"
    )
    description = filters.CharFilter(field_name="description", lookup_expr="icontains")

    # Filter for boolean and datetime fields as is
    ik_id_starred = filters.BooleanFilter()
    created_by = filters.NumberFilter()
    created_on = filters.DateTimeFilter()
    updated_on = filters.DateTimeFilter()
    created_on_gte = filters.DateTimeFilter(field_name="created_on", lookup_expr="gte")
    created_on_lte = filters.DateTimeFilter(field_name="created_on", lookup_expr="lte")
    updated_on_gte = filters.DateTimeFilter(field_name="updated_on", lookup_expr="gte")
    updated_on_lte = filters.DateTimeFilter(field_name="updated_on", lookup_expr="lte")

    class Meta:
        model = Site
        fields = [
            "created_by",
            "ik_id_starred",
            "english_name",
            "french_name",
            "khmer_name",
            "alternative_name",
            "alternative_khmer_name",
            "description",
            "created_on",
            "updated_on",
        ]
