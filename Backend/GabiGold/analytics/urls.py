from django.urls import path
from .views import analytics_summary, trigger_cron_jobs

urlpatterns = [
    path('summary/', analytics_summary, name='analytics-summary'),
    path('trigger-cron-jobs/', trigger_cron_jobs, name='trigger_cron_jobs'),
]
