import Vue from 'vue'
import ConfigService from '@/services/ConfigService'

const ReasonModule = {
  state: {
    openReason: false,
    mode: null
  },

  mutations: {
    setOpenReason (state, status, mode) {
      state.openReason = status.open
      if (status.mode) {
        state.mode = status.mode
      }
    }
  },

  actions: {
    sendVerifyPhone: ({commit}, form) => {
      return Vue.http.post(ConfigService.getSetting('api') + '/user/verify-phone', form)
        .then(response => response.json())
        .then(verifyPhoneResponse => {
          commit('setVerifyPhoneResponse', verifyPhoneResponse)
        })
        .catch(err => {
          commit('setError', err)
        })
    },
    sendVerifyPhoneCode: ({commit}, form) => {
      return Vue.http.post(ConfigService.getSetting('api') + '/user/verify-code', form)
        .then(response => response.json())
        .then(verifyCodeResponse => {
          commit('setVerifyCodeResponse', verifyCodeResponse)
        })
        .catch(err => {
          commit('setError', err)
        })
    },
    checkIfPhoneVerified: ({commit}, form) => {
      return Vue.http.post(ConfigService.getSetting('api') + '/user/check-phone', form)
        .then(response => response.json())
        .then(ifVerifiedResponse => {
          commit('setIfVerifiedResponse', ifVerifiedResponse)
        })
        .catch(err => {
          commit('setError', err)
        })
    }
  },

  getters: {
    getOpenReason (state) {
      return state.openReason
    },
    getReasonMode (state) {
      return state.mode
    }
  }
}

export default ReasonModule
