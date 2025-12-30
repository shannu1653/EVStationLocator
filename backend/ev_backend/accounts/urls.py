from django.urls import path
from .views import (
    register_user,
    login_user,
    get_profile,
    update_profile
)

from . import views
urlpatterns = [
    path("register/", register_user),
    path("login/", login_user),
    path("profile/", get_profile),
    path("profile/update/", update_profile),
     path('stations/', views.stations),
    path('search-stations/', views.search_stations),
    path('bookings/', views.create_booking),
    path('my-bookings/', views.get_bookings),
    path('reviews/', views.create_review),
    path('get-reviews/', views.get_reviews),
    path('contact/', views.contact_submit),
    path('newsletter/', views.newsletter_subscribe),
]
