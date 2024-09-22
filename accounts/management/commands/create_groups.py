from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = """
        Programatically create groups\n
        usage: python manage.py create_groups
    """

    def handle(self, *args, **options):
        Group.objects.get_or_create(name="Administrator")
        Group.objects.get_or_create(name="Standard")
        Group.objects.get_or_create(name="Read-Only")
