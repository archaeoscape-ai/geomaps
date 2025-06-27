const siteResource = '/api/efeo/sites'
const resource = '/api/efeo/site-resources'

export async function getSiteResources(siteId, params) {
  const response = await axios.get(`${siteResource}/${siteId}/resources/`, { params })
  return response.data
}

export async function createSiteResource(siteId, data) {
  const response = await axios.post(`${siteResource}/${siteId}/resources/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateSiteResource(resourceId, data) {
  const response = await axios.put(`${resource}/${resourceId}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function siteResourceDetail(resourceId) {
  const response = await axios.get(`${resource}/${resourceId}/`)
  return response.data
}

export async function deleteSiteResource(siteId) {
  const response = await axios.delete(`${resource}/${siteId}/`)
  return response.data
}

export async function getSiteResourceTypes(params) {
  const response = await axios.get(`/api/efeo/site-resource-types/`, { params })
  return response.data
}

export async function getIndividuals(params) {
  const response = await axios.get(`/api/efeo/individuals/`, { params })
  return response.data
}
