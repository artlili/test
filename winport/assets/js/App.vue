<script>
import MetaTagsService from '@/services/MetaTagsService'
import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'
import Header from '@/components/shared/Header/Header.vue'
import Footer from '@/components/shared/Footer/Footer.vue'
import ButtonToTop from '@/components/shared/ButtonToTop/ButtonToTop.vue'
import Banner from '@/components/shared/Banner/Banner.vue'
import Spinner from '@/components/shared/Spinner/Spinner.vue'
import ModalAuth from '@/components/shared/ModalAuth/ModalAuth.vue'
import Feedback from '@/components/shared/Feedback/Feedback.vue'
import Vue from 'vue'
import Router from '@/router/router.js'

export default {
  name: 'App',

  components: {
    'header-component': Header,
    'footer-component': Footer,
    'button-to-top': ButtonToTop,
    'banner': Banner,
    'spinner': Spinner,
    'modal-auth': ModalAuth,
    'feedback': Feedback
  },

  computed: {
    isLoading () {
      return this.$store.getters.getLoading
    },
    responseError () {
      return this.$store.getters.getError
    }
  },

  created () {
    Vue.http.interceptors.push(function (request, next) {
      let token = localStorage.getItem('token')
      if (token) {
        request.headers.set('Authorization', 'Bearer ' + token)
      }

      next(function (response) {
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('token')
          _this.$router.push('/signin')
        } else if (response.status === 404) {
          Router.replace('/404')
        } else if (response.status === 500) {
          _this.$router.replace('/500')
        }
      })
    })
    this.fetchBanners()
    MetaTagsService.setTags('', '', '')
  },

  mounted () {
    let _this = this
  },

  methods: {
    fetchBanners () {
      this.$store.dispatch('getBannerItems').then(() => {
        this.bannerItems = this.$store.getters.getBannerItems
      })
    }
  }
}
</script>

<template>
  <div>

    <spinner v-if="isLoading"/>

    <banner position="TopCross100"/>

    <div
      id="wrapper"
      class="site_wrap polygon">
      <div class="wrap">
        <!-- HEAD -->
        <header-component/>
        <!-- END HEAD -->

        <router-view/>

        <!-- FOOTER -->
        <footer-component/>
        <!-- END FOOTER -->
      </div>
    </div>

    <banner position="BottomCross100"/>

    <modal-auth modal-name="authModalName"/>

    <feedback/>

  </div>
</template>
