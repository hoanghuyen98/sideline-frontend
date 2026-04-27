// src/services/token.service.js
import Cookies from 'js-cookie'

const TokenService = {
  setCookieByKeyValue(key, value, days = 1) {
    Cookies.set(key, value, {
      expires: days,
      secure: false, // ❌ bỏ Secure vì bạn đang dùng HTTP
      sameSite: 'Lax', // ✅ cho phép cookie hoạt động trong cùng domain / proxy
      // secure: true,
      // sameSite: 'Strict',
      path: '/',
    })
  },

  getCookieByKey(key) {
    return Cookies.get(key)
  },

  removeCookieByKey(key) {
    Cookies.remove(key, { path: '/' })
  },

  clearAll() {
    Cookies.remove('access_token', { path: '/' })
    Cookies.remove('refresh_token', { path: '/' })
    Cookies.remove('user_name', { path: '/' })
    Cookies.remove('role', { path: '/' })
  },
}

export default TokenService
