from django.apps import AppConfig
from django_cron import CronJobBase, Schedule

class CartConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cart'

    def ready(self):
        from .cron import UpdatePricesCronJob
        UpdatePricesCronJob().do()
