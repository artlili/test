<template>
  <UserPageLayout>
    <div slot="content" class="userProfile">
      <h1>{{ $t('USER_PROFILE') }}</h1>
      <div class="userProfile-grid">
        <div class="userProfile-main">
          <div class="userProfile-section">
          <div class="userProfile-field">
              <FormGroup :label="$t('FULL_NAME')" for="name" required="true">
                <FormInput slot="input"
                           id="name"
                           name="name"
                           v-model="user.name"
                           v-validate="'required|alpha_spaces|min:3'"
                           :hasErrors="errors.has('name')"
                           :error="$t('FIELD_ERROR')"
                           ></FormInput>
              </FormGroup>
            </div>
            <div class="userProfile-field">
              <FormGroup :label="$t('COMPANY')" for="company" required="true">
                <FormInput slot="input"
                           id="company"
                           name="company"
                           v-model="user.company"
                           v-validate="'required|min:3'"
                           :hasErrors="errors.has('company')"
                           :error="$t('REQUIRED_ERROR')"
                           ></FormInput>
              </FormGroup>
            </div>
            <div class="userProfile-field">
              <FormGroup :label="$t('EMAIL')" for="email_old" required="true">
                <FormInput  slot="input"
                            id="email_old"
                            name="email_old"
                            v-model="user.email"
                            disabled="disabled"
                            ></FormInput>
              </FormGroup>
              <div class="userProfile-field_change-field">
                <span @click="changeEmail">{{ $t('CHANGE_EMAIL') }}</span>
              </div>
            </div>
            <div class="userProfile-field">
              <FormGroup :label="$t('PASS')" for="password" required="true">
                <FormInput :type="passwordType"
                           slot="input"
                           id="password"
                           name="password"
                           v-model="password"
                           :disabled="!passwordChanged"
                           v-validate="{ required: true, min: 6 }"
                           :hasErrors="errors.has('password')"
                           :error="$t('PASS_ERROR')"
                           ></FormInput>
              </FormGroup>
              <div class="userProfile-field_change-field">
                <span v-if="!passwordChanged" @click="changePassword">{{ $t('CHANGE_PASS') }}</span>
                <span v-else @click="cancelPassword">{{ $t('CANCEL') }}</span>
              </div>
            </div>
            <div class="userProfile-field" v-show="passwordChanged">
              <FormGroup :label="$t('REPEAT_PASS')" for="password_repeat" required="true">
                <FormInput :type="passwordType"
                           slot="input"
                           id="password_repeat"
                           name="password_repeat"
                           v-model="password_repeat"
                           v-validate="{ is: password }"
                           :hasErrors="errors.has('password_repeat')"
                           :error="$t('DIFF_PASS_ERROR')"
                           ></FormInput>
              </FormGroup>
            </div>
            <div class="userProfile-field">
              <FormGroup :label="$t('MOB_PHONE')" for="phone">
                <FormPhone slot="input"
                            id="v-phone"
                            name="phone"
                            v-model="user.phone"
                            :hasErrors="errors.has('phone')"
                            :error="$t('FIELD_ERROR')"
                            mask="\+\7 (111) 1111-11"
                            placeholder="+7(___)____-__"
                            :value="user.phone"
                            v-validate="{ regex: /^[^_]+$/ }"
                            ></FormPhone>
              </FormGroup>
            </div>
            <div class="userProfile-field">
              <FormGroup :label="$t('COMPANY_SITE')" for="site">
                <FormInput slot="input"
                           id="site"
                           name="site"
                           v-model="user.site"
                           v-validate="{url: {require_protocol: false }}"
                           :hasErrors="errors.has('site')"
                           :error="$t('FIELD_ERROR')"
                           placeholder="site.com"
                           ></FormInput>
              </FormGroup>
            </div>
            <div class="userProfile-field">
              <FormGroup>
                <div slot="label">&nbsp;</div>
                <div class="userProfile-saveButton" slot="input">
                  <FormButton :disabled="saveButtonDisabled" type="solid" @click="saveData">
                    {{ $t('SAVE') }}
                  </FormButton>
                  <transition name="fade">
                    <div class="userProfile-saveButton-successText" v-if="showSaveSuccessMessage">
                      {{ $t('CHANGES_SAVED') }}
                      {{ new Date().toLocaleDateString($i18n.locale, { hour: 'numeric', minute: 'numeric'}) }}
                    </div>
                  </transition>
                </div>
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
      <!-- Change Email Form -->
      <ChangeEmailForm
            v-if="showModal"
            :active="showModal"
            :user="user"
            @modalClosed="showModal = false">
      </ChangeEmailForm>
      <!-- end Change Email Form -->
    </div>
  </UserPageLayout>
</template>

<script>
import FormGroup from '@/components/FormGroup'
import FormInput from '@/components/FormInput'
import FormPhone from '@/components/FormPhone'
import FormButton from '@/components/FormButton'
import FormLink from '@/components/FormLink'
import Preloader from '@/components/Preloader'
import ChangeEmailForm from '@/components/auth/ChangeEmailForm'

