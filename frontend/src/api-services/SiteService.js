const mapSiteResource = '/api/efeo/maps'
const siteResource = '/api/efeo/sites'

export async function getMapSites(mapId, params) {
  const response = await axios.get(`${mapSiteResource}/${mapId}/sites/`, { params })
  return response.data
}

export async function createSite(mapId, data) {
  const response = await axios.post(`${mapSiteResource}/${mapId}/sites/`, data)
  return response.data
}

export async function siteDetail(siteId) {
  const response = await axios.get(`${siteResource}/${siteId}/`)
  return response.data
}

export async function updateSite(siteId, data) {
  const response = await axios.put(`${siteResource}/${siteId}/`, data)
  return response.data
}

export async function deleteSite(siteId) {
  const response = await axios.delete(`${siteResource}/${siteId}/`)
  return response.data
}

export async function getSiteTypes(params) {
  const response = await axios.get(`/api/efeo/site-types/`, { params })
  return response.data
}
