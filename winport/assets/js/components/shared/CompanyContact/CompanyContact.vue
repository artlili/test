<style src="./CompanyContact.scss" lang="scss"></style>

<script>
import {mapGetters, mapState, mapMutations} from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
import FormElementError from '@/components/shared/FormElementError/FormElementError.vue'

export default {
  name: 'CompanyContact',

  template: require('./CompanyContact.html'),

  components: {
    'vue-recaptcha': VueRecaptcha,
    'form-element-error': FormElementError
  },

  props: ['company', 'openTab', 'feedback'],

  data () {
    return {
      companyPhoneIcon: {
        type1: '',
        type2: '',
        type3: '',
        type4: '',
        type5: ''
      },

      companyFeedback: false,
      wrongNumber: false,
      companyFeedbackForm: {
        parentId: '',
        type: 'company',
        companyAlias: '',
        name: '',
        phone: '',
        email: '',
        city: '',
        message: '',
        recaptchaToken: ''
      },
      feedbackResponse: {},
      status: '',

      wrong_phone_1: false,
      wrong_phone_2: false,
      wrong_phone_3: false,
      wrong_phone_4: false,
      wrong_phone_5: false,

      companyContactsPrompt: null
    }
  },

  methods: {
    ...mapMutations(['setOpenCompanyContact']),

    closeAndSwitchToContacts () {
      this.setOpenCompanyContact(false)
      this.companyFeedback = false
      this.wrongNumber = false
      this.currentCompanyContactsPrompt = null
    },

    reportWrongNumber () {
      this.wrongNumber = true
    },

    isWeekend (day) {
      return day === 'Выходной'
    },

    isDayAndNight (day) {
      return day === 'Круглосуточно'
    },

    checkCaptcha () {
      this.status = 'submitting'
      this.$refs.companyContactRecaptcha.execute()
    },

    onCompanyCaptchaVerified: function (recaptchaToken) {
      const self = this
      self.$refs.companyContactRecaptcha.reset()
      self.sendCompanyFeedback(recaptchaToken)
    },

    onCompanyCaptchaExpired: function () {
      this.$refs.companyContactRecaptcha.reset()
    },

    sendCompanyFeedback (recaptchaToken) {
      this.companyFeedbackForm.recaptchaToken = recaptchaToken
      this.companyFeedbackForm.companyAlias = this.company.alias
      if (this.company.type === 'branch') {
        this.companyFeedbackForm.parentId = this.company.parent_id
        this.companyFeedbackForm.type = 'branch'
      } else {
        this.companyFeedbackForm.parentId = null
        this.companyFeedbackForm.type = 'company'
      }
      this.$store.dispatch('sendCompanyFeedback', this.companyFeedbackForm).then(() => {
        this.feedbackResponse = this.$store.getters.getCompanyFeedbackResponse
        if (this.feedbackResponse.success) {
          this.clearFields()
        }
        this.status = ''
      })
    },

    sendWrongNumber: function () {
      const wrongForm = {
        company_alias: this.company.alias,
        wrong_phone_1: this.wrong_phone_1,
        wrong_phone_2: this.wrong_phone_2,
        wrong_phone_3: this.wrong_phone_3,
        wrong_phone_4: this.wrong_phone_4,
        wrong_phone_5: this.wrong_phone_5
      }
      this.$store.dispatch('sendCompanyWrongNumber', wrongForm).then(() => {
        this.feedbackResponse = this.$store.getters.getCompanyWrongNumberResponse
        if (this.feedbackResponse.success) {
          this.$notify({
            title: 'Информация о некорректных номерах успешно отправлена!',
            type: 'success',
            duration: 5000
          })
          this.wrong_phone_1 = false
          this.wrong_phone_2 = false
          this.wrong_phone_3 = false
          this.wrong_phone_4 = false
          this.wrong_phone_5 = false
          this.closeAndSwitchToContacts()
        } else {
          this.$notify({
            title: 'Ошибка отправки формы, попробуйте позже!',
            type: 'error',
            duration: 5000
          })
        }
        this.status = ''
      })
    },

    clearFields () {
      this.companyFeedbackForm.name = ''
      this.companyFeedbackForm.email = ''
      this.companyFeedbackForm.message = ''
      this.companyFeedbackForm.city = ''
      this.companyFeedbackForm.companyAlias = ''
      this.companyFeedbackForm.recaptchaToken = ''
      this.companyFeedbackForm.phone = ''
    },

    toggleModal: function () {
      this.companyFeedback = !this.companyFeedback
      this.prompt = this.companyFeedback
    },

    formatPhone: function (phone) {
      let re = /\(/g
      let newPhone = phone.replace(re, '&nbsp;(')
      re = /\)/g
      newPhone = newPhone.replace(re, ')&nbsp;')

      return newPhone
    }
  },

  computed: {
    openCompanyContact () {
      this.companyContactsPrompt = this.openTab
      return this.$store.getters.getOpenCompanyContact
    },

    companyPhoneType () {
      function addCompanyPhoneClass (phone) {
        if (phone === 'Телефон') return phone = 'tel'

        if (phone === 'Телефон/факс') return phone = 'tel-fax'

        if (phone === 'Факс') return phone = 'fax'

        if (phone === 'Телефон мобильный') return phone = 'tel-mob'
      }

      if (this.company.phone_1) { this.companyPhoneIcon.type1 = addCompanyPhoneClass(this.company.phone_1_type) }

      if (this.company.phone_2) { this.companyPhoneIcon.type2 = addCompanyPhoneClass(this.company.phone_2_type) }

      if (this.company.phone_3) { this.companyPhoneIcon.type3 = addCompanyPhoneClass(this.company.phone_3_type) }

      if (this.company.phone_4) { this.companyPhoneIcon.type4 = addCompanyPhoneClass(this.company.phone_4_type) }

      if (this.company.phone_5) { this.companyPhoneIcon.type5 = addCompanyPhoneClass(this.company.phone_5_type) }

      return this.companyPhoneIcon
    },

    companyPhone1Formatted () {
      return this.formatPhone(this.company.phone_1)
    },

    companyPhone2Formatted () {
      return this.formatPhone(this.company.phone_2)
    },

    companyPhone3Formatted () {
      return this.formatPhone(this.company.phone_3)
    },

    companyPhone4Formatted () {
      return this.formatPhone(this.company.phone_4)
    },

    companyPhone5Formatted () {
      return this.formatPhone(this.company.phone_5)
    }
  },

  watch: {
    feedback: function () {
      this.companyFeedback = this.feedback
    }
  }
}
</script>
