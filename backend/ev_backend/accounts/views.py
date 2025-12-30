from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    # RegisterSerializer,
    UserSerializer,
    UserProfileSerializer
)
from .models import UserProfile


# -----------------------
# Register User
# -----------------------
# @api_view(["POST"])
# def register_user(request):
#     serializer = RegisterSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "User registered successfully"})
#     return Response(serializer.errors, status=400)

import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

@csrf_exempt
def register_user(request):

    # ✅ Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    # ✅ Handle POST request
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({
                "status": "error",
                "message": "Username and password required"
            }, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                "status": "error",
                "message": "User already exists"
            }, status=409)

        User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return JsonResponse({
            "status": "success",
            "message": "User registered successfully"
        }, status=201)

    # ✅ SAFETY NET (VERY IMPORTANT)
    return JsonResponse(
        {"status": "error", "message": "Method not allowed"},
        status=405
    )


# -----------------------
# Login (JWT)
# -----------------------
# @api_view(["POST"])
# def login_user(request):
#     username = request.data.get("username")
#     password = request.data.get("password")

#     user = authenticate(username=username, password=password)
#     if user:
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "access": str(refresh.access_token),
#             "refresh": str(refresh)
#         })

#     return Response({"error": "Invalid username or password"}, status=401)
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

@csrf_exempt
def login_user(request):

    # ✅ Handle CORS preflight
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({
                "status": "error",
                "message": "Username and password required"
            }, status=400)

        # ✅ MATCHING WITH REGISTERED USER (DATABASE)
        user = authenticate(username=username, password=password)

        if user is None:
            return JsonResponse({
                "status": "error",
                "message": "Invalid username or password"
            }, status=401)

        # ✅ LOGIN SUCCESS
        return JsonResponse({
            "status": "success",
            "message": "Login successful",
            "username": user.username
        }, status=200)

    return JsonResponse({
        "status": "error",
        "message": "Method not allowed"
    }, status=405)


# -----------------------
# Get User Profile
# -----------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# -----------------------
# Update User Profile
# -----------------------
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile = UserProfile.objects.get(user=request.user)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully"})

    return Response(serializer.errors, status=400)
