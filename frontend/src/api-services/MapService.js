const resource = '/api/efeo/maps'

export async function fetchAllMaps() {
  const response = await axios.get(`${resource}/`, { params: { limit: -1, offset: 0 } })
  return response.data
}
