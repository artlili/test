<!--<template src="./Product.html"></template>-->

<script>
import ConfigService from '@/services/ConfigService'
import MetaTagsService from '@/services/MetaTagsService'
import Banner from '@/components/shared/Banner/Banner.vue'
import {mapState, mapActions, mapGetters} from 'vuex'
import VueGallery from 'vue-gallery'
import Gallery from '@/components/shared/Gallery/Gallery.vue'
import CompanyContact from '@/components/shared/CompanyContact/CompanyContact.vue'
import {mapMutations} from 'vuex'
import {VideoMixin} from '@/mixins/VideoMixin'

export default {
  name: 'Product',

  template: require('./Product.html'),

  mixins: [VideoMixin],

  components: {
    banner: Banner,
    'gallery': VueGallery,
    'small-gallery': Gallery,
    'company-contact': CompanyContact
  },

  data () {
    return {
      alias: this.$route.params.productAlias,

      product: {
        item: {
          alias: '',
          name: '',
          news: [],
          sections: {},
          productFollowers: {},
          images: {},
          prices: {}
        }
      },

      productImages: [],
      productImagesUrls: [],
      noImageUrls: ConfigService.getSetting('noImageUrl'),
      imageIndex: null,
      companyContactsId: '',
      companyContactsPrompt: '',
      companyFeedback: false,
      currentPointerImage: 1,
      virtualPosition: 1,
      prevCurrentPointerImage: 0,
      maxImages: 5,

      selectedCompanyTab: 'phones'
    }
  },

  created () {
    this.fetchData()
  },

  computed: {
    nodes () {
      return this.product.item.text.split(/(##gallery-\d+##)/i)
    },

    selectedCompany () {
      if ($.isNumeric(this.companyContactsId)) {
        return this.product.item.prices[this.companyContactsId].company
      }

      return {}
    }
  },

  methods: {
    ...mapMutations(['setOpenCompanyContact']),

    openCompanyContact (index) {
      this.companyContactsId = index
      this.selectedCompanyTab = 'phones'
      this.setOpenCompanyContact(true)
    },

    click () {
      const currentUrl = this.productImages[this.currentPointerImage].url_original
      for (let i in this.productImagesUrls) {
        if (this.productImagesUrls[i] === currentUrl) {
          this.imageIndex = parseInt(i)
          return
        }
      }
    },
    mouseOver (i) {
      this.prevCurrentPointerImage = this.currentPointerImage
      this.currentPointerImage = i
      this.virtualPosition = i
    },
    mouseLeave () {
      this.currentPointerImage = this.prevCurrentPointerImage
      this.virtualPosition = this.prevCurrentPointerImage
    },
    nextImage () {
      this.virtualPosition++
      let currentPointerBefore = this.currentPointerImage
      if (this.currentPointerImage < this.maxImages) {
        this.currentPointerImage++
      }
      let currentPointerAfter = this.currentPointerImage
      if (currentPointerBefore === currentPointerAfter) {
        const el = this.productImages[1]
        this.productImages.splice(1, 1)
        this.productImages.push(el)
      }
    },
    prevImage () {
      this.virtualPosition--
      let currentPointerBefore = this.currentPointerImage
      if (this.currentPointerImage > 1) {
        this.currentPointerImage--
      }
      let currentPointerAfter = this.currentPointerImage
      if (currentPointerBefore === currentPointerAfter) {
        const last = JSON.parse(JSON.stringify(this.productImages[this.productImages.length - 2]))
        last.id = parseInt(Math.random() * 10000)
        this.productImages.splice(this.productImages.length - 1, 1)
        this.productImages.unshift(last)
      }
    },
    fetchData () {
      this.$store
        .dispatch('getProduct', [this.$route.params.productAlias])
        .then(() => {
          this.productImages = []
          this.productImagesUrls = []
          this.product = this.$store.getters.getProduct

          if (this.product.item.images.length) {
            for (let i in this.product.item.images) {
              this.productImages.push({
                id: this.product.item.images[i].id,
                url: this.product.item.images[i].url,
                url_original: this.product.item.images[i].url_original
              })
              this.productImagesUrls.push(this.product.item.images[i].url_original)
            }

            if (this.productImages.length > this.maxImages) {
              let last = JSON.parse(JSON.stringify(this.productImages[this.productImages.length - 1]))
              last.id += parseInt(Math.random() * 10000)
              this.productImages = [last].concat(this.productImages)
            } else {
              this.virtualPosition = 0
              this.currentPointerImage = 0
            }
          }

          this
            .$nextTick()
            .then(this.initYoutubeWrapper)
        })
    }
  },

  watch: {
    '$route.params.productAlias': function (newRoute, oldRoute) {
      this.fetchData()
    },

    'product.item': function () {
      MetaTagsService.setTags(
        this.product.item.title ? this.product.item.title : this.product.item.name,
        this.product.item.keywords,
        this.product.item.description
      )
    }
  }
}
</script>
