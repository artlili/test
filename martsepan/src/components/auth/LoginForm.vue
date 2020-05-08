<template>
  <div class="login-form login-default">
    <form @submit.prevent="authenticate">
      <div class="login-subtitle">
        {{ $t('AUTH') }}
      </div>
      <div class="login-form-content">
        <FormGroup for="login" :label="$t('LOGIN')" :vertical="true">
          <FormInput slot="input" name="login" v-model="login" id="login" @input="hasError"></FormInput>
        </FormGroup>
        <FormGroup for="password" :label="$t('PASS')" :vertical="true">
          <FormPassword slot="input" name="password" id="password" v-model="password"></FormPassword>
        </FormGroup>
        <div class="login-links">
          <FormLink @click="$emit('changeState', 'recovery')">{{ $t('FORGOT_PASS') }}</FormLink>
        </div>
        <div class="login-buttonLogin">
          <FormButton btn-type="submit" type="solid" :is-loading="isLogining" :disabled="loginButtonIsDisabled">
            {{ $t('LOGIN_BTN') }}
          </FormButton>
        </div>
        <div class="login-links login-links-bottom text-center">
          <FormLink @click="$emit('changeState', 'registration')">{{ $t('REG_LINK') }}</FormLink>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import FormGroup from '@/components/FormGroup'
import FormInput from '@/components/FormInput'
import FormPassword from '@/components/FormPassword'
import FormButton from '@/components/FormButton'
import FormLink from '@/components/FormLink'
import { AuthService } from '@/services/AuthService'
import { isProduction } from '@/constants'
export default {
  name: 'loginForm',
  components: {
    FormGroup,
    FormInput,
    FormPassword,
    FormButton,
    FormLink
  },
  props: ['changeState', 'getError'],
  data () {
    return {
      login: '',
      password: '',
      isLogining: false,
      error: {}
    }
  },
  computed: {
    loginButtonIsDisabled () {
      return !(this.login && this.password)
    }
  },
  methods: {
    authenticate () {
      if (!this.isLogining) {
        this.isLogining = true
        const params = {
          password: this.password
        }
        this.login.indexOf('@') > 0
          ? params.email = this.login : params.login = this.login
        console.log('params authenticate', params)
        params.login
          ? this.dilerLogin(params)
          : this.userLogin(params)
      }
    },
    userLogin (params) {
      AuthService.loginUser(params)
        .then(res => {
          if (res.result) {
            this.error = {}
            localStorage.setItem('token', res.result.token)
            if (isProduction) {
              // window.location = `/user_profile`
              window.location.reload(true)
            } else {
              window.location = `/news.html`
            }
          } else {
            this.error = {
              message: this.$t('AUTH_ERROR'),
              state: true
            }
            this.$emit('getError', this.error)
          }
        })
        .catch(e => {
          console.error('login error', e)
          this.error = {
            message: e,
            state: true
          }
          this.$emit('getError', this.error)
        })
        .finally(() => {
          this.isLogining = false
        })
    },
    dilerLogin (params) {
      localStorage.removeItem('token')
      AuthService.loginDiler(params)
        .then(res => {
          this.error = {}
          if (isProduction) {
            // window.location = `/${res.redirect}`
            window.location.reload(true)
          } else {
            window.location = `/news.html`
          }
        })
        .catch(e => {
          console.error('login error', e)
          this.error = {
            message: this.$t('AUTH_ERROR'),
            state: true
          }
          this.$emit('getError', this.error)
        })
        .finally(() => {
          this.isLogining = false
        })
    },
    hasError () {
      this.error = {}
      this.$emit('getError', this.error)
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  $this: &;

  /deep/ .formGroup {
    margin-bottom: 20px;
  }

  &-subtitle {
    margin-bottom: 20px;
    font-family: $fontHeading;
    font-size: 32px;
  }

  &-links {
    font-size: 14px;
    margin-bottom: 30px;

    /deep/ .link {
      display: block;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    &-bottom {
      margin-top: 20px;
      margin-bottom: 0;

      &.text-center {
        text-align: center;
      }

      .link {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
