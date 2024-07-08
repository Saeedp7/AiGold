from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator, validate_email
from django.utils import timezone

phone_regex = RegexValidator(
    regex=r"\d{11}", message="Phone Number Must Be 11 Digits Only."
)

code_melli_regex = RegexValidator(
    regex=r"\d{10}", message="Melli Code Must Be 10 Digits Only."
)

class UserManager(BaseUserManager):

    def create_user(self, phone_number, code_melli,password=None, **extra_fields):
        if not phone_number:
            raise ValueError("Phone Number Required")
        if not code_melli:
            raise ValueError("Code Melli is required")
        user = self.model(phone_number=phone_number, code_melli=code_melli)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, phone_number, password, code_melli, **extra_fields):
        user = self.create_user(phone_number=phone_number, password=password, code_melli=code_melli)
        user.is_active = True
        user.is_staff = True
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class UserModel(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        ('زن', 'زن'),
        ('مرد', 'مرد'),
    )

    user_id = models.AutoField(primary_key=True)
    phone_number = models.CharField(unique=True, max_length=11, null=False, blank=False, validators=[phone_regex])
    code_melli = models.CharField(unique=True, max_length=10, null=True, blank=True, validators=[code_melli_regex])
    email = models.EmailField(max_length=50, blank=True, null=True, validators=[validate_email])
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=150, verbose_name='استان', null=True, blank=True)
    city = models.CharField(max_length=150, verbose_name='شهر', null=True, blank=True)
    address = models.CharField(max_length=150, verbose_name='آدرس', null=True, blank=True)
    postal_code = models.CharField(max_length=50, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='مرد')
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)
    max_otp_try = models.IntegerField(default=settings.MAX_OTP_TRY)
    otp_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(blank=True, null=True, upload_to='profile_pictures/')

    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    user_register_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ['code_melli']

    objects = UserManager()

    def __str__(self):
        return self.phone_number
