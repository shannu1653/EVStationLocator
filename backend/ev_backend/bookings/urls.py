from django.urls import path
from .views import (
    create_booking,
    user_bookings,
    cancel_booking
)

urlpatterns = [
    path("my-bookings/", user_bookings),
    path("cancel/<int:booking_id>/", cancel_booking),
]
