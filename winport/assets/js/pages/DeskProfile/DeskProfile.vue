<script>
import DeskPageMenu from '@/components/shared/DeskPageMenu/DeskPageMenu.vue'
import DeskSidebarMenu from '@/components/shared/DeskSidebarMenu/DeskSidebarMenu.vue'
import {VueSelectMixin} from '@/mixins/VueSelectMixin'
import VueCropper from 'vue-cropperjs'

export default {
  name: 'DeskProfile',

  template: require('./DeskProfile.html'),

  mixins: [VueSelectMixin],

  data () {
    return {
      imgSrc: '',
      cropImg: '',
      hideUploadBtn: 1,
      cropHeight: false,
      pageMenu: [
        {'title': 'Учетные данные', 'link': '/desk', 'name': 'desk'},
        {'title': 'Профиль пользователя', 'link': '/desk/profile', 'name': 'desk-profile'},
        {'title': 'E-mail', 'link': '/desk/email', 'name': 'desk-email'},
        {'title': 'Пароль', 'link': '/desk/password', 'name': 'desk-password'},
        {'title': 'SMS верификация', 'link': '/desk/verification', 'name': 'desk-verification'}

      ]
    }
  },

  components: {
    'desk-page-menu': DeskPageMenu,
    'desk-sidebar-menu': DeskSidebarMenu,
    VueCropper
  },

  methods: {

    setImage (e) {
      const file = e.target.files[0]
      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imgSrc = event.target.result
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result)
          this.hideUploadBtn = 2
          this.cropHeight = true
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    cropImage () {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      this.hideUploadBtn = 3
      this.cropHeight = false
    },
    rotateImage () {
      // guess what this does :)
      this.$refs.cropper.rotate(90)
    },
    deleteImage () {
      this.imgSrc = ''
      this.hideUploadBtn = 1
    }
  }
}
</script>
