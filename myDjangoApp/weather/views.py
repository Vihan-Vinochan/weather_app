import os 
import requests
from django.shortcuts import render

def home(request):
    weather_data = {}
    city = ""

    if request.method == "POST":
        city = request.POST.get("city")

        API_KEY = os.getenv("OPENWEATHER_API_KEY")



        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

        response = requests.get(url).json()

        if response.get("main"):
            weather_data = {
                "city": city,
                "temp": response["main"]["temp"],
                "humidity": response["main"]["humidity"],
                "pressure": response["main"]["pressure"],
                "desc": response["weather"][0]["description"],
                "icon": response["weather"][0]["icon"],
            }
        else:
            weather_data = {"error": "City not found!"}

    return render(request, "weather/home.html", {"weather": weather_data})


from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import requests

@api_view(['GET'])
def weather_api(request):
    city = request.GET.get('city', '').strip()

    if not city:
        return Response({"error": "City is required"})

    API_KEY = os.getenv("OPENWEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url).json()

    if response.get("cod") == 200:
        return Response({
            "city": response["name"],
            "temp": response["main"]["temp"],
            "humidity": response["main"]["humidity"],
            "pressure": response["main"]["pressure"],
            "description": response["weather"][0]["description"],
        })

    return Response({"error": response.get("message", "City not found")})


from weather.models import SavedCity
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def save_city(request):
    city_name = request.data.get("city")

    if not city_name:
        return Response({"error": "City name required"})

    SavedCity.objects.create(name=city_name)
    return Response({"message": "City saved successfully"})


@api_view(['GET'])
def get_saved_cities(request):
    cities = SavedCity.objects.all().values("id", "name")
    return Response(list(cities))



