const rawBase = import.meta.env.VITE_BASE_API_URL

if (!rawBase) {
  throw new Error('VITE_BASE_API_URL must be defined')
}

// If empty, fall back to same-origin
export const APP_ORIGIN =
  rawBase && rawBase.trim() !== ''
    ? rawBase.replace(/\/$/, '')
    : window.location.origin

export const GEOSERVER_BASE_URL =
  new URL('/geoserver', APP_ORIGIN).toString().replace(/\/$/, '')

export const GEOSERVER_WMS_URL =
  new URL('/geoserver/wms', APP_ORIGIN).toString()
