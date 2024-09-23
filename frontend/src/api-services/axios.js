import axios from 'axios'
import { getCookie, removeCookie, setCookie } from '@/helpers/cookies'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const pendingRequests = new Map()
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

function generateRequestKey(config) {
  return `${config.method}:${config.url}`
}

function attachAuthorizationHeader(config) {
  const accessToken = getCookie('accessToken')
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
}

function managePendingRequests(config) {
  const requestKey = generateRequestKey(config)
  if (!config.allowParallel) {
    if (pendingRequests.has(requestKey)) {
      const { cancel } = pendingRequests.get(requestKey)
      cancel('Cancelled due to new request')
    }
    config.cancelToken = new axios.CancelToken((cancel) => {
      pendingRequests.set(requestKey, { cancel })
    })
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    attachAuthorizationHeader(config)
    managePendingRequests(config)

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => {
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)

    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (originalRequest && !originalRequest.allowParallel) {
      const requestKey = generateRequestKey(originalRequest)
      pendingRequests.delete(requestKey)
    }

    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        /**
         * For the scenario where multiple asynchronous API calls fail with a 401 status code.
         * Put all the requests into a queue, then refreshes the token.
         * Upon successful token refresh, the previously failed requests will be re-executed.
         */
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const token = await refreshAccessToken()
        if (token) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
        }
        processQueue(null, token)
        return axiosInstance(originalRequest)
      } catch (err) {
        processQueue(err, null)
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

async function refreshAccessToken() {
  try {
    const response = await axios.post('/api/accounts/token/refresh/')
    const { access } = response.data

    setCookie('accessToken', access, 1)

    return access
  } catch (error) {
    removeCookie('accessToken')
    window.location.href = '/login'
    return null
  }
}

export default axiosInstance
