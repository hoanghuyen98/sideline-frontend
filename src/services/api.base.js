import http from './api'
import qs from 'qs'
class ApiBaseService {
  constructor() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.base_api_path = '/api/v1'
    this.default_headers = { 'Content-Type': 'application/json', 'X-Timezone': timezone }
  }

  getRequestWithFullResponse = async (url, params, headers = this.default_headers) => {
    let api_url = `${this.base_api_path}${url}`
    return await http
      .get(api_url, {
        params: params,
        headers: headers,
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error
      })
  }

  getRequest = async (url, params, headers = this.default_headers) => {
    let api_url = `${this.base_api_path}${url}`
    try {
      const response = await http.get(api_url, {
        params: params,
        headers: headers,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
      })

      if (response && response.data) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      if (error.response) {
        return error.response.data
      } else {
        return null
      }
    }
  }

  getRequestFile = async (url, params, headers = this.default_headers) => {
    let api_url = `${this.base_api_path}${url}`
    return await http
      .get(api_url, {
        responseType: 'blob',
        params: params,
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  postRequest = async (url, payload, headers = this.default_headers) => {
    let api_url = `${this.base_api_path}${url}`
    return await http
      .post(api_url, payload, { headers: headers })
      .then((response) => {
        if (response && response.data) {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  postImageFormRequest = async (
    url,
    imagefile,
    from_number,
    to_number,
    headers = { 'Content-Type': 'multipart/form-data' },
  ) => {
    let api_url = `${this.base_api_path}${url}`
    var formData = new FormData()
    formData.append('file', imagefile)
    formData.append('phone', from_number)
    formData.append('to', to_number)

    return await http
      .post(api_url, formData, { headers: headers })
      .then((response) => {
        if (response && response.data) {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  postFormRequest = async (url, payload, headers = { 'Content-Type': 'multipart/form-data' }) => {
    let api_url = `${this.base_api_path}${url}`
    var formData = new FormData()
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value)
    }

    return await http
      .post(api_url, formData, { headers: headers })
      .then((response) => {
        if (response && response.data) {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  putFormRequest = async (url, payload, headers = { 'Content-Type': 'multipart/form-data' }) => {
    let api_url = `${this.base_api_path}${url}`
    var formData = new FormData()
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value)
    }

    return await http
      .put(api_url, formData, { headers: headers })
      .then((response) => {
        if (response && response.data) {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  putRequest = async (url, payload, headers = this.default_headers) => {
    let api_url = `${this.base_api_path}${url}`
    return await http
      .put(api_url, payload, { headers: headers })
      .then((response) => {
        if (response && response.data) {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  patchRequest = async (url, payload, headers = { 'Content-Type': 'multipart/form-data' }) => {
    let api_url = `${this.base_api_path}${url}`
    return await http
      .patch(api_url, payload, { headers: headers })
      .then((response) => {
        if (response && response.data) {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  deleteRequest = async (url, params, headers = { 'Content-Type': 'application/json' }) => {
    let api_url = `${this.base_api_path}${url}`
    return await http
      .delete(api_url, { params, headers: headers })
      .then((response) => {
        if (response && response.data) {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        } else {
          return null
        }
      })
  }

  deleteRequestResponse = async (url, params, headers = { 'Content-Type': 'application/json' }) => {
    let api_url = `${this.base_api_path}${url}`
    return await http
      .delete(api_url, { params, headers: headers })
      .then((response) => {
        if (response && response.status == 204) {
          return true
        }
        return false
      })
      .catch((error) => {
        if (error.response?.status && error.response?.data) {
          return error.response.data
        }
        return false
      })
  }
}
export default ApiBaseService
