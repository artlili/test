<template>
  <PageLayout class="userSettings-layout">
    <div slot="content" class="userSettings">
      <h1>Настройки пользователей</h1>
      <div class="userSettings-grid">
        <div class="userSettings-main">
          <div class="userSettings-section">
            <div class="userSettings-field">
              <FormGroup label="Логин" id="login">
                <FormInput :disabled="superUser"
                           slot="input"
                           id="login"
                           name="login"
                           v-model="login"
                           @keyup="changeInput"
                           v-validate="'required'"
                           :error="errors.first('login')"
                           :hasErrors="errors.has('login')"></FormInput>
              </FormGroup>
            </div>
            <div class="userSettings-field">
              <div class="userSettings-field_show-password" @click="showPassword">
                <svg xmlns:svg="www.w3.org/2000/svg" viewbox="0 0 200 200" :class="{'_show': passwordType === 'text'}">
                  <path d="M10,3.2C5.5,3.2,1.6,6,0,10c1.6,4,5.5,6.8,10,6.8S18.4,14,20,10C18.4,6,14.5,3.2,10,3.2z M10,14.5c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S12.5,14.5,10,14.5z M10,7.3c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7S11.5,7.3,10,7.3z"/>
                </svg>
              </div>
              <FormGroup label="Пароль" id="password">
                <FormInput :type="passwordType"
                           @keyup="changeInput"
                           :disabled="superUser"
                           slot="input"
                           id="password"
                           name="password"
                           v-model="password"
                           v-validate="'required'"
                           :error="errors.first('password')"
                           :hasErrors="errors.has('password')"
                           ></FormInput>
              </FormGroup>
            </div>
            <div class="userSettings-field">
              <FormGroup label="Имя" id="name">
                <FormInput :disabled="superUser"
                           slot="input"
                           id="name"
                           name="name"
                           v-model="name"
                           v-validate="'required'"></FormInput>
              </FormGroup>
            </div>
            <div class="userSettings-field">
              <FormGroup label="Моб. телефон" id="phone">
                <masked-input class="input-field" mask="\+\7 (111) 1111-11" :disabled="superUser" slot="input" id="v-phone" name="phone" v-model="phone"
                           v-validate @input="rawVal = arguments[1]"></masked-input>
              </FormGroup>
            </div>
            <!-- <div class="userSettings-field">
              <masked-input :disabled="superUser" v-model="phone" mask="\+\1 (111) 1111-11" placeholder="Phone" />
            </div> -->
            <div class="userSettings-field">
              <FormGroup label="E-mail" id="email">
                <FormInput :disabled="superUser" slot="input" id="email" name="email" v-model="email"
                           v-validate></FormInput>
              </FormGroup>
            </div>
          </div>
          <div class="userSettings-section">
            <div class="userSettings-section-grid">
              <div class="userSettings-section-grid-left">
                <div class="userSettings-field _checkboxes">
                  <FormGroup>
                    <div slot="label">
                      Подписка
                    </div>
                    <div slot="input">
                      <FormCheckbox :disabled="superUser" label="Новости" id="news" v-model="subscriptions"
                                    :val="SUBSCRIPTIONS.NEWS"
                                    name="subscriptions_news" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Заказы по e-mail" id="emailOrders"
                                    v-model="subscriptions"
                                    :val="SUBSCRIPTIONS.ORDERS_EMAIL"
                                    name="subscriptions_orders_email" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Заказы по SMS" id="smsOrders" v-model="subscriptions"
                                    :val="SUBSCRIPTIONS.ORDERS_SMS"
                                    name="subscriptions_orders_sms" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Все заказы/личные" id="allOrders"
                                    v-model="subscriptions"
                                    :val="SUBSCRIPTIONS.ALL"
                                    name="subscriptions_all" v-validate></FormCheckbox>
                    </div>
                  </FormGroup>
                </div>
              </div>
              <div class="userSettings-section-grid-right" v-if="isCreatingNewUser">
                <FormLink class="userSettings-link" @click.prevent="toggleAllSubscriptions">
                  {{ isFullSubscriptions ? 'Сбросить' : 'Отметить все' }}
                </FormLink>
              </div>
            </div>
          </div>
          <div class="userSettings-section">
            <div class="userSettings-section-grid">
              <div class="userSettings-section-grid-left">
                <div class="userSettings-field _checkboxes">
                  <FormGroup>
                    <div slot="label">
                      Доступ
                    </div>
                    <div slot="input">
                      <FormCheckbox :disabled="superUser" label="Склад" id="viewWarehouse" v-model="access"
                                    :val="PRIVILEGES.WAREHOUSE"
                                    name="viewWarehouse" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Файловый архив" id="files" v-model="access"
                                    :val="PRIVILEGES.FILES"
                                    name="files" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Ввод запросов" id="addRequests" v-model="access"
                                    :val="PRIVILEGES.REQUESTS_CREATION"
                                    name="addRequests" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Бронирование" id="booking" v-model="access"
                                    :val="PRIVILEGES.BOOKING"
                                    name="booking" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Просмотр заказов" id="viewOrders" v-model="access"
                                    :val="PRIVILEGES.ORDERS_VIEW"
                                    name="viewOrders" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Подпись БПЗ" id="bpz" v-model="access"
                                    :val="PRIVILEGES.BPZ_APPROVAL"
                                    name="bpz" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Раздел новостей" id="viewNews" v-model="access"
                                    :val="PRIVILEGES.NEWS"
                                    name="viewNews" v-validate></FormCheckbox>
                      <FormCheckbox :disabled="superUser" label="Связь с менеджером" id="managerContact"
                                    v-model="access"
                                    :val="PRIVILEGES.CONTACT"
                                    name="managerContact" v-validate></FormCheckbox>
                    </div>
                  </FormGroup>
                </div>
              </div>
              <div class="userSettings-section-grid-right" v-if="isCreatingNewUser">
                <FormLink class="userSettings-link" @click.prevent="toggleAllPrivileges">
                  {{ isFullPrivileges ? 'Сбросить' : 'Отметить все' }}
                </FormLink>
              </div>
            </div>
            <div class="userSettings-field">
              <FormGroup>
                <div slot="label">&nbsp;</div>
                <div class="userSettings-saveButton" slot="input">
                  <FormButton :disabled="saveButtonDisabled" type="solid" @click="saveData">
                    {{ isCreatingNewUser ? 'Добавить' : 'Сохранить' }}
                  </FormButton>
                  <transition name="fade">
                    <div class="userSettings-saveButton-successText" v-if="showSaveSuccessMessage">
                      Изменения сохранены
                      {{ new Date().toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric'}) }}
                    </div>
                  </transition>
                </div>
              </FormGroup>
            </div>
          </div>
        </div>
        <div class="userSettings-right">
          <UsersList :users="users" :activeUser="activeUser" :newUser="newUser" @userChanged="onUserChanged($event)"
                     @userRemoved="onUserRemoved($event)"></UsersList>
          <Preloader v-if="isFetchingUsers"></Preloader>
        </div>
      </div>
      <WidgetManager></WidgetManager>
    </div>
  </PageLayout>
</template>

<script>
import FormGroup from '@/components/FormGroup'
import FormInput from '@/components/FormInput'
import FormButton from '@/components/FormButton'
import FormLink from '@/components/FormLink'
import FormCheckbox from '@/components/FormCheckbox'
import UsersList from '@/components/UsersList'
import Preloader from '@/components/Preloader'
import { getCookie } from '@/helpers'

import {
  COOKIES_NAMES,
  PRIVILEGES,
  SUBSCRIPTIONS,
  FULL_USER_PRIVILEGES_LIST,
  FULL_USER_SUBSCRIPTIONS_LIST
} from '@/constants'
import { AuthService } from '@/services/AuthService'
import { UserService } from '@/services/UserService'
import { privilegesMixin } from '@/mixins'
import maskedInput from 'vue-masked-input'

export default {
  name: 'userSettings',
  mixins: [privilegesMixin],
  components: {
    FormGroup,
    FormInput,
    FormCheckbox,
    UsersList,
    FormButton,
    FormLink,
    Preloader,
    maskedInput
  },
  data () {
    return {
      PRIVILEGES,
      SUBSCRIPTIONS,
      id: '',
      login: '',
      password: '',
      name: '',
      phone: '',
      email: '',
      subscriptions: [],
      access: [],
      users: [],
      superUser: false,
      activeUser: 0,
      newUser: '',
      isFetchingUsers: false,
      isSavingUserData: false,
      showSaveSuccessMessage: false,
      passwordType: 'password'
    }
  },
  computed: {
    isCreatingNewUser () {
      return this.activeUser === 'new'
    },
    isFullSubscriptions () {
      let set = new Set(this.subscriptions)
      return FULL_USER_SUBSCRIPTIONS_LIST.every(v => set.has(v))
    },

    isFullPrivileges () {
      let set = new Set(this.access)
      return FULL_USER_PRIVILEGES_LIST.every(v => set.has(v))
    },
    saveButtonDisabled () {
      if (this.superUser) {
        return !this.fieldsChanged
      }
      if (this.isCreatingNewUser) {
        return !(this.fieldsChanged && this.fieldsValid)
      }
      if (this.login === '' || this.password === '' || this.name === '') {
        return !(this.fieldsChanged && this.fieldsValid)
      }
      return !this.fieldsChanged
    },
    fieldsValid () {
      return Object.entries(this.fields).every(([key, val]) => val.valid)
    },
    fieldsChanged () {
      return Object.entries(this.fields).some(([key, val]) => val.dirty)
    }
  },
  methods: {
    onUserChanged (userId) {
      this.activeUser = userId
      this.showSaveSuccessMessage = false
      Object.keys(this.fields).forEach(fieldName => this.$validator.flag(fieldName, {
        dirty: false,
        pristine: true
      }))
      if (!this.isCreatingNewUser) {
        const user = this.users.find(u => u.id === userId)
        this.superUser = user.superUser === true || user.superUser === 'true'
        this.id = user.id
        this.login = user.login
        this.password = user.password
        this.name = user.name
        this.phone = user.phone
        this.email = user.email
        this.access = user.privileges || []
        this.subscriptions = user.subscriptions || []
        // Валидируем обязательные поля чтобы убрать/не убрать сообщения об ошибках
        this.$validator.validate('login')
        this.$validator.validate('password')
        this.$validator.validate('name')
      } else {
        this.id = ''
        this.login = ''
        this.password = ''
        this.name = ''
        this.phone = ''
        this.email = ''
        this.superUser = false
        this.subscriptions = []
        this.access = []
        this.$validator.flag('login', {
          validated: false,
          valid: false,
          invalid: false
        })
        this.$validator.flag('password', {
          validated: false,
          valid: false,
          invalid: false
        })
        this.$validator.flag('name', {
          validated: false,
          valid: false,
          invalid: false
        })
      }
    },
    combineUserData () {
      return {
        login: this.login,
        password: this.password,
        name: this.name,
        phone: this.phone,
        email: this.email,
        subscriptions: this.subscriptions,
        access: this.access,
        id: this.activeUser
      }
    },
    getUsersList () {
      this.isFetchingUsers = true
      return UserService.getOrganizationUsers()
        .then((res) => {
          this.users = res
          let newUser = this.newUser
          if (newUser) {
            let activeUser = this.$_.filter(this.users, function (user) {
              return user.login === newUser
            })
            this.activeUser = activeUser[0].id
            this.newUser = ''
          }
        })
        .catch(e => console.error('error getting users', e))
        .finally(() => {
          this.isFetchingUsers = false
        })
    },
    saveUserData () {
      this.$validator.validateAll()
        .then(res => {
          if (res) {
            if (!this.isSavingUserData) {
              this.isSavingUserData = true
              const params = this.combineUserData()
              return UserService.saveUserData(params)
                .then(() => {
                  this.getUsersList()
                  this.blinkSavingSuccessText()
                })
                .catch(e => console.error('error saving user data', e))
                .finally(() => {
                  this.isSavingUserData = false
                  Object.keys(this.fields).forEach(fieldName => this.$validator.flag(fieldName, {
                    dirty: false,
                    pristine: true
                  }))
                })
            }
          }
        })
    },
    createNewDiler () {
      // TODO: вывести состояния в vuex
      if (!this.isSavingUserData) {
        this.isSavingUserData = true
        const params = this.combineUserData()
        params.org_id = getCookie(COOKIES_NAMES.ORG_ID)
        return AuthService.createNewDiler(params)
          .then(() => {
            this.blinkSavingSuccessText()
            this.getUsersList()
            this.newUser = params.login
            console.log('this.$validator::: ', this.$validator)
            console.log('this.fields', this.fields)
            Object.keys(this.fields).forEach(fieldName => this.$validator.flag(fieldName, {
              dirty: false,
              pristine: true
            }))
            this.$validator.flag('login', {
              validated: false,
              valid: false,
              invalid: false
            })
            this.$validator.flag('password', {
              validated: false,
              valid: false,
              invalid: false
            })
            this.$validator.flag('name', {
              validated: false,
              valid: false,
              invalid: false
            })
          })
          .catch(e => console.error('error creating new user', e))
          .finally(() => {
            this.isSavingUserData = false
          })
      }
    },
    saveData () {
      if (this.isCreatingNewUser) {
        this.$validator.validateAll().then((res) => {
          if (res) {
            this.createNewDiler()
          }
        })
      } else {
        this.saveUserData()
      }
    },
    onUserRemoved (userId) {
      this.$confirm()
        .then(() => {
          UserService.removeUser(userId)
            .then(() => {
              this.getUsersList()
              this.activeUser = this.users[0].id
              this.onUserChanged(this.activeUser)
            })
          console.log(userId)
        })
        .catch(e => {
        })
    },
    toggleAllPrivileges () {
      if (this.isFullPrivileges) {
        this.access = []
      } else {
        this.access = FULL_USER_PRIVILEGES_LIST
      }
    },
    toggleAllSubscriptions () {
      if (this.isFullSubscriptions) {
        this.subscriptions = []
      } else {
        this.subscriptions = FULL_USER_SUBSCRIPTIONS_LIST
      }
    },
    blinkSavingSuccessText () {
      this.showSaveSuccessMessage = true
      setTimeout(() => {
        this.showSaveSuccessMessage = false
      }, 5000)
    },
    showPassword () {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text'
    },
    changeInput (elem) {
      if (elem.target.value < 1) {
        Object.keys(this.fields).forEach(fieldName => this.$validator.flag(fieldName, {
          dirty: false,
          pristine: true
        }))
      }
    }
  },
  created () {
    this.getUsersList()
      .then(() => {
        if (this.users && this.users instanceof Array) this.onUserChanged(this.users[0].id)
      })
  }
}
</script>

<style lang="scss">
.userSettings {
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
.userSettings {
  $this: &;
  &-grid {
    @include createGrid(30px);
    justify-content: space-between;
  }
  &-main {
    flex: 1 1 auto;
    /*width: 55.55%;*/
    max-width: 468px;
  }
  &-right {
    flex: 0 1 auto;
    width: 33.33%;
  }

  &-field {
    margin-bottom: 18px;
    position: relative;

    &._checkboxes {
      margin-bottom: 28px;
      /deep/ .formGroup {
        align-items: baseline;
        &-label {
          font-weight: 500;
        }
      }
      /deep/ .formCheckbox {
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }

    &_show-password {
      position: absolute;
      top: 7px;
      right: 21px;
      z-index: 1;
      width: 20px;
      height: 18px;
      overflow: hidden;
      cursor: pointer;

      svg {
        fill: lighten($colorGrayMedium, 15%);
        &._show {
          fill: $colorBrand;
        }
      }
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
      &-right {
        flex: 1 1 auto;
      }
    }
  }

  &-saveButton {
    /*max-width: 142px;*/
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

  @media all and (max-width: getBreakpointVal(xl)) {
    &-main {
      /*width: 66.66%;*/
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
      &-right {
        order: -1;
        width: 100%;
        margin-bottom: 30px;
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
