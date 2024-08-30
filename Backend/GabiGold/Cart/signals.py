from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def trigger_cron_job(sender, **kwargs):
    from .cron import UpdatePricesCronJob
    # Ensure this does not run before migrations are applied
    if sender.name == 'cart':
        UpdatePricesCronJob().do()
