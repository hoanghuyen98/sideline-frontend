import tokenService from '@/services/token.service'
import ApiBaseService from './api.base'
import { useMessageStore } from '@/stores/messageStore'

class ApiService extends ApiBaseService {
  constructor() {
    super()
  }

  getInboxHistory = (phone_number) => {
    const params = {
      phone: phone_number,
    }
    return this.getRequest('/refresh_inbox/', params)
  }

  getUserInfo = () => {
    return this.getRequest('/customer_info/')
  }

  postSendMessage = (from_number, to_number, text) => {
    const payload = {
      phone: from_number,
      to: to_number,
      text: text,
    }
    return this.postRequest('/send_message/', payload)
  }

  postSendMedia = (from_number, to_number, imageFile) => {
    return this.postImageFormRequest('/send_media/', imageFile, from_number, to_number)
  }

  postAddPhone = (phone, mail, provider, batch, message, media) => {
    const payload = {
      name: phone,
      mail: mail,
      provider: provider,
      batch: batch,
      message: message,
      media: media,
    }
    return this.postRequest('/phone_add/', payload)
  }

  postSaveTextNow = (email, password) => {
    const payload = {
      email: email,
      password: password,
    }
    return this.postRequest('/save_textnow/', payload)
  }

  getMailCatagories = (provider) => {
    const params = {
      provider: provider,
    }
    return this.getRequest('/mail_categories/', params)
  }

  postBuyMail = (product_id, provider, quality,product_name) => {
    const payload = {
      product_id: product_id,
      provider: provider,
      quality: quality,
      product_name: product_name
    }
    return this.postRequest('/buy_mail/', payload)
  }

  getPurchasedMails = () => {
    return this.getRequest('/purchased_mails/')
  }

  postGetAuthCode = (provider, email, refresh_token, client_id) => {
    const payload = {
      provider: provider,
      email: email,
      refresh_token: refresh_token,
      client_id: client_id,
    }
    return this.postRequest('/get_auth_code/', payload)
  }

  deleteAllMails = () => {
    return this.deleteRequest('/delete_all_mails/')
  }

  postSaveAppleMail = (mail, proxy) => {
    const payload = {
      mail: mail,
      proxy: proxy,
    }
    return this.postRequest('/save_apple_mail/', payload)
  }

  getAppleMail = () => {
    return this.getRequest('/applemail/')
  }

  getListEmployee = (page) => {
    const params = {
      page: page,
    }
    return this.getRequest('/employees/', params)
  }

  postCreateEmployee = (username, password, group_name) => {
    const payload = {
      username: username,
      password: password,
      group_name: group_name,
    }
    return this.postRequest('/employees/', payload)
  }

  deleteEmployee = (user_id) => {
    return this.deleteRequest(`/employees/${user_id}/`)
  }

  putEditEmployee = (user_id, password, group_name) => {
    const payload = {
      password: password,
      group_name: group_name,
    }
    return this.putRequest(`/employees/${user_id}/`, payload)
  }

  getListCustomer = (page = 1, page_size = 10) => {
    const params = {
      page: page,
      page_size: page_size,
    }
    return this.getRequest('/customers/', params)
  }

  postCreateCustomer = (username, password, phone_count) => {
    const payload = {
      username: username,
      password: password,
      phone_assigned_count: phone_count,
    }
    return this.postRequest('/customers/', payload)
  }

  putEditCustomer = (user_id, password, phone_count) => {
    const payload = {
      password: password,
      phone_assigned_count: phone_count,
    }
    return this.putRequest(`/customers/${user_id}/`, payload)
  }

  deleteCustomer = (customer_id) => {
    return this.deleteRequest(`/customers/${customer_id}/`)
  }

  postCreateGroup = (name_group) => {
    const payload = {
      name: name_group,
    }
    return this.postRequest('/employee_group/', payload)
  }

  getListGroup = () => {
    return this.getRequest('/employee_group/')
  }

  postAutoCreateCustomer = (phone_count) => {
    const payload = {
      phone_count: phone_count,
    }
    return this.postRequest('/auto_create_customers/', payload)
  }

  getEmployeePhoneSummary = () => {
    return this.getRequest('/employee_phone_summary/')
  }

  getReportOverview = () => {
    return this.getRequest('/reports_overview/')
  }

  getEmployeeReportOfDate = (start_date, end_date) => {
    const params = {
      start_date: start_date,
      end_date: end_date,
    }
    return this.getRequest('/report_by_employee/', params)
  }

  getGroupReportOfDate = (start_date, end_date) => {
    const params = {
      start_date: start_date,
      end_date: end_date,
    }
    return this.getRequest('/report_by_group/', params)
  }

  getGroupSoldReportOfDate = (start_date, end_date) => {
    const params = {
      start_date: start_date,
      end_date: end_date,
    }
    return this.getRequest('/report_by_group_sold/', params)
  }

  getCustomerAssignHistory = () => {
    return this.getRequest('/customer_assign_history/')
  }

  postResetPassword = (customer_names, history_id) => {
    const payload = {
      customer_names: customer_names,
      history_id: history_id,
    }
    return this.postRequest('/reset_password/', payload)
  }

  getTaskResetPassword = (taskId) => {
    return this.getRequest(`/task_status/${taskId}/`)
  }

  getTaskAddPhoneStatus = (taskId) => {
    return this.getRequest(`/task_status/${taskId}/`)
  }

  getProxySetting = () => {
    return this.getRequest('/proxy_setting/')
  }

  putProxySetting = (proxy_us) => {
    const payload = {
      proxy_us: proxy_us,
    }
    return this.putRequest('/proxy_setting/', payload)
  }

  postRevokeAccount = (customer_names, history_id) => {
    const payload = {
      customer_names: customer_names,
      history_id: history_id,
    }
    return this.postRequest('/revoke_phoneaccount/', payload)
  }

  logOut = async () => {
    tokenService.clearAll()
    const messageStore = useMessageStore()
    messageStore.clearCache()
    try {
      const result = await this.postRequest('/logout/', {})
      if (result?.redirect_url) {
        window.location.href = result.redirect_url
      } else {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout failed:', error)
      window.location.href = '/login'
    }
  }

  postLogin = ({ username, password }) => {
    const payload = {
      username: username,
      password: password,
    }
    return this.postRequest('/login/', payload)
  }
}

export default new ApiService()
