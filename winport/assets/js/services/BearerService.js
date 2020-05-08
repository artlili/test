import Vue from 'vue'

/**
 * Bearer Authorization
 */
export default {
  setToken () {
    if (localStorage.getItem('token')) {
      Vue.http.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    } else {
      this.a.push('/signin')
    }
  }
}
