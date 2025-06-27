const resource = '/api/accounts/token'

export async function login(data) {
  return axios.post(`${resource}/`, data)
}

export async function logout() {
  return axios.post(`${resource}/logout/`)
}

export async function getAuthUser() {
  const response = await axios.get('/api/accounts/me/', { allowParallel: true })
  return response.data
}
