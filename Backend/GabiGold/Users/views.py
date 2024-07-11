import random
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.utils import timezone
from .models import UserModel
from .serializers import (
    SendOTPSerializer, VerifyOTPSerializer, RegisterSerializer, UserAdminSerializer,
    LoginSerializer, LogoutSerializer, UpdateProfileSerializer, ResetPasswordRequestSerializer
)
from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from Users.utils import send_otp
User = get_user_model()

class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            if not phone_number:
                return Response({"detail": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)
            otp = random.randint(100000, 999999)
            otp_expiry = timezone.now() + timedelta(minutes=10)

            user, created = UserModel.objects.get_or_create(phone_number=phone_number)
            user.otp = otp
            user.otp_expiry = otp_expiry
            user.save()

            # Simulate sending OTP via SMS
            print(f"OTP: {otp}")
            send_otp(phone_number, otp)

            return Response({"detail": "OTP sent successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            otp = serializer.validated_data['otp']

            try:
                user = UserModel.objects.get(phone_number=phone_number, otp=otp)
            except UserModel.DoesNotExist:
                return Response({"detail": "Invalid phone number or OTP"}, status=status.HTTP_400_BAD_REQUEST)

            if user.otp_expiry < timezone.now():
                return Response({"detail": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)

            user.otp_verified = True
            user.save()

            return Response({"detail": "OTP verified successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                phone_number=serializer.validated_data['phone_number'],
                password=serializer.validated_data['password']
            )
            if user is not None:
                if user.is_active:
                    refresh = RefreshToken.for_user(user)
                    user_data = LoginSerializer(user, context={'request': request}).data
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': user_data,
                    })
                else:
                    return Response({"detail": "Account is not active"}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateProfileView(generics.UpdateAPIView):
    queryset = UserModel.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateProfileSerializer

    def get_object(self):
        return self.request.user

class ResetPasswordRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']

            try:
                user = UserModel.objects.get(phone_number=phone_number)
            except UserModel.DoesNotExist:
                return Response({"detail": "User with this phone number does not exist"}, status=status.HTTP_404_NOT_FOUND)

            new_password = ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', k=8))
            user.set_password(new_password)
            user.save()

            # Simulate sending new password via SMS (replace with actual SMS sending code)
            print(f"New password for {phone_number}: {new_password}")

            return Response({"detail": "New password sent successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]