import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ru from '@/langs/ru.json'
import en from '@/langs/en.json'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'ru',
  fallbacklocale: 'ru',
  messages: {
    ru: ru,
    en: en
  }
})
