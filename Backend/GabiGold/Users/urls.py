from django.urls import path
from .views import SendOTPView, VerifyOTPView, RegisterView, LoginView, LogoutView, UpdateProfileView, ResetPasswordRequestView, UserListView, UserDetailView
from django_rest_passwordreset.views import reset_password_request_token, reset_password_confirm

urlpatterns = [
    path('reset_password/', ResetPasswordRequestView.as_view(), name='reset-password'),
    path('reset_password/confirm/', reset_password_confirm, name="reset-password-confirm"),
    path('send_otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify_otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('update_profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('users/', UserListView.as_view(), name='admin-user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='admin-user-detail'),
]
