from django.urls import path
from .views import ClimateProbView

urlpatterns = [
    path('probabilidad/', ClimateProbView.as_view(), name='climate_prob'),
]