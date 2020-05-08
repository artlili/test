import Vue from 'vue'
import ConfirmComponent from './Confirm'

const destroy = function (instance) {
  instance.show = false
  // TODO Костыль. Нужно как-то понимать, что анимация закрытия модалки закончилась и только тогда запускать удаление и дестрой
  setTimeout(() => {
    instance.$el.remove()
    instance.$destroy()
  }, 225)
}

const init = function (resolve, reject) {
  const instance = new Vue({
    extends: ConfirmComponent,
    propsData: {
      callback (result) {
        destroy(instance)
        if (result) {
          resolve(result)
        } else {
          reject(new Error(result))
        }
      }
    }
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.show = true
}

const initModal = function () {
  return new Promise((resolve, reject) => {
    init.apply(this, [resolve, reject])
  })
}

const install = function (Vue, options) {
  Vue.prototype.$confirm = initModal
}

export const ConfirmPlugin = {
  install,
  destroy,
  init
}
