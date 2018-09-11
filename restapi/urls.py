"""simplecitytour URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import include, url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
# from .views import Tour_cities
from . import views

urlpatterns = [
    url('login/', obtain_jwt_token),
    url('verify_token/', verify_jwt_token),
    url('logout/', refresh_jwt_token),
    # path('testapi/', views.test_resp, name='testresp'),
    url('signup/', views.signup_user, name='login'),
    url('getaudio/', views.get_audio, name='audio'),
    url('get_imgs/', views.get_cities_imgs, name='imgs'),
    url('check_update/', views.check_sequence, name='check-update'),
    url('get_points/', views.get_points, name='points'),
    url('get_all_locations/', views.get_all_locations, name='get-locations'),
    url('accounts/', include('django.contrib.auth.urls')),
    url('types/', views.getPointTypes, name='check-types'),
]