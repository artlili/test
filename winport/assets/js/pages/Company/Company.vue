<script>
import ConfigService from '@/services/ConfigService'
import MetaTagsService from '@/services/MetaTagsService'
import Banner from '@/components/shared/Banner/Banner.vue'
import VueGallery from 'vue-gallery'
import Pagination from '@/components/shared/Pagination/Pagination.vue'
import Gallery from '@/components/shared/Gallery/Gallery.vue'
import CompanyContact from '@/components/shared/CompanyContact/CompanyContact.vue'
import { mapMutations } from 'vuex'
import SmoothScrollService from '@/services/SmoothScrollService'
import sanitizeOptions from '@/components/shared/TinyMCE/sanitizeOptions'
import { VideoMixin } from '@/mixins/VideoMixin'

import ModalMap from '@/components/shared/ModalMap/ModalMap.vue'

const { yandexMap, ymapMarker } = require('vue-yandex-maps')

export default {
  name: 'Company',

  components: {
    banner: Banner,
    'gallery': VueGallery,
    yandexMap,
    ymapMarker,
    'pagination': Pagination,
    'small-gallery': Gallery,
    'company-contact': CompanyContact,
    'modal-map': ModalMap
  },

  mixins: [VideoMixin],

  data () {
    return {
      currentCompany: '',

      companyContactsId: '',
      companyContactsPrompt: '',

      isShowCompanyFeedback: false,
      currentModalMap: '',

      isNewsLoading: false,
      isAlbumsLoading: false,
      yMapInited: false,

      alias: this.$route.params.companyAlias,

      company: {
        item: {
          alias: '',
          name: '',
          address: '',
          news: [],
          newsPagination: {},
          albumsPagination: {},
          sections: [],
          companyAlbums: [],
          products: [],
          text: '',
          shouldSanitize: false,
          working_time: {
            monday: ''
          },
          additional_info: [],
          introtext: '',
          currentAlbum: []
        },
        sections: [],
        news: []
      },
      balloon: '',
      isOpen: false,
      isTemporary: false,

      imageIndex: null,
      imageNumber: 0,
      companyAlbumImages: [],
      descriptions: [],

      selectedCompanyTab: 'phones',

      noImageUrls: ConfigService.getSetting('noImageUrl'),
      yMap: '',
      ymapPlacemarks: [],
      ymapCenterCoords: [53.531205, 28.030985],
      ymapCoords: [53.531205, 28.030985],
      ymapZoom: 6,

      additionalVisibility: false,
      currentAlbumIndex: 0,
      smallMap: 'smallMap',
      bigMap: 'bigMap'
    }
  },

  computed: {
    companyAboutTab () {
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary
      } else {
        return '/company/' + this.company.item.alias
      }
    },

    companyNewsTab () {
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary + '/' + this.newsPage + '#news'
      } else {
        return '/company/' + this.company.item.alias + '/' + this.newsPage + '#news'
      }
    },

    companyAlbumsTab () {
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary + '/album/' + this.company.item.companyAlbums[0].alias
      } else {
        return '/company/' + this.company.item.alias + '/album/' + this.company.item.companyAlbums[0].alias
      }
    },

    companyMapTab () {
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary + '#map'
      } else {
        return '/company/' + this.company.item.alias + '#map'
      }
    },

    companyProductsTab () {
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary + '#products'
      } else {
        return '/company/' + this.company.item.alias + '#products'
      }
    },

    companyBranchesTab () {
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary + '#branches'
      } else {
        return '/company/' + this.company.item.alias + '#branches'
      }
    },

    albumPaginationPrefix () {
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary + '/album/' + this.albumAlias
      } else {
        return '/company/' + this.companyAlias + '/album/' + this.albumAlias
      }
    },

    newsPagination () {
      return this.company.item.newsPagination
    },

    albumsPagination () {
      return this.company.item.albumsPagination
    },

    companyAlias: function () {
      return this.$route.params.companyAlias
    },

    albumAlias: function () {
      return this.$route.params.albumAlias
    },

    newsPage: function () {
      return (typeof this.$route.params.newsPage !== 'undefined') ? this.$route.params.newsPage : 1
    },

    albumPage: function () {
      return (typeof this.$route.params.albumPage !== 'undefined') ? this.$route.params.albumPage : 1
    },

    /* global sanitizeHtml */
    sanitizedText: function () {
      if (this.company.item.shouldSanitize) {
        return sanitizeHtml(this.company.item.text, sanitizeOptions)
      } else {
        return this.company.item.text
      }
    },

    nodes () {
      return this.sanitizedText.split(/(##gallery-\d+##)/i)
    },

    bigGalleryOptions () {
      return {
        onslide: this.onSlideCustom
      }
    },

    isAuthorized () {
      return typeof this.$store.getters.getUserShortInfo.email !== 'undefined'
    }
  },

  watch: {
    '$route.params.companyAlias': function (newRoute, oldRoute) {
      this.fetchData()
    },

    '$route.params.newsPage': function (newRoute, oldRoute) {
      if (typeof newRoute !== 'undefined') {
        this.fetchNews()
      }
    },

    '$route.params.albumAlias': function (newRoute, oldRoute) {
      if (this.isTemporary) {
        this.fetchTemporaryData()
        new SmoothScrollService().scrollToAnchorExact('tab_menu')
      } else {
        if (this.albumAlias) {
          this.fetchAlbums()
        }
      }
    },

    '$route.params.albumPage': function (newRoute, oldRoute) {
      if (this.isTemporary) {
        this.fetchTemporaryData()
        new SmoothScrollService().scrollToAnchorExact('tab_menu')
      } else {
        if (this.albumAlias && this.albumPage) {
          this.fetchAlbums()
        }
      }
    },

    'company.item': function () {
      MetaTagsService.setTags(
        this.company.item.title ? this.company.item.title : this.company.item.name,
        this.company.item.keywords,
        this.company.item.description
      )
    }
  },

  beforeUpdate () {
    if (this.$route.hash === '#branches') {
      this.isMapLoad()
    }

    let validRoutes = [undefined, 'map', 'news', 'albums', 'products']
    if (validRoutes.indexOf(this.$route.params.companySegment) === -1) {
      this.$router.replace('/404')
    }
  },

  created () {
    if (typeof this.$route.params.companyAlias !== 'undefined') {
      this.isTemporary = false
      if (this.$route.params.albumAlias) {
        this.fetchAlbums()
      } else {
        this.fetchData()
      }
    } else {
      this.isTemporary = true
      this.fetchTemporaryData()
    }
    $(document).on('click', '.fancy_img', this.click)
  },

  methods: {
    ...mapMutations(['setOpenCompanyContact', 'setModalAuthName']),

    openContactModelWithTab (companyItem, tabName) {
      this.currentCompany = companyItem
      this.selectedCompanyTab = tabName
      this.setOpenCompanyContact(true)
    },

    openContactModelWithPhoneTab () {
      this.openContactModelWithTab(this.company.item, 'phones')
    },

    openContactModelWithWorkingTimeTab () {
      this.openContactModelWithTab(this.company.item, 'working_time')
    },

    openContactModelWithEmailTab () {
      this.openContactModelWithTab(this.company.item, 'email')
    },

    openContactModalPhonesForBranch (item) {
      item.parent_id = this.company.item.id
      item.type = 'branch'
      this.openContactModelWithTab(item, 'phones')
    },

    openContactModalEmailForBranch (item) {
      item.parent_id = this.company.item.id
      item.type = 'branch'
      this.openContactModelWithTab(item, 'email')
    },

    openContactModalWorkingTimeForBranch (item) {
      item.parent_id = this.company.item.id
      item.type = 'branch'
      this.openContactModelWithTab(item, 'working_time')
    },

    isNextGallery (index) {
      let galleriesAmount = this.company.item.companyAlbums.length

      return (galleriesAmount > 1)
    },

    nextGalleryUrl (index) {
      let galleriesAmount = this.company.item.companyAlbums.length
      let nextIndex
      let possibleNext = parseInt(index) + 1
      if (possibleNext >= galleriesAmount) {
        nextIndex = 0
      } else {
        nextIndex = possibleNext
      }
      if (this.isTemporary) {
        return '/temporary/company/' + this.$route.params.temporary + '/album/' + this.company.item.companyAlbums[nextIndex].alias
      } else {
        return '/company/' + this.company.item.alias + '/album/' + this.company.item.companyAlbums[nextIndex].alias
      }
    },

    isAlbumRoutePath (path) {
      return path.includes('album')
    },

    toggleAdditionalVisibility () {
      this.additionalVisibility = !this.additionalVisibility
    },

    fetchTemporaryData () {
      this.$store.dispatch('getTemporaryCompany', [this.$route.params.temporary, this.albumAlias, this.$route.params.albumPage]).then(() => {
        this.initCompanyData()
      })
    },

    initCompanyData: function () {
      this.company = this.$store.getters.getCompany

      let images = []
      let albums = this.company.item.companyAlbums

      if (albums.length > 0) {
        for (let i in albums) {
          if (albums[i].images.length > 0) {
            for (let j in albums[i].images) {
              images.push(albums[i].images[j].urlOriginal)
              this.descriptions.push(albums[i].images[j].name)
            }
          }
        }
      }

      for (let i in this.company.item.companyAlbums) {
        if (this.company.item.companyAlbums[i].alias === this.albumAlias) {
          this.currentAlbumIndex = i
          break
        }
      }

      this.companyAlbumImages = images
      this.initYandexMap()
      this.isMapLoad()

      this
        .$nextTick()
        .then(this.initYoutubeWrapper)
    },

    fetchData () {
      this.$store
        .dispatch('getCompany', [this.$route.params.companyAlias, this.$route.params.newsPage])
        .then(() => {
          this.initCompanyData()
        })
    },

    fetchNews () {
      this.isNewsLoading = true
      new SmoothScrollService().scrollToAnchor('tab_menu')
      this.$store
        .dispatch('getNews', [this.$route.params.companyAlias, this.$route.params.newsPage])
        .then(() => {
          this.initCompanyData()
          this.isNewsLoading = false
        })
    },

    fetchAlbums () {
      window.isOverride = false
      this.isAlbumsLoading = true
      new SmoothScrollService().scrollToAnchorExact('tab_menu')
      this.$store
        .dispatch('getAlbums', [this.companyAlias, this.albumAlias, this.$route.params.albumPage])
        .then(() => {
          this.initCompanyData()
          this.isAlbumsLoading = false
        })
    },

    openSelect () {
      if (this.isOpen === false) {
        this.isOpen = true
      } else {
        this.isOpen = false
      }
    },

    initSmallMap (map) {
      setTimeout(function () {
        map.setZoom(16)
      }, 500)
    },

    initMap (map) {
      this.yMap = map
      if (this.company.item.branches.length > 0 && map.geoObjects) {
        map.setBounds(map.geoObjects.getBounds())
      } else {
        this.ymapZoom = 16
      }
    },

    isMapLoad () {
      this.initYandexMap()
    },

    setupMapWithPoint: function (result) {
      this.ymapCenterCoords = result
      this.ymapPlacemarks.push({
        coords: result,
        properties: {},
        options: {},
        // clusterName: "1",
        balloonTemplate: `
                  <div class="balloon-header">${this.company.item.name}</div>
                  <div class="balloon-body">${this.company.item.address}</div>
                  <div class="balloon-footer">${this.company.item.phone_1}</div>
                `
      })
      this.yMapInited = true
    },

    initYandexMap () {
      if (this.yMapInited) {
        return
      }
      if ((this.company.item.longitude.length > 0) && (this.company.item.latitude.length > 0)) {
        let point = [this.company.item.latitude, this.company.item.longitude]
        this.setupMapWithPoint(point)
        return
      }
      this.$store
        .dispatch('getGeocode', this.company.item.address)
        .then(() => {
          let result = this.$store.getters.getGeocode

          if (result.length > 0) {
            this.setupMapWithPoint(result)
          }
        })
    },

    onSlideCustom (index, slide) {
      this.$emit('onslide', { index, slide })

      const description = this.descriptions[index]
      const node = $('#bigGallery').find('.description span')
      if ((typeof description !== 'undefined') && (description !== null)) {
        node.css({ opacity: 0.7 })
        node.empty()
        node[0].appendChild(document.createTextNode(description))
      } else {
        node.css({ opacity: 0 })
      }
    },
    click (e) {
      const currentUrl = $(e.target).attr('main_url')
      for (let i in this.companyAlbumImages) {
        if (this.companyAlbumImages[i] === currentUrl) {
          this.imageIndex = parseInt(i)
          return
        }
      }
    },
    openGeneralCompanyContact (item, index) {
      this.currentCompany = item
      this.isShowCompanyFeedback = false
      this.setOpenCompanyContact(true)
      this.companyContactsId = ''
    },

    openModalMap (item, index) {
      this.currentModalMap = [item.latitude, item.longitude]
    },
    closeModalMap (item, index) {
      this.currentModalMap = ''
    }
  },

  template: require('./Company.html'),

  beforeRouteLeave (to, from, next) {
    if ((to.name !== 'temporaryCompany') && (to.name !== 'company')) {
      this.yMapInited = false
    }

    next()
  }
}
</script>
