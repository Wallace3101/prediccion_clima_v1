from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .utils import prob_adverse
import traceback

class ClimateProbView(APIView):
    def get(self, request):
        try:
            print(f"Todos los query_params: {dict(request.query_params)}")
            
            lat = float(request.query_params['lat'])
            lon = float(request.query_params['lon'])
            month = int(request.query_params['month'])
            day = int(request.query_params['day'])
            var = request.query_params['var']
            
            # DEBUG: Imprimir parámetros recibidos
            print(f"Parámetros recibidos: lat={lat}, lon={lon}, month={month}, day={day}, var={var}")
            
            data = prob_adverse(lat, lon, month, day, var)
            data['lat'] = lat
            data['lon'] = lon
            data['month'] = month
            data['day'] = day
            data['variable'] = var
            
        except (KeyError, ValueError) as e:
            # DEBUG: Imprimir el error específico
            print(f"Error en parámetros: {e}")
            print(f"Query params disponibles: {list(request.query_params.keys())}")
            print(traceback.format_exc())
            raise ValidationError('Parámetros lat, lon, month, day, var obligatorios y numéricos')
        except Exception as e:
            # DEBUG: Capturar cualquier otro error
            print(f"Error inesperado: {e}")
            print(traceback.format_exc())
            raise ValidationError(f'Error interno del servidor: {str(e)}')
        
        return Response(data)