<script>
import DeskPageMenu from '@/components/shared/DeskPageMenu/DeskPageMenu.vue'
import DeskSidebarMenu from '@/components/shared/DeskSidebarMenu/DeskSidebarMenu.vue'
import {mask} from 'vue-the-mask'

export default {
  name: 'DeskVerification',

  template: require('./DeskVerification.html'),

  components: {
    'desk-page-menu': DeskPageMenu,
    'desk-sidebar-menu': DeskSidebarMenu
  },

  directives: {mask},

  data () {
    return {
      addPhone: false,
      checkCode: 0,
      verifiedCode: false,
      phoneInput: false,
      activeBtn: false,
      user: {
        phone: '',
        newPhone: ''
      },
      pageMenu: [
        {'title': 'Учетные данные', 'link': '/desk', 'name': 'desk'},
        {'title': 'Профиль пользователя', 'link': '/desk/profile', 'name': 'desk-profile'},
        {'title': 'E-mail', 'link': '/desk/email', 'name': 'desk-email'},
        {'title': 'Пароль', 'link': '/desk/password', 'name': 'desk-password'},
        {'title': 'SMS верификация', 'link': '/desk/verification', 'name': 'desk-verification'}
      ]
    }
  },

  methods: {
    addUserPhone (el) {
      if (el.path[0].value.length > 16) {
        this.activeBtn = true
        this.user.phone = el.path[0].value
      }
    },
    phoneAdded () {
      this.addPhone = true
    },
    codeVerification (el) {
      if (el.path[0].value !== '1234') {
        this.checkCode = 1
      } else {
        this.checkCode = 2
      }
    },
    codeSuccess () {
      if (this.checkCode === 2) {
        this.verifiedCode = true
      }
    },
    openPhoneInput () {
      this.phoneInput = true
    },
    changedPhone (el) {
      this.user.newPhone = el.path[0].value
    },
    changePhone () {
      this.user.phone = this.user.newPhone
      this.phoneInput = false
    },
    cancelChangePhone () {
      this.phoneInput = false
    }
  }

}
</script>
