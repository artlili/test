import Vue from 'vue'
import Vuex from 'vuex'
import ArticleModule from '@/modules/ArticleModule'
import CompanyModule from '@/modules/CompanyModule'
import ProductModule from '@/modules/ProductModule'
import SectionModule from '@/modules/SectionModule'
import SystemModule from '@/modules/SystemModule'
import HomeModule from '@/modules/HomeModule'
import AuthModule from '@/modules/AuthModule'
import FeedbackModule from '@/modules/FeedbackModule'
import CropperModule from '@/modules/CropperModule'
import BannerModule from '@/modules/BannerModule'
import HeaderModule from '@/modules/HeaderModule'
import InfoModule from '@/modules/InfoModule'
import DeskCompanyModule from '@/modules/DeskCompanyModule'
import YandexMapModule from '@/modules/YandexMapModule'
import GalleryModule from '@/modules/GalleryModule'
import LocalityModule from '@/modules/LocalityModule'
import FnsModule from '@/modules/FnsModule'
import VerifyPhoneModule from '@/modules/VerifyPhoneModule'
import ReasonModule from '@/modules/ReasonModule'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    bannerItems: {},
    isLoading: false,
    error: null
  },

  modules: {
    system: SystemModule,

    home: HomeModule,
    articles: ArticleModule,
    companies: CompanyModule,
    products: ProductModule,
    info: InfoModule,

    auth: AuthModule,
    feedback: FeedbackModule,
    banner: BannerModule,
    header: HeaderModule,
    section: SectionModule,

    deskCompany: DeskCompanyModule,

    yandexMapModule: YandexMapModule,

    galleryModule: GalleryModule,

    localityModule: LocalityModule,

    cropperModule: CropperModule,
    fnsModule: FnsModule,
    verifyPhoneModule: VerifyPhoneModule,

    reasonModule: ReasonModule
  }
})

export default store
