from django.core.management.base import BaseCommand
from django.utils import timezone
from Users.models import UserModel

class Command(BaseCommand):
    help = 'Delete users whose OTP has expired and who do not have a national ID code (code_melli).'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        expired_users = UserModel.objects.filter(otp_expiry__lt=now, code_melli__isnull=True)
        count, _ = expired_users.delete()

        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {count} expired users.')
        )
