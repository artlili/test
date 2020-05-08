import Vue from 'vue'
import { createPostParams, validateResponse } from '@/helpers'

export class WidgetService {
  static async getData () {
    const response = await Vue.axios.get(`/getMessages/news`)
    return validateResponse(response, { log: false })
  }

  static async getManager () {
    const response = await Vue.axios.get(`/getManager/all`)
    return validateResponse(response)
  }

  static async sendData (msg) {
    const params = createPostParams({ text: msg })
    const response = await Vue.axios.post(`/setNewMessage/new`, params)
    return validateResponse(response)
  }
}
