from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("api/weather/", views.weather_api),
    path("", views.home, name="home"),
    path("api/weather/", views.weather_api),

    path("api/save-city/", views.save_city),
    path("api/saved-cities/", views.get_saved_cities),
]
