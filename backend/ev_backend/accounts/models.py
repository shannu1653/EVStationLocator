from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True, null=True)
    vehicle_type = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.user.username


#adding new


class ChargingStation(models.Model):
    name = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    connector = models.CharField(max_length=20)
    speed = models.CharField(max_length=20, choices=[('Fast', 'Fast'), ('Normal', 'Normal')])
    slots_total = models.IntegerField(default=6)
    slots_booked = models.IntegerField(default=0)
    approx_rate = models.DecimalField(max_digits=6, decimal_places=2)
    open_now = models.BooleanField(default=True)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    user_name = models.CharField(max_length=100)
    vehicle = models.CharField(max_length=100)
    # station_id = models.IntegerField()
    connector = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    duration = models.IntegerField()
    approx_amount = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.date}"

class Review(models.Model):
    name = models.CharField(max_length=100)
    rating = models.IntegerField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.rating}★"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)