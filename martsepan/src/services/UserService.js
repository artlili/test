import Vue from 'vue'
import { createPostParams, validateResponse, getCookie } from '@/helpers'
import { COOKIES_NAMES } from '@/constants'

export class UserService {
  static async getOrganizationUsers () {
    const response = await Vue.axios.get(`/getAllUserFromOrganization/${getCookie(COOKIES_NAMES.ORG_ID)}`)
    const validator = function (response) {
      return response.data && response.data instanceof Array
    }
    return validateResponse(response, validator)
  }

  static async saveUserData (credentials) {
    const params = createPostParams(credentials)
    console.log(params)
    const response = await Vue.axios.post(`/saveUser/${credentials.id}`, params)
    return validateResponse(response)
  }

  static async createNewUser (credentials) {
    delete credentials.id
    const params = createPostParams(credentials)
    const response = await Vue.axios.post('/saveUser/0', params)
    return validateResponse(response)
  }

  static async removeUser (userId) {
    const response = await Vue.axios.get(`/removeUser/${userId}`, { baseURL: '/dilerlogin' })
    return validateResponse(response)
  }

  static async getUserIdAndEntities () {
    const response = await Vue.axios.get('/listGroupOrg/all')

    function validator (response) {
      return response.data && response.data.items instanceof Array
    }

    return validateResponse(response, validator)
  }
}
