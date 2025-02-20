from rest_framework import serializers
from django.utils import timezone
from .models import UserModel
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.core.validators import RegexValidator

phone_regex = RegexValidator(regex=r"\d{11}", message="Phone Number Must Be 11 Digits Only.")
code_melli_regex = RegexValidator(regex=r"\d{10}", message="Melli Code Must Be 10 Digits Only.")

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'user_id', 'phone_number', 'code_melli', 'email',
            'first_name', 'last_name', 'state', 'city', 'address',
            'postal_code', 'gender', 'profile_picture', 'is_active',
            'is_admin', 'is_staff', 'user_register_at'
        )

class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=True)

    def validate_phone_number(self, value):
        if UserModel.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

class PassChangeOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=True)


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    otp = serializers.CharField()

class RegisterSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    otp = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    code_melli = serializers.CharField(validators=[code_melli_regex])

    class Meta:
        model = UserModel
        fields = ('phone_number', 'password', 'confirm_password', 'code_melli')

    def validate(self, data):
        phone_number = data.get('phone_number')
        otp = data.get('otp')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        code_melli = data.get('code_melli')

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")

        try:
            user = UserModel.objects.get(phone_number=phone_number, otp=otp)
        except UserModel.DoesNotExist:
            raise serializers.ValidationError("Invalid phone number or OTP")

        if user.otp_expiry < timezone.now():
            raise serializers.ValidationError("OTP has expired")

        if not self.is_code_melli_valid(phone_number, code_melli):
            raise serializers.ValidationError("Code Melli does not belong to the provided phone number")
        
        if UserModel.objects.filter(code_melli=code_melli).exists():
            raise serializers.ValidationError("Code Melli is already in use")

        return data

    def is_code_melli_valid(self, phone_number, code_melli):
        # Replace with the actual API URL and implement the call
        # api_url = f"https://api.example.com/validate_code_melli?phone={phone_number}&code_melli={code_melli}"
        # response = requests.get(api_url)
        #if response.status_code == 200:
        #    return response.json().get('valid', False)
        return True

    def create(self, validated_data):
        phone_number = validated_data['phone_number']
        password = validated_data['password']
        code_melli = validated_data['code_melli']

        user = UserModel.objects.get(phone_number=phone_number)
        user.set_password(password)
        user.code_melli = code_melli
        user.is_active = True
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)
    code_melli = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    state = serializers.CharField(read_only=True)
    city = serializers.CharField(read_only=True)
    address = serializers.CharField(read_only=True)
    postal_code = serializers.CharField(read_only=True)
    gender = serializers.CharField(read_only=True)
    profile_picture = serializers.ImageField(read_only=True)
    user_register_at = serializers.DateTimeField(read_only=True)
    is_admin = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_trusted = serializers.BooleanField(read_only=True)

    def validate(self, data):
        phone_number = data.get('phone_number')
        password = data.get('password')

        if phone_number and password:
            user = authenticate(phone_number=phone_number, password=password)
            if not user:
                raise serializers.ValidationError("Invalid phone number or password")
            data['user'] = user
        else:
            raise serializers.ValidationError("Must include 'phone_number' and 'password'")
        return data

    def to_representation(self, instance):
        user = instance if isinstance(instance, UserModel) else None
        if not user:
            raise serializers.ValidationError("User instance is invalid")
        representation = super().to_representation(instance)
        representation['phone_number'] = user.phone_number
        representation['code_melli'] = user.code_melli
        representation['first_name'] = user.first_name
        representation['last_name'] = user.last_name
        representation['email'] = user.email
        representation['state'] = user.state
        representation['city'] = user.city
        representation['address'] = user.address
        representation['postal_code'] = user.postal_code
        representation['gender'] = user.gender
        representation['profile_picture'] = user.profile_picture.url if user.profile_picture else None
        representation['user_register_at'] = user.user_register_at
        representation['is_admin'] = user.is_admin
        representation['is_staff'] = user.is_staff
        representation['is_trusted'] = user.is_trusted
        return representation
    

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad_token')

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'first_name', 'last_name', 'state', 'city', 
            'address', 'postal_code', 'gender', 'phone_number', 'code_melli', 'email'
        )
    
    def validate(self, data):
        for field in ['first_name', 'last_name', 'state', 'city', 'address', 'postal_code', 'code_melli']:
            if field in data and data[field] == "":
                raise serializers.ValidationError({field: "This field cannot be blank."})
        return data

class ResetPasswordRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=True)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")

        user = self.context['request'].user
        if not user.check_password(old_password):
            raise serializers.ValidationError("Old password is incorrect")

        return data


class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'
        read_only_fields = ['user_id', 'phone_number']  # Restrict editing phone_number from admin

    def update(self, instance, validated_data):
        # Implement update logic for admin features, e.g., activating/deactivating users
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.is_admin = validated_data.get('is_admin', instance.is_admin)
        instance.save()
        return instance