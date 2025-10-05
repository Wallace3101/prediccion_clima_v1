from django.core.management.base import BaseCommand
import cdsapi, os, datetime, time
import xarray as xr
from clima_backend.settings import CACHE_NETCDF_DIR

class Command(BaseCommand):
    help = "Descarga ERA5-Land para un día del año (doy 1-366) hasta 2024"

    def add_arguments(self, parser):
        parser.add_argument('doy', type=int)

    def handle(self, *args, **options):
        doy = options['doy']
        date = datetime.datetime(2001, 1, 1) + datetime.timedelta(days=doy - 1)
        month, day = date.month, date.day
        # Rango completo 1980-2024
        years = list(range(1980, 2025))
        target = CACHE_NETCDF_DIR / f'era5_doy{doy:03d}.nc'
        os.makedirs(target.parent, exist_ok=True)

        # Verificar si el archivo ya existe y es válido
        if target.exists():
            try:
                # Intentar abrir el archivo para verificar que es válido
                test_ds = xr.open_dataset(str(target), engine='netcdf4')
                test_ds.close()
                self.stdout.write(self.style.SUCCESS(f'Archivo ya existe y es válido: {target}'))
                return
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'Archivo corrupto, re-descargando: {e}'))
                target.unlink()

        c = cdsapi.Client()
        
        # Intentar la descarga con reintentos
        max_retries = 3
        for attempt in range(max_retries):
            try:
                self.stdout.write(f'Intentando descarga (intento {attempt + 1}/{max_retries})...')
                
                c.retrieve(
                    'reanalysis-era5-land',
                    {
                        'variable': [
                            '2m_temperature',
                            '10m_u_component_of_wind',
                            '10m_v_component_of_wind',
                            '2m_dewpoint_temperature',
                        ],
                        'year': [str(y) for y in years],
                        'month': f'{month:02d}',
                        'day': f'{day:02d}',
                        'time': ['00:00', '06:00', '12:00', '18:00'],
                        'format': 'netcdf',
                    },
                    str(target),
                )
                
                # Verificar que el archivo se descargó correctamente
                if target.exists() and target.stat().st_size > 0:
                    # Verificar que sea un NetCDF válido
                    test_ds = xr.open_dataset(str(target), engine='netcdf4')
                    test_ds.close()
                    self.stdout.write(self.style.SUCCESS(f'Descargado y verificado {target}'))
                    break
                else:
                    raise Exception("Archivo vacío o no creado")
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error en intento {attempt + 1}: {e}'))
                if attempt < max_retries - 1:
                    wait_time = 30 * (attempt + 1)  # Espera progresiva: 30, 60, 90 segundos
                    self.stdout.write(f'Esperando {wait_time} segundos antes de reintentar...')
                    time.sleep(wait_time)
                    if target.exists():
                        target.unlink()  # Eliminar archivo corrupto
                else:
                    self.stdout.write(self.style.ERROR(f'Fallo después de {max_retries} intentos'))
                    raise