import Vue from 'vue'
import Router from 'vue-router'
import MetaTagsService from '@/services/MetaTagsService'
import ConfigService from '@/services/ConfigService'
import {
  Home,
  Info,
  Ads,
  Ad,
  AdsAuthor,
  Articles,
  Article,
  Companies,
  Company,
  Product,
  Products,

  NotFoundException,
  Error500,
  Foolish,

  Search,

  Desk,
  DeskCompanyList,
  DeskCompany,

  DeskAdList,
  DeskAdCreate,
  DeskAdUpdate,

  DeskProfile,
  DeskEmail,
  DeskPassword,
  DeskVerification,
  DeskSubscription,
  DeskNotifications,

  Signin,
  ConfirmSignup,
  ChangePassword
} from '@/pages'

Vue.use(Router)

const router = new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      component: Home,
      meta: {requireAuth: false}
    },
    {
      path: '/info/:alias',
      name: 'info',
      component: Info
    },
    {
      path: '/ads',
      name: 'ads',
      component: Ads
    },
    {
      path: '/ad/:alias',
      name: 'ad',
      component: Ad
    },
    {
      path: '/ads-author/:alias',
      name: 'adsAuthor',
      component: AdsAuthor
    },
    {
      path: '/articles/:alias/:articlesPage?',
      name: 'articles',
      component: Articles
    },
    {
      path: '/article/:alias',
      name: 'article',
      component: Article
    },
    {
      path: '/temporary/article/:temporary',
      name: 'temporaryArticle',
      component: Article
    },
    {
      path: '/companies/:companiesPage(\\d+)?',
      name: 'companies',
      component: Companies
    },
    {
      path: '/companies/:companiesAlias?/:companiesPage(\\d+)?',
      name: 'companies',
      component: Companies
    },
    {
      path: '/company/:companyAlias?/album/:albumAlias/:albumPage(\\d+)?',
      name: 'company',
      component: Company
    },
    {
      path: '/company/:companyAlias?/:newsPage(\\d+)?',
      name: 'company',
      component: Company
    },
    {
      path: '/temporary/company/:temporary',
      name: 'temporaryCompany',
      component: Company
    },
    {
      path: '/temporary/company/:temporary/album/:albumAlias/:albumPage(\\d+)?',
      name: 'temporaryCompany',
      component: Company
    },
    {
      path: '/products/:productsPage(\\d+)?',
      name: 'products',
      component: Products
    },
    {
      path: '/products/:productsAlias?/:productsPage(\\d+)?',
      name: 'products',
      component: Products
    },
    {
      path: '/product/:productAlias',
      name: 'product',
      component: Product
    },

    {
      path: '/desk',
      name: 'desk',
      component: Desk,
      meta: {requireAuth: true, parent: 'desk'}
    },
    {
      path: '/desk-company/list',
      name: 'desk-company-list',
      component: DeskCompanyList,
      meta: {requireAuth: true, parent: 'desk-company'}
    },
    {
      path: '/desk-company/create',
      name: 'desk-company-create',
      component: DeskCompany,
      meta: {requireAuth: true, parent: 'desk-company'}
    },
    {
      path: '/desk-company/update/:id(\\d+)',
      name: 'desk-company-update',
      component: DeskCompany,
      meta: {requireAuth: true, parent: 'desk-company'}
    },
    {
      path: '/desk-ad/list',
      name: 'desk-ad-list',
      component: DeskAdList,
      meta: {requireAuth: true, parent: 'desk-ads'}
    },
    {
      path: '/desk-ad/create',
      name: 'desk-ad-create',
      component: DeskAdCreate,
      meta: {requireAuth: true, parent: 'desk-ads'}
    },
    {
      path: '/desk-ad/update/:id(\\d+)',
      name: 'desk-ad-update',
      component: DeskAdUpdate,
      meta: {requireAuth: true, parent: 'desk-ads'}
    },
    {
      path: '/desk/profile',
      name: 'desk-profile',
      component: DeskProfile,
      meta: {requireAuth: true, parent: 'desk'}
    },
    {
      path: '/desk/email',
      name: 'desk-email',
      component: DeskEmail,
      meta: {requireAuth: true, parent: 'desk'}
    },
    {
      path: '/desk/password',
      name: 'desk-password',
      component: DeskPassword,
      meta: {requireAuth: true, parent: 'desk'}
    },
    {
      path: '/desk/verification',
      name: 'desk-verification',
      component: DeskVerification,
      meta: {requireAuth: true, parent: 'desk'}
    },
    {
      path: '/desk/subscription',
      name: 'desk-subscription',
      component: DeskSubscription,
      meta: {requireAuth: true}
    },
    {
      path: '/desk/notifications',
      name: 'desk-notifications',
      component: DeskNotifications,
      meta: {requireAuth: true, parent: 'desk-company'}
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },

    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },

    {
      path: '/confirm-signup',
      name: 'confirm-signup',
      component: ConfirmSignup
    },

    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword
    },

    {
      path: '/foolish/:template',
      name: 'foolish',
      component: Foolish
    },

    {
      path: '/500',
      name: 'error500',
      component: Error500
    },
    {
      path: '/*',
      name: 'not-found-exception',
      component: NotFoundException
    }
  ],

  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      return {x: 0, y: 0}
    }
  }

})

window.app.$router = router

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.getItem('token')) {
      next()
    } else {
      window.nextRouter = to
      document.dispatchEvent(new window.Event('authorization.required'))
      next('/')
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  MetaTagsService.setCanonical(ConfigService.getSetting('originUrl') + to.fullPath)
  if (typeof window.galleryInitialized !== 'undefined') {
    delete window.galleryInitialized
  }
  if (typeof window.youtubeInitialized !== 'undefined') {
    delete window.youtubeInitialized
  }

  if (typeof window.app === 'undefined') {
    window.app = {}
  }
  window.app.$route = to
})

export default router
