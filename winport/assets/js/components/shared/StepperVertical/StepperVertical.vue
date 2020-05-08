<style src="./StepperVertical.scss" lang="scss" scoped></style>
<script>
export default {
  name: 'StepperVertical',

  template: require('./StepperVertical.html'),

  props: ['open'],

  data () {
    return {
      openedStep: this.open
    }
  },
  methods: {
    openStep () {
      this.openedStep = !this.openedStep
    }
  }

}
</script>
