import xarray as xr, numpy as np, os, datetime
from clima_backend.settings import CACHE_NETCDF_DIR
from django.core.management import call_command

def filename_doy(doy: int) -> str:
    return str(CACHE_NETCDF_DIR / f'era5_doy{doy:03d}.nc')

def open_era5(doy: int):
    """Devuelve dataset ya cacheado o lo descarga si no existe."""
    path = filename_doy(doy)
    if not os.path.exists(path):
        # llamamos al management command
        call_command('download_era5', doy=doy)
    
    # Intentar abrir con diferentes engines
    try:
        return xr.open_dataset(path, engine='netcdf4')
    except Exception as e:
        print(f"Error abriendo con netcdf4: {e}")
        try:
            return xr.open_dataset(path, engine='scipy')
        except Exception as e2:
            print(f"Error abriendo con scipy: {e2}")
            # Si ambos fallan, eliminar el archivo corrupto y reintentar
            if os.path.exists(path):
                os.remove(path)
            call_command('download_era5', doy=doy)
            return xr.open_dataset(path, engine='netcdf4')

def extract_cell(ds, lat, lon):
    return ds.sel(latitude=lat, longitude=lon, method='nearest')
def prob_adverse(lat, lon, month, day, variable: str):
    doy = datetime.date(2001, month, day).timetuple().tm_yday
    ds = open_era5(doy)

    # Verificar si las variables existen
    required_vars = ['t2m', 'u10', 'v10', 'd2m']
    missing_vars = [var for var in required_vars if var not in ds.variables]
    if missing_vars:
        raise ValueError(f"Variables faltantes en el dataset: {missing_vars}")
    da_t = ds['t2m'] - 273.15
    da_u = ds['u10']
    da_v = ds['v10']
    da_dp = ds['d2m']

    # Corrige el cálculo de wind
    wind = np.sqrt(da_u**2 + da_v**2)

    es = 6.112 * np.exp(17.67 * (da_t / (da_t + 243.5)))
    ea = 6.112 * np.exp(17.67 * (da_dp / (da_dp + 243.5)))
    rh = (ea / es) * 100

    tmax = extract_cell(da_t, lat, lon).max(dim='time')
    tmin = extract_cell(da_t, lat, lon).min(dim='time')
    wmean = extract_cell(wind, lat, lon).mean(dim='time')
    rhmean = extract_cell(rh, lat, lon).mean(dim='time')

    # Cálculo de probabilidades
    if variable == 'hot':
        thresh = np.percentile(tmax, 90)
        proba = (tmax > thresh).mean()
    elif variable == 'cold':
        thresh = np.percentile(tmin, 10)
        proba = (tmin < thresh).mean()
    elif variable == 'wind':
        thresh = np.percentile(wmean, 90)
        proba = (wmean > thresh).mean()
    elif variable == 'humid':
        thresh = np.percentile(rhmean, 90)
        proba = (rhmean > thresh).mean()
    elif variable == 'uncomfortable':
        p90t, p10t = np.percentile(tmax, 90), np.percentile(tmin, 10)
        p75w, p75h = np.percentile(wmean, 75), np.percentile(rhmean, 75)
        mask = ((tmax > p90t) | (tmin < p10t)) & (wmean > p75w) & (rhmean > p75h)
        proba = mask.mean()
    else:
        raise ValueError('variable no válida')

    return {
        'probability': float(np.round(proba, 2)),
        'threshold': float(thresh.values),
        'unit': {'hot': '°C', 'cold': '°C', 'wind': 'm/s', 'humid': '%'}[variable],
        'n_years': int(tmax.size),
    }