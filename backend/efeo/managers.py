from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        return self.update(deleted_at=timezone.now())

    def hard_delete(self):
        return super().delete()

    def alive(self):
        return self.filter(deleted_at__isnull=True)

    def deleted(self):
        return self.filter(deleted_at__isnull=False)


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        # Return only non-deleted (alive) objects
        return SoftDeleteQuerySet(self.model, using=self._db).alive()

    def hard_delete(self):
        return self.get_queryset().hard_delete()

    def deleted(self):
        return self.get_queryset().deleted()


# AllObjectsManager that returns all objects (including soft-deleted)
class AllObjectsManager(models.Manager):
    def get_queryset(self):
        # Return all objects, including soft-deleted ones
        return SoftDeleteQuerySet(self.model, using=self._db)
