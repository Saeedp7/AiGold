from django_cron import CronJobBase, Schedule
from products.models import Product
from .models import CartItem

class UpdatePricesCronJob(CronJobBase):
    RUN_EVERY_MINS = 60  # Run every hour

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'cart.cron.update_prices_cron_job'

    def do(self):
        for item in CartItem.objects.all():
            item.product.calculated_price = item.product.calculated_price()
            item.save()
