import Vue from 'vue'
import { validateResponse } from '@/helpers'

const API_URL = '/'

export class AccessService {
  // Получить залогиненого пользователя
  static async getLoggedUser () {
    const params = {
      'id': 1576735749898,
      'key': 'jksd32m9fdw03fjds9323jj9'
    }
    const response = await Vue.axios.post(`/user-diler/get-logged-user`, params, { baseURL: API_URL })
    const validator = function (response) {
      return response.data
    }
    return validateResponse(response, validator)
  }
}
