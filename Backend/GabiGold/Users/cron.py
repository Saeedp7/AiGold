# users/cron.py
from django_cron import CronJobBase, Schedule
from django.utils import timezone
from .models import UserModel

class CheckExpiredOTPs(CronJobBase):
    RUN_EVERY_MINS = 60  # Run once a day

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'users.check_expired_otps'  # a unique code

    def do(self):
        now = timezone.now()
        expired_users = UserModel.objects.filter(otp_expiry__lt=now, code_melli__isnull=True)
        expired_users.delete()
