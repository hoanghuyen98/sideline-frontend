import axios from 'axios'
import TokenService from './token.service'

axios.defaults.xsrfCookieName = 'techhub_csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true
let root_url = import.meta.env.VITE_BASE_URL || 'http://38.145.199.150'

const instance = axios.create({
  baseURL: root_url,
  headers: {
    'content-type': 'application/json',
  },

  credentials: 'include',
  timeout: 30000,
  timeoutErrorMessage: 'Timeout',
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// ✅ Request Interceptor: Thêm access token vào Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getCookieByKey('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ✅ Response Interceptor: Tự động refresh token khi bị 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true

      try {
        const refreshToken = TokenService.getCookieByKey('refresh_token')

        if (!refreshToken) throw new Error('No refresh token')

        // Gọi API refresh token
        const res = await axios.post(`${root_url}/api/v1/token/refresh/`, { refresh: refreshToken })
        const newAccessToken = res.data.access
        TokenService.setCookieByKeyValue('access_token', newAccessToken)

        // Gửi lại request gốc với token mới
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`
        return instance(originalConfig)
      } catch (refreshError) {
        TokenService.clearAll()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default instance
