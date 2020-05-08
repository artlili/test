<!--<template src="./Feedback.html"></template>-->
<style src="./Feedback.scss" lang="scss"></style>

<script>
import {mapGetters, mapState, mapMutations} from 'vuex'
import FormElementError from '@/components/shared/FormElementError/FormElementError.vue'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'Feedback',

  template: require('./Feedback.html'),

  components: {
    'form-element-error': FormElementError,
    'vue-recaptcha': VueRecaptcha
  },

  data () {
    return {
      feedbackForm: {
        name: '',
        email: '',
        message: '',
        recaptchaToken: ''
      },
      feedbackResponse: {},
      message: '',
      status: ''
    }
  },

  methods: {
    ...mapMutations(['setOpenFeedback']),

    checkCaptcha () {
      self.status = 'submitting'
      this.$refs.recaptcha.execute()
    },

    onCaptchaVerified: function (recaptchaToken) {
      const self = this
      self.$refs.recaptcha.reset()
      self.sendFeedback(recaptchaToken)
    },

    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset()
    },

    sendFeedback (recaptchaToken) {
      this.feedbackForm.recaptchaToken = recaptchaToken
      this.$store.dispatch('sendFeedback', this.feedbackForm).then(() => {
        this.feedbackResponse = this.$store.getters.getFeedbackResponse
        if (this.feedbackResponse.success) {
          this.clearFields()
        }
        self.status = ''
      })
    },

    clearFields () {
      this.feedbackForm.name = ''
      this.feedbackForm.email = ''
      this.feedbackForm.message = ''
      this.feedbackForm.recaptchaToken = ''
    }
  },

  computed: {
    openFeedback () {
      if (typeof window.feedbackMessage !== 'undefined') {
        this.feedbackForm.message = window.feedbackMessage
        delete window.feedbackMessage
      }
      return this.$store.getters.getOpenFeedback
    }
  }
}
</script>
