Great! It sounds like we've covered a lot of ground with the user management features. Here's a summary of the URLs and their corresponding requests for the user management section of your backend. This will help you integrate these endpoints into your frontend application.

### User Management API Endpoints

1. **Send OTP**
   - **URL**: `/api/send-otp/`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "phone_number": "09123456789"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "OTP sent successfully"
     }
     ```

2. **Verify OTP**
   - **URL**: `/api/verify-otp/`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "phone_number": "09123456789",
       "otp": "123456"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "OTP verified successfully"
     }
     ```

3. **Register**
   - **URL**: `/api/register/`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "phone_number": "09123456789",
       "otp": "123456",
       "password": "yourpassword",
       "confirm_password": "yourpassword",
       "code_melli": "1234567890"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User registered successfully"
     }
     ```

4. **Login**
   - **URL**: `/api/login/`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "phone_number": "09123456789",
       "password": "yourpassword"
     }
     ```
   - **Response**:
     ```json
     {
       "refresh": "yourrefreshtoken",
       "access": "youraccesstoken",
       "user": {
         "phone_number": "09123456789",
         "code_melli": "1234567890",
         "first_name": "John",
         "last_name": "Doe",
         "email": "john.doe@example.com",
         "state": "Tehran",
         "city": "Tehran",
         "address": "123 Main St",
         "postal_code": "1234567890",
         "gender": "مرد",
         "profile_picture": "url_to_profile_picture",
         "user_register_at": "2023-07-06T12:34:56Z"
       }
     }
     ```

5. **Logout**
   - **URL**: `/api/logout/`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "refresh": "yourrefreshtoken"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Successfully logged out"
     }
     ```

6. **Reset Password**
   - **URL**: `/api/reset-password/`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "phone_number": "09123456789"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "New password sent via SMS"
     }
     ```

7. **Profile**
   - **URL**: `/api/profile/`
   - **Method**: `GET`
   - **Headers**:
     ```
     Authorization: Bearer youraccesstoken
     ```
   - **Response**:
     ```json
     {
       "phone_number": "09123456789",
       "code_melli": "1234567890",
       "first_name": "John",
       "last_name": "Doe",
       "email": "john.doe@example.com",
       "state": "Tehran",
       "city": "Tehran",
       "address": "123 Main St",
       "postal_code": "1234567890",
       "gender": "مرد",
       "profile_picture": "url_to_profile_picture",
       "user_register_at": "2023-07-06T12:34:56Z"
     }
     ```

### How to Use in Frontend

#### Sending OTP
1. User enters their phone number.
2. Send a `POST` request to `/api/send-otp/` with the phone number.
3. Notify the user that the OTP has been sent.

#### Verifying OTP and Completing Registration
1. User enters the OTP received.
2. Send a `POST` request to `/api/verify-otp/` with the phone number and OTP.
3. If verified, prompt the user to enter a password and `code_melli`.
4. Send a `POST` request to `/api/register/` with the phone number, OTP, password, confirm password, and `code_melli`.

#### Login
1. User enters their phone number and password.
2. Send a `POST` request to `/api/login/` with the phone number and password.
3. Store the returned tokens and user information in your frontend state management (e.g., Redux, Context API).

#### Logout
1. Send a `POST` request to `/api/logout/` with the refresh token.
2. Clear the user tokens and information from the frontend state.

#### Reset Password
1. User enters their phone number.
2. Send a `POST` request to `/api/reset-password/` with the phone number.
3. Notify the user that a new password has been sent via SMS.

#### Fetching Profile
1. Send a `GET` request to `/api/profile/` with the access token in the Authorization header.
2. Use the returned user information to display the user profile in the frontend.

This should cover all the necessary steps and URLs for user management in your backend. If there's anything else you need or further clarifications, feel free to ask!