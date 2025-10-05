# 🔧 Configuración Backend Django

## Configuraciones necesarias para conectar con el frontend Vue

### 1. Instalar paquetes necesarios

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple
```

### 2. Configuración de Django (settings.py)

```python
from datetime import timedelta
from decouple import config

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='your-secret-key-here')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Your apps
    'auth_app',
    'weather',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS debe estar aquí
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Vite dev server
    'http://localhost:3000',
    'http://127.0.0.1:5173',
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',

    'JTI_CLAIM': 'jti',
}
```

### 3. URLs principales (urls.py)

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/weather/', include('weather.urls')),
]
```

### 4. URLs de autenticación (auth_app/urls.py)

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Autenticación
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.CurrentUserView.as_view(), name='current-user'),
    
    # JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Password reset
    path('password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Email verification
    path('verify-email/', views.EmailVerificationView.as_view(), name='verify-email'),
]
```

### 5. Vista de Login ejemplo (auth_app/views.py)

```python
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, LoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            username=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if user is None:
            return Response(
                {'message': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })

class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
```

### 6. Serializers ejemplo (auth_app/serializers.py)

```python
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
```

### 7. URLs del clima (weather/urls.py)

```python
from django.urls import path
from . import views

urlpatterns = [
    path('current/', views.CurrentWeatherView.as_view(), name='current-weather'),
    path('prediction/', views.WeatherPredictionView.as_view(), name='weather-prediction'),
    path('history/', views.WeatherHistoryView.as_view(), name='weather-history'),
    path('alerts/', views.WeatherAlertsView.as_view(), name='weather-alerts'),
    path('favorites/', views.FavoriteLocationsView.as_view(), name='favorite-locations'),
    path('favorites/<int:pk>/', views.FavoriteLocationDetailView.as_view(), name='favorite-location-detail'),
]
```

### 8. Vista del clima ejemplo (weather/views.py)

```python
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class CurrentWeatherView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        location = request.query_params.get('location')
        
        if not location:
            return Response(
                {'message': 'Se requiere el parámetro location'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Aquí iría tu lógica para obtener el clima
        weather_data = {
            'location': location,
            'temperature': 25,
            'humidity': 60,
            'description': 'Parcialmente nublado',
            'wind_speed': 15
        }
        
        return Response(weather_data)

class WeatherPredictionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        location = request.query_params.get('location')
        days = request.query_params.get('days', 7)
        
        # Aquí iría tu lógica para obtener la predicción
        prediction_data = {
            'location': location,
            'days': days,
            'forecast': [
                {'day': 1, 'temp_max': 28, 'temp_min': 18, 'description': 'Soleado'},
                {'day': 2, 'temp_max': 26, 'temp_min': 17, 'description': 'Nublado'},
                # ... más días
            ]
        }
        
        return Response(prediction_data)
```

### 9. Archivo .env para Django

```env
SECRET_KEY=tu-clave-secreta-muy-segura-aqui
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 10. Comandos para iniciar el proyecto

```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### 11. requirements.txt

```txt
Django==4.2.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0
python-decouple==3.8
```

## 🔍 Pruebas de Endpoints

### Usar desde el frontend

```javascript
// En Vue (ya configurado en el proyecto)
import api from '@/services/api'

// Login
const response = await api.post('/auth/login/', {
  email: 'user@example.com',
  password: 'password123'
})

// Obtener clima
const weather = await api.get('/weather/current/', {
  params: { location: 'Madrid' }
})
```

### Usar con curl

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Obtener usuario (con token)
curl -X GET http://localhost:8000/api/auth/user/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## ✅ Checklist

- [ ] Django instalado y configurado
- [ ] CORS configurado correctamente
- [ ] JWT configurado
- [ ] Endpoints de autenticación creados
- [ ] Endpoints del clima creados
- [ ] Base de datos migrada
- [ ] Superusuario creado
- [ ] Servidor corriendo en puerto 8000
- [ ] Frontend puede conectarse al backend

## 📝 Notas

- El frontend está configurado para conectarse a `http://localhost:8000/api`
- Todos los requests incluyen automáticamente el token JWT
- Los tokens se refrescan automáticamente cuando expiran
- Las rutas protegidas requieren autenticación
