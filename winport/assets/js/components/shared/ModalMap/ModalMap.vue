<style src="./ModalMap.scss" lang="scss"></style>
<script>
const {yandexMap, ymapMarker} = require('vue-yandex-maps')
export default {
  name: 'ModalMap',

  template: require('./ModalMap.html'),
  props: ['ymapCoords', 'openMap', 'closeMap'],
  components: {
    yandexMap,
    ymapMarker
  },
  data () {
    return {
      ymapPlacemarks: [],
      ymapZoom: 16
    }
  }

}

</script>
