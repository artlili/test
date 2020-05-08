<template>
  <div class="login">
    <div class="login-card">
      <CardError v-if="error" :message="errorMessage"></CardError>
      <!-- Login -->
      <LoginForm v-if="showLoginForm"
                 @changeState="changeState"
                 @getError="getError"></LoginForm>
      <!-- end Login -->

      <!-- Password recovery -->
      <PasswordRecoveryForm v-if="showPasswordRecoveryForm"
                 @changeState="changeState"
                 @getEmailRecovery="getEmailRecovery"
                 @getError="getError"></PasswordRecoveryForm>
      <!-- end Password recovery -->

      <!-- Password recovery success -->
      <PasswordRecoverySuccess v-if="showSuccessRecovery"
                 @changeState="changeState"
                 :emailRecovery="emailRecovery"
                 ></PasswordRecoverySuccess>
      <!-- end Password recovery success -->

      <!-- Registration -->
      <RegistrationForm v-if="showRegistrationForm"
                 @changeState="changeState"
                 @getError="getError"
                 @getEmailRegistration="getEmailRegistration"
                 ></RegistrationForm>
      <!-- end Registration -->

      <!-- Registration success -->
      <RegistrationSuccess v-if="showSuccessRegistry"
                 @changeState="changeState"
                 :email="email"
                 ></RegistrationSuccess>
      <!-- end Registration Success -->
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm'
import PasswordRecoveryForm from '@/components/auth/PasswordRecoveryForm'
import PasswordRecoverySuccess from '@/components/auth/PasswordRecoverySuccess'
import RegistrationForm from '@/components/auth/RegistrationForm'
import RegistrationSuccess from '@/components/auth/RegistrationSuccess'
import CardError from '@/components/CardError'

export default {
  name: 'login',
  components: {
    LoginForm,
    PasswordRecoveryForm,
    PasswordRecoverySuccess,
    RegistrationForm,
    RegistrationSuccess,
    CardError
  },
  data () {
    return {
      email: '',
      emailRecovery: '',
      error: false,
      state: 'default',
      errorMessage: ''
    }
  },
  created () {
    this.$i18n.locale = document.body.classList.contains('en') ? 'en' : 'ru'
  },
  computed: {
    showLoginForm () {
      return this.state === 'default'
    },
    showRegistrationForm () {
      return this.state === 'registration'
    },
    showPasswordRecoveryForm () {
      return this.state === 'recovery'
    },
    showSuccessRecovery () {
      return this.state === 'success'
    },
    showSuccessRegistry () {
      return this.state === 'successRegistry'
    }
  },
  methods: {
    changeState (state) {
      this.error = false
      this.state = state
    },
    getError (error) {
      this.error = error.state
      this.errorMessage = error.message
    },
    getEmailRecovery (email) {
      this.emailRecovery = email
    },
    getEmailRegistration (email) {
      this.email = email
    }
  }
}
</script>

<style>
html, body {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.login {
  $this: &;
  // width: 350px;
  // margin: 30px auto;

  /deep/ .formGroup {
    margin-bottom: 20px;

    .label-desc {
      float: right;
      font-size: 12px;
      line-height: 16px;
    }

    .addition {
      margin-top: 4px;
      color: #9d9e9e;
      font-size: 11px;
      line-height: 16px;
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
