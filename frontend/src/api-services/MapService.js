const resource = '/api/efeo/maps'

export async function fetchAllMaps() {
  const response = await axios.get(`${resource}/`, { params: { limit: -1, offset: 0 } })
  return response.data
}

export async function fetchMapById(id) {
  const response = await axios.get(`${resource}/${id}/`)
  return response.data
}

export async function fetchMapLayerConfig(id) {
  const response = await axios.get(`${resource}/${id}/config/`)
  return response.data
}

export async function updateCurrentMapLayerConfig(mapId, data) {
  const response = await axios.post(`${resource}/${mapId}/config/`, { config: data })
  return response.data
}