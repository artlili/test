<style src="./Fns.scss" lang="scss"></style>

<script>
import {mapGetters, mapState, mapMutations} from 'vuex'

export default {
  name: 'Fns',

  template: require('./Fns.html'),

  components: {
  },

  props: ['country', 'number'],

  data () {
    return {
      fnsInfo: {},
      status: 'ok',
      errorMessage: ''
    }
  },

  methods: {
    ...mapMutations(['setOpenFns'])
  },

  computed: {
    openFns () {
      return this.$store.getters.getOpenFns
    }
  },

  watch: {
    openFns: function () {
      if (this.openFns) {
        this.$store.dispatch('getDeskCompanyFns', {country: this.country.label, nalogNumber: this.number}).then(() => {
          this.status = this.$store.getters.getFnsStatus
          this.errorMessage = this.$store.getters.getFnsErrorMessage
          this.fnsInfo = this.$store.getters.getFnsInfo
          this.$emit('fnsResult', this.fnsInfo)
        })
      }
    }
  }
}
</script>
