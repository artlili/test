<!--<template src="./Products.html"></template>-->

<script>
import ConfigService from '@/services/ConfigService'
import MetaTagsService from '@/services/MetaTagsService'
import Pagination from '@/components/shared/Pagination/Pagination.vue'
import Banner from '@/components/shared/Banner/Banner.vue'
import CatalogFilterCity from '@/components/shared/CatalogFilterCity/CatalogFilterCity.vue'
import CatalogMenuRight from '@/components/shared/CatalogMenuRight/CatalogMenuRight.vue'
import CatalogFilterRight from '@/components/shared/CatalogFilterRight/CatalogFilterRight.vue'

export default {
  name: 'Products',

  template: require('./Products.html'),

  components: {
    'pagination': Pagination,
    'banner': Banner,
    'catalog-filter-city': CatalogFilterCity,
    'catalog-menu-right': CatalogMenuRight,
    'catalog-filter-right': CatalogFilterRight
  },

  data () {
    return {
      page: {
        'section': [],
        'favoriteCompanies': [],
        'items': [],
        'pagination': []
      },
      sections: [],
      noImageUrls: ConfigService.getSetting('noImageUrl'),
      tabs2: 'companies',
      opennedAlias: null,
      search: '',
      sort: ''
    }
  },

  computed: {
    productsAlias: function () {
      return this.$route.params.productsAlias
    },
    pagination () {
      return this.page.pagination
    },
    isFirstPage() {
      const isUndefined = typeof this.$route.params.productsPage === 'undefined';
      const isFirst = this.$route.params.productsPage == 1;
      return isUndefined || isFirst;
    }
  },

  created () {
    this.fetchData()
    this.fetchSections()
  },

  mounted () {
    this.sort = (typeof this.$route.query.sort !== 'undefined') ? this.$route.query.sort : 'asc'
    this.search = (typeof this.$route.query.search !== 'undefined') ? this.$route.query.search : ''
  },

  methods: {
    fetchSearchData () {
      var data = Object.assign({}, this.$route.query)
      data['search'] = this.search
      data['sort'] = this.sort
      if (typeof this.productsAlias !== 'undefined') {
        this.$router.push({path: `/products/${this.productsAlias}`, query: data})
      } else {
        this.$router.push({name: 'products', query: data})
      }
      this.fetchData()
    },

    fetchSearchDataAsc () {
      var data = Object.assign({}, this.$route.query)
      data['search'] = this.search
      this.sort = 'asc'
      data['sort'] = this.sort
      if (typeof this.productsAlias !== 'undefined') {
        this.$router.push({path: `/products/${this.productsAlias}`, query: data})
      } else {
        this.$router.push({name: 'products', query: data})
      }
      this.fetchData()
    },

    fetchSearchDataDesc () {
      var data = Object.assign({}, this.$route.query)
      data['search'] = this.search
      this.sort = 'desc'
      data['sort'] = this.sort
      if (typeof this.productsAlias !== 'undefined') {
        this.$router.push({path: `/products/${this.productsAlias}`, query: data})
      } else {
        this.$router.push({name: 'products', query: data})
      }

      this.fetchData()
    },

    fetchData () {
      this.sort = (typeof this.$route.query.sort !== 'undefined') ? this.$route.query.sort : 'asc'
      this.search = (typeof this.$route.query.search !== 'undefined') ? this.$route.query.search : ''
      this.$store.dispatch('getProducts', [this.$route.params.productsAlias, this.$route.params.productsPage, this.search, this.sort]).then(() => {
        this.page = this.$store.getters.getProducts
      })
    },

    fetchSections () {
      this.sort = 'asc'
      this.search = ''
      this.$store.dispatch('getSections').then(() => {
        this.sections = this.$store.getters.getSections
        this.changeOpennedAlias()
      })
    },

    changeOpennedAlias () {
      let route = this.$route.params.productsAlias
      for (let i in this.sections) {
        if (this.sections[i].alias === route) {
          this.opennedAlias = this.sections[i].alias
          return
        }

        if (this.sections[i].items.length) {
          for (let j in this.sections[i].items) {
            if (this.sections[i].items[j].alias === route) {
              this.opennedAlias = this.sections[i].alias
              return
            }
          }
        }
      }
    }
  },

  watch: {
    '$route.params.productsAlias': function (newRoute, oldRoute) {
      this.fetchData()
      this.changeOpennedAlias()
    },

    '$route.params.productsPage': function (newRoute, oldRoute) {
      this.fetchData()
    },

    'page.section': function () {
      let title = this.page.section.title ? this.page.section.title : this.page.section.name
      let keywords = this.page.section.keywords
      let description = this.page.section.description
      return MetaTagsService.setTags(title, keywords, description)
    }
  }
}
</script>
