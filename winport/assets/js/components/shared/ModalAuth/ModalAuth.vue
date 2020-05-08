<!--<template src="./ModalAuth.html"></template>-->
<style src="./ModalAuth.scss" lang="scss"></style>

<script>
import {mapGetters, mapState, mapMutations} from 'vuex'
import FormElementError from '@/components/shared/FormElementError/FormElementError.vue'

export default {
  name: 'ModalAuth',

  template: require('./ModalAuth.html'),

  components: {
    'form-element-error': FormElementError
  },

  data () {
    return {
      signinForm: {
        email: '',
        password: ''
      },
      signinFormResponse: {},

      signupForm: {
        email: '',
        password: ''
      },
      signupFormResponse: {},

      resetPasswordForm: {
        email: ''
      },
      resetPasswordFormResponse: {}
    }
  },

  methods: {
    ...mapMutations(['setModalAuthName']),

    authSignin () {
      this.$store.dispatch('authSignin', this.signinForm).then(() => {
        this.signinFormResponse = this.$store.getters.getAuthSignin
        this.signinForm.password = ''
        if (this.signinFormResponse.success) {
          this.setModalAuthName('')
          this.clearAllFields()
          if (typeof window.nextRouter !== 'undefined') {
            window.app.$router.push(window.nextRouter.path)
          } else {
            this.$router.go()
          }
        }
      })
    },

    authSignup () {
      this.$store.dispatch('authSignup', this.signupForm).then(() => {
        this.signupFormResponse = this.$store.getters.getAuthSignup
        if (this.signupFormResponse.success) {
          this.signupForm.email = ''
          this.signupForm.password = ''
        }
      })
    },

    authResetPassword () {
      this.$store.dispatch('authResetPassword', this.resetPasswordForm).then(() => {
        this.resetPasswordFormResponse = this.$store.getters.getAuthResetPassword
      })
    },

    clearAllFields () {
      this.signinForm.email = ''
      this.signinForm.password = ''
      this.signinFormResponse = {}
      this.signupForm.email = ''
      this.signupForm.password = ''
      this.signupFormResponse = {}
      this.resetPasswordForm.email = ''
      this.resetPasswordFormResponse = {}
    }
  },

  computed: {
    modalAuthName () {
      return this.$store.getters.getModalAuthName
    },

    signupResponse () {
      return this.signupFormResponse
    },

    signinResponse () {
      return this.signinFormResponse
    },

    resetPasswordResponse () {
      return this.resetPasswordFormResponse
    }
  },

  watch: {
    modalAuthName: function () {
      if (this.modalAuthName === '') {
        this.clearAllFields()
      }
    }
  }
}
</script>
