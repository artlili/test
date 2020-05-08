<template>
  <div class="login-form login-default">
    <form @submit.prevent="createNewUser">
      <div class="login-subtitle">
        {{ $t('REGISTER') }}
      </div>
      <div class="login-form-content">
        <FormGroup for="name" :label="$t('FULL_NAME')" :vertical="true" required="true">
          <FormInput
            v-validate="'required|alpha_spaces'"
            slot="input" name="name"
            v-model="name"
            id="name"
            :hasErrors="errors.has('name')"
            :error="$t('FIELD_ERROR')"
          ></FormInput>
        </FormGroup>
        <FormGroup for="company" :label="$t('COMPANY')" :vertical="true" required="true">
          <FormInput
            v-validate="'required'"
            slot="input"
            name="company"
            v-model="company"
            id="company"
            :hasErrors="errors.has('company')"
            :error="$t('FIELD_ERROR')"
          ></FormInput>
        </FormGroup>
        <FormGroup for="email" :label="$t('EMAIL')" :vertical="true" required="true">
          <div slot="label-desc" class="label-desc">{{ $t('EMAIL_NOTE') }}</div>
          <FormInput
            v-validate="'required|email'"
            slot="input"
            type="email"
            name="email"
            v-model="email"
            id="email"
            :hasErrors="errors.has('email')"
            :error="$t('FIELD_ERROR')"
          ></FormInput>
        </FormGroup>
        <FormGroup for="pwd" :label="$t('PASS')" :vertical="true" required="true">
          <FormPassword
            v-validate="'required|min:6'"
            slot="input"
            name="pwd"
            id="pwd"
            v-model="pwd"
            :hasErrors="errors.has('pwd')"
            :error="$t('PASS_ERROR')"
          ></FormPassword>
        </FormGroup>
        <FormGroup v-if="isAdvertisingAgency" for="site" :label="$t('AGENCY_SITE')" :vertical="true">
          <FormInput
            slot="input"
            name="site"
            v-model="site"
            id="site"
            v-validate="{url: {require_protocol: false }}"
            :hasErrors="errors.has('site')"
            :error="$t('FIELD_ERROR')"
            placeholder="site.com"
          ></FormInput>
        </FormGroup>
        <FormCheckbox id="accessPersonal" v-model="accessPersonal" val="accessPersonal" name="accessPersonal">
          <div slot="label">{{ $t('CHECK_TERMS') }}
            <FormLink href="https://adjutant.ru/consent" class="login-links" target="_blank">{{ $t('CHECK_TERMS_LINK') }}</FormLink>
          </div>
        </FormCheckbox>

        <div class="login-buttonLogin">
          <FormButton btn-type="submit" type="solid" :disabled="regButtonIsDisabled">
            {{ $t('REGISTER_BTN') }}
          </FormButton>
        </div>
        <div class="login-links login-links-bottom">
          <FormLink v-if="!isAdvertisingAgency" @click="showAdvertisingAgency">{{ $t('AGENCY_LINK') }}</FormLink>
          <FormLink v-if="isAdvertisingAgency" @click="showAdvertisingAgency">{{ $t('NOT_AGENCY_LINK') }}</FormLink>
          <FormLink href="/dillernew.html" target="_blank">{{ $t('DILLER_LINK') }}</FormLink>
          <FormLink @click="$emit('changeState', 'default')">{{ $t('AUTH_LINK') }}</FormLink>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import FormGroup from '@/components/FormGroup'
import FormInput from '@/components/FormInput'
import FormPassword from '@/components/FormPassword'
import FormCheckbox from '@/components/FormCheckbox'
import FormButton from '@/components/FormButton'
import FormLink from '@/components/FormLink'
import { AuthService } from '@/services/AuthService'
export default {
  name: 'registrationForm',
  components: {
    FormGroup,
    FormInput,
    FormPassword,
    FormCheckbox,
    FormButton,
    FormLink
  },
  props: ['changeState', 'getError', 'getEmailRegistration'],
  data () {
    return {
      isSuccessRegistry: false,
      isAdvertisingAgency: false,
      name: '',
      company: '',
      email: '',
      pwd: '',
      site: '',
      accessPersonal: false,
      error: {}
    }
  },
  computed: {
    fieldsValid () {
      return Object.entries(this.fields).every(([key, val]) => val.valid)
    },
    regButtonIsDisabled () {
      return !this.fieldsValid || !this.accessPersonal
    }
  },
  methods: {
    showAdvertisingAgency () {
      this.site = ''
      this.isAdvertisingAgency = !this.isAdvertisingAgency
    },
    createNewUser () {
      const params = {
        'name': this.name,
        'company': this.company,
        'email': this.email,
        'pwd': this.pwd,
        'site': this.site
      }
      return AuthService.createNewUser(params)
        .then((res) => {
          if (res.result) {
            this.error = {}
            this.$emit('getEmailRegistration', this.email)
            this.$emit('changeState', 'successRegistry')
          } else {
            this.error = {
              message: this.$t('CARD_EMAIL_ERROR'),
              state: true
            }
            this.$emit('getError', this.error)
          }
        })
        .catch(e => {
          console.error('error creating new user', e)
          this.error = {
            message: e,
            state: true
          }
          this.$emit('getError', this.error)
        })
        .finally(() => {
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  $this: &;

  &-subtitle {
    margin-bottom: 20px;
    font-family: $fontHeading;
    font-size: 32px;
  }

  &-form {
    width: 100%;
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
