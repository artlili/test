<script>
import DeskWidget from '@/components/shared/DeskWidget/DeskWidget.vue'
export default {
  name: 'DeskSetting',

  template: require('./DeskSetting.html'),

  components: {
    'desk-widget': DeskWidget
  },
  data () {
    return {
      checkedCompanies: true,
      checkedAds: true,
      checkedMessages: true,
      checkedNotes: true
    }
  }
}
</script>
