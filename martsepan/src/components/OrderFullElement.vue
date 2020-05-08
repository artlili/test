<template>
  <scroll-to-component ref="element">
    <div class="orderFullElement">
      <OrderCard :type="type" :show="show" :item="item" :open="open" @actionCard="actionCard"></OrderCard>
      <OrderDetails :activeClass="activeClass" :type="type" :item="item" v-if="open" @actionDetails="actionDetails"></OrderDetails>
    </div>
  </scroll-to-component>
</template>
<script>
import OrderCard from '@/components/OrderCard'
import OrderDetails from '@/components/OrderDetails'
import { RequestsService } from '@/services/RequestsService'
import ScrollToComponent from '@/components/shared/ScrollToComponent.vue'
export default {
  name: 'orderFullElement',
  components: {
    OrderCard,
    OrderDetails,
    ScrollToComponent
  },
  props: {
    item: {
      type: Object
    },
    type: {
      type: String
    },
    show: {
      type: String
    },
    newItemId: {
      type: Number
    }
  },
  data () {
    return {
      open: false,
      arrPositionBooking: [],
      selectedDog101: '',
      selectedDog100: '',
      selectedRequestNum: '',
      selectedOrder: '',
      activeClass: 0
    }
  },
  methods: {
    actionDetails ({ action, obj }) {
      this.$emit('updateRequest')
      switch (action) {
        case 'addPosition':
          this.$parent.cardAction = true
          this.$emit('actionProduct', obj)
          break
        case 'addBooking':
          this.$parent.cardAction = true
          this.clickAddBooking(obj)
          break
        case 'removeBooking':
          this.$parent.cardAction = true
          this.clickDeleteBooking(obj)
          break
        case 'editPosition':
          this.$parent.cardAction = true
          this.$emit('actionProduct', obj)
          break
        case 'deletePosition':
          this.$parent.cardAction = true
          this.deletePosition(obj)
          break
        case 'editPerson':
          this.$parent.cardAction = true
          this.$emit('actionCard', obj)
          break
        case 'deletePerson':
          this.$parent.cardAction = true
          this.deletePerson(obj)
          break
        case 'showGraf':
          this.$emit('showGraf', obj)
          break
      }
    },
    actionCard ({ action, obj = {} }) {
      switch (action) {
        case 'show_more':
          this.open = !this.open
          break
        case 'addBooking':
          this.$parent.cardAction = true
          this.clickAddBooking(obj)
          this.$emit('updateRequest')
          break
        case 'deleteBooking':
          this.$parent.cardAction = true
          this.clickDeleteBooking(obj)
          this.$emit('updateRequest')
          break
        case 'expiredBooking':
          this.expiredBooking(obj)
          break
        case 'show_parts':
          this.$emit('showParts', obj)
          break
        case 'save_CP':
          this.$emit('showCP', obj)
          break
        case 'deleteRequest':
          this.$parent.deleteAction = true
          this.deleteReuest(obj)
          this.$emit('deleteRequest', obj)
          break
        case 'Checkout':
          this.checkout(obj)
          break
        case 'showBPZ':
          this.$emit('showBPZ', obj)
          break
        case 'createBPZ':
          this.$parent.cardAction = true
          this.$emit('createBPZ', obj)
          this.$emit('updateOrders')
          break
        case 'invoice':
          this.$emit('showInvoice', obj)
          break
        case 'rename':
          this.$parent.cardAction = true
          this.renameRquest(obj)
          this.$emit('updateRequest')
          break
      }
    },
    // Новые доработки
    checkout (obj) {
      // this.$emit('setLoader', true)
      if (obj.booking_status !== 5) {
        this.addBooking({ item: obj, num: 'all' }, true).then((data) => {
          let a = this.vlidatePromices(this.arrPositionBooking, data)
          if (a.success === true) {
            this.sendRequestToOrder(this.selectedDog101).then((data) => {
              this.$set(this, 'selectedOrder', data[2])
              this.showMessageBox({ pos: a.arrPosition, err: a.arrError }, 'done')
              this.$parent.deleteAction = true
              this.$emit('deleteRequest', obj)
              this.$emit('getRequest')
            })
          } else {
            this.showMessageBox({ pos: a.arrPosition, err: a.arrError }, 'error')
          }
          // this.$emit('getRequest')
        })
      } else {
        this.expiredBooking(obj)
        // this.$emit('setLoader', false)
      }
    },
    deletePosition (obj) {
      this.$confirm()
        .then(() => {
          this.$emit('setLoader', true)
          this.deleteBooking({ item: obj, num: 'one' }).then(() => {
            this.sendDeletePosition(obj.id).then(() => {
              this.$emit('getRequest')
            }).catch()
          })
        })
        .catch(e => {
        })
    },
    deletePerson (obj) {
      let item = obj.item
      let index = obj.index
      this.$confirm()
        .then(() => {
          this.$emit('setLoader', true)
          this.deleteBooking({ item: item, num: 'one' }).then(() => {
            this.sendDeletePerson(item.id, index).then(() => {
              this.$emit('getRequest')
            }).catch()
          })
        })
        .catch(e => {
        })
    },
    expiredBooking (obj) {
      let pos = []
      this.$set(this, 'selectedRequestNum', obj.number)
      obj.items.forEach(function (el) {
        if (el.booking_status === 5) {
          pos.push(el)
        }
      })
      this.showMessageBox({ pos: pos }, 'expired')
    },
    clickAddBooking (obj) {
      this.$emit('setLoader', true)
      this.addBooking(obj).then((data) => {
        let a = this.vlidatePromices(this.arrPositionBooking, data)
        if (a.success === false) {
          this.showMessageBox({ pos: a.arrPosition, err: a.arrError }, 'error')
          this.$emit('getRequest')
        } else {
          this.$emit('getRequest')
        }
      })
    },
    clickDeleteBooking (obj) {
      this.$emit('setLoader', true)
      this.deleteBooking(obj).then((data) => {
        let a = this.vlidatePromices(this.arrPositionBooking, data)
        if (a.success === false) {
          this.showMessageBox({ pos: a.arrPosition, err: a.arrError }, 'error')
          this.$emit('getRequest')
        } else {
          this.$emit('getRequest')
        }
      })
    },
    deleteReuest (obj) {
      this.$confirm()
        .then(() => {
          this.$emit('setLoader', true)
          this.$parent.deleteAction = true
          if (obj.items && obj.items.length > 0) {
            this.deleteBooking({ item: obj, num: 'all' }).then(() => {
              this.sendDeleteRequest(obj.id).then(() => {
                this.$emit('getRequest')
              }).catch()
            })
          } else {
            this.sendDeleteRequest(obj.id).then(() => {
              this.$emit('getRequest')
            }).catch()
          }
        })
        .catch(e => {
        })
    },
    deleteBooking ({ item, num }) {
      let vm = this
      let arrBookingPromice = []
      this.arrPositionBooking = []
      if (num === 'all') {
        item.items.forEach(function (el) {
          vm.arrPositionBooking.push(el)
          arrBookingPromice.push(vm.sendDeleteBooking(el.id))
        })
      } else {
        vm.arrPositionBooking.push(item)
        arrBookingPromice.push(this.sendDeleteBooking(item.id))
      }
      return Promise.all(arrBookingPromice)
    },
    addBooking ({ item, num }) {
      let vm = this
      let arrBookingPromice = []
      this.arrPositionBooking = []
      if (num === 'all') {
        this.$set(this, 'selectedDog101', item.id)
        this.$set(this, 'selectedRequestNum', item.number)
        item.items.forEach(function (el) {
          vm.arrPositionBooking.push(el)
          arrBookingPromice.push(vm.sendAddBooking(el.id))
        })
      } else {
        vm.arrPositionBooking.push(item)
        arrBookingPromice.push(this.sendAddBooking(item.id))
      }
      return Promise.all(arrBookingPromice)
    },
    vlidatePromices (item, promice) {
      let arrPosition = []
      let arrError = []
      promice.forEach(function (el, i) {
        if (el[0] !== 0 && el[1] !== '') {
          item.forEach(function (elem, j) {
            if (j === i) {
              arrPosition.push(elem)
            }
          })
          arrError.push(el)
        }
      })
      if (arrError && arrError.length > 0) {
        return { arrError, arrPosition, success: false }
      } else {
        return { arrError, arrPosition, success: true }
      }
    },
    showMessageBox ({ pos, err }, status) {
      if (status === 'error') {
        this.$messageBox({
          request: this.selectedRequestNum,
          type: 'error',
          'from': 'booking',
          errors: err,
          positions: pos
        })
      }
      if (status === 'expired') {
        this.$messageBox({
          request: this.selectedRequestNum,
          type: 'error',
          'from': 'expired',
          positions: pos
        })
      }
      if (status === 'done') {
        this.$messageBox({
          request: this.selectedRequestNum,
          order: this.selectedOrder,
          type: 'done',
          'from': 'booking'
        })
      }
    },
    renameRquest (obj) {
      this.sendRenameRquest(obj).then(() => {
        this.$emit('getRequest')
      })
    },
    sendAddBooking (dog100) {
      return RequestsService.bookRequestPositionById(dog100)
        .catch(e => console.error('error booking position', e))
        .finally(() => {
        })
    },
    sendDeleteRequest (dog101) {
      return RequestsService.removeRequestById(dog101)
        .catch(e => console.error('error removing request', e))
        .finally(() => {
        })
    },
    sendDeleteBooking (dog100) {
      return RequestsService.unBookRequestPositionById(dog100)
        .catch(e => console.error('error unBooking position', e))
        .finally(() => {
        })
    },
    sendRequestToOrder (dog101) {
      return RequestsService.convertOrderToRequestById(dog101)
        .catch(e => console.error('error converting request to order', e))
        .finally(() => {
        })
    },
    sendDeletePosition (id) {
      return RequestsService.removePositionInRequestById(id)
        .catch(e => console.error('error removing position', e))
        .finally(() => {
        })
    },
    sendDeletePerson (id, index) {
      return RequestsService.removePersonalizationFromPositionByIndex({ positionId: id, personIndex: index })
        .catch(e => console.error('error removing personalization', e))
        .finally(() => {
        })
    },
    sendRenameRquest ({ text, dog101 }) {
      return RequestsService.renameRquest({ dog101: dog101, text: text })
        .catch(e => console.error('error removing personalization', e))
        .finally(() => {
        })
    },
    scroll () {
      this.$refs.element.scrollTo()
    }
  },
  created () {
    // localStorage.setItem('order', '{"950979":["11087.14","11087.12"]}')
    let newOrder = localStorage.getItem('order')
    newOrder = JSON.parse(newOrder)
    let items = newOrder[this.item.id]

    if (items) {
      this.open = true
      for (let i = 0; i < items.length; i++) {
        Object.values(this.item.items).map((value) => {
          if (items[i] === value.art) {
            this.activeClass = value.id
          }
        })
      }
      this.$nextTick(() => this.scroll())
      setTimeout(() => { localStorage.removeItem('order') }, 2500)
    }

    if (window.dog101 && window.dog101 === this.item.id) {
      Object.values(this.item.items).map((value) => {
        if (window.dog100 === value.id) {
          this.activeClass = value.id
          this.$nextTick(() => this.scroll())
          setTimeout(() => { window.scrollBy(0, -70) }, 500)
          setTimeout(() => { this.activeClass = 0 }, 2500)
        }
      })
    }
    if (this.newItemCreate === this.newItemId) {
      this.open = true
    }
  },
  computed: {
    newItemCreate () {
      let itemId = Number(this.item.number)
      let newItemId = Number(this.newItemId)
      if (newItemId === itemId) {
        return itemId
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
