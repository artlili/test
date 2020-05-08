'use strict'

import Vue from 'vue'
import VueResource from 'vue-resource'
import Croppa from 'vue-croppa'
import router from '@/router/router'
import store from '@/store/store'
import vSelect from 'vue-select'
import App from '@/App.vue'
import sortable from 'sortablejs'
import 'jquery.inputmask'
import multimask from 'inputmask-multi'
import Notifications from 'vue-notification'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'

Vue.use(Tooltip)
Vue.use(VueResource)
Vue.use(Croppa)
Vue.use(Notifications)
Vue.component('v-select', vSelect)
Vue.component('app', App)
Object.defineProperty(Vue.prototype, '$sortable', { value: sortable })

const app = new Vue({
  router,
  store,
  render: h => h(App)
})

document.addEventListener('DOMContentLoaded', () => {
  app.$mount('#app')
})

document.addEventListener('vue-post-render', () => {
})