import maskedInput from 'vue-masked-input'
import { UserProfileService } from '@/services/UserProfileService'
import { isProduction } from '@/constants'

export default {
  name: 'UserProfile',
  components: {
    FormGroup,
    FormInput,
    FormPhone,
    FormButton,
    FormLink,
    Preloader,
    maskedInput,
    ChangeEmailForm
  },
  data () {
    return {
      isFetchingData: false,
      showModal: false,
      users: {},
      user: {},
      password_repeat: '123456',
      password: '123456',
      isSavingUserData: false,
      showSaveSuccessMessage: false,
      passwordType: 'password',
      passwordChanged: false
    }
  },
  computed: {
    fieldsValid () {
      return Object.entries(this.fields).every(([key, val]) => val.valid)
    },
    fieldsChanged () {
      return Object.entries(this.fields).some(([key, val]) => val.changed)
    },
    saveButtonDisabled () {
      return !(this.fieldsValid && this.fieldsChanged && this.password_repeat)
    }
  },
  methods: {
    getLoggedUser () {
      this.isFetchingData = true
      const params = {
        token: localStorage.getItem('token')
      }
      return UserProfileService.getLoggedUser(params)
        .then(res => {
          if (res.result) {
            this.user = res.result
          } else {
            window.location = isProduction ? '/' : '/login.html'
          }
        })
        .catch(e => console.error('error getting user', e))
        .finally(() => {
          Object.keys(this.fields).forEach(fieldName => this.$validator.flag(fieldName, {
            valid: true,
            changed: false
          }))

          this.isFetchingData = false
        })
    },
    saveData () {
      this.passwordChanged = false
      this.showSaveSuccessMessage = true
      const params = {
        id: this.user.id,
        email: this.user.email,
        name: this.user.name,
        phone: this.user.phone,
        company: this.user.company,
        site: this.user.site
      }
      if (this.password_repeat) {
        params.new_password = this.password_repeat
        params.new_password_repeat = this.password_repeat
      } else {
        params.pwd = this.user.password
      }
      return UserProfileService.saveUserData(params)
        .then((res) => {
          this.getLoggedUser()
        })
        .catch(e => console.error('error saving user data', e))
        .finally(() => {
          this.isSavingUserData = false
          setTimeout(() => {
            this.showSaveSuccessMessage = false
          }, 2000)
        })
    },
    changePassword () {
      this.passwordChanged = true
      this.password_repeat = ''
    },
    cancelPassword () {
      this.passwordChanged = false
      this.password_repeat = '123456'
    },
    changeEmail () {
      this.showModal = true
    }
  },
  created () {
    this.$i18n.locale = document.body.classList.contains('en') ? 'en' : 'ru'
    this.getLoggedUser()
  }
}
</script>

<style lang="scss">
.userProfile {
  #password {
    padding-right: 34px;
  }

  &-layout {
    @media all and (min-width: 1530px) {
      .pageLayout-main-content {
        max-width: 1061px !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.userProfile {
  $this: &;
  &-grid {
    @include createGrid(30px);
    justify-content: space-between;
  }
  &-main {
    flex: 1 1 auto;
    max-width: 568px;
  }

  &-field {
    margin-bottom: 18px;
    position: relative;

    /deep/ .formGroup-label {
      min-width: 150px;
      max-width: 150px;
    }

    &_change-field {
      position: absolute;
      top: 9px;
      right: -210px;
      font-size: 14px;
      font-family: "Rubik";
      color: $colorBrand;
      text-decoration: underline;
      cursor: pointer;
      width: 200px;
    }
  }

  &-section {
    margin-bottom: 45px;
    /deep/ #{$this}-link {
      font-size: 14px;
    }
    &-grid {
      display: flex;
      &-left {
        flex: 0 0 auto;
        width: 70%
      }
    }
  }

  &-saveButton {
    display: flex;
    align-items: center;

    /deep/ .button {
      max-width: 142px;
    }

    &-successText {
      padding-left: 15px;
      font-size: 14px;
      line-height: 1.4;
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    &-grid {
      @include nullifyGrid;
      flex-direction: column;
    }
    &-main {
      width: 100%;
      max-width: none;
    }
    &-field {
      &_change-field {
        top: 0;
        right: 0;
        width: auto;
      }
    }
  }
}

.input {
  position: relative;
  &-field {
    box-sizing: border-box;
    width: 100%;
    padding: 7px 10px;
    border: 1px solid #9d9e9e;
    border-radius: 1px;
    line-height: 1;
    font-family: $fontMain;
    font-size: 14px;
    box-shadow: inset 0 1px 3px 0 rgba(#000, 0.3);
    color: $colorTextMain;
    opacity: 1;
    transition: opacity $time;

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
