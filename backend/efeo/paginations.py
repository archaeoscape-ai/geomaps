from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response


class CustomLimitOffsetPagination(LimitOffsetPagination):
    def paginate_queryset(self, queryset, request, view=None):
        self.limit = request.query_params.get("limit", None)
        if self.limit is not None:
            try:
                self.limit = int(self.limit)
                if self.limit == -1:
                    self.count = len(queryset)
                    self.offset = 0
                    self.request = request
                    return list(queryset)
            except ValueError:
                pass  # Handle the case where limit is not an integer
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        if self.limit == -1:
            return Response(
                {"count": self.count, "next": None, "previous": None, "results": data}
            )
        return super().get_paginated_response(data)
