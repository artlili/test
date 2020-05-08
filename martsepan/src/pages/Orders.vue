<template>
  <PageLayout>
    <div slot="content" class="orders">
      <h1>Заказы
        <a class="orders_title-link" :href="isProduction ? '/dilerzone/razdel/orders_archive' : '/orders_archive.html'">Архив заказов</a>
      </h1>
      <div class="booking-limit-mobile" slot="bron">
        <BookingLimit :limits="bookingLinit" @bookingReport="getBookingReport"></BookingLimit>
      </div>
      <div class="orders-search">
        <div class="orders-search-grid">
          <div class="orders-search-input">
            <SearchInput v-model="searchInputValue"
                         placeholder="Поиск по номеру или названию..."
                         @change="onSearchInput"
                         :disabled="isFetchingData">
            </SearchInput>
          </div>
          <div class="orders-search-group">
            <div class="orders-search-select">
              <FormSelect :options="searchEntities" :value="searchSelectValue"
                          @input="onSearchSelect"></FormSelect>
            </div>
            <div class="orders-search-button">
              <FormButton type="hotBooking" :active="hotReserve" @click="onBookingButton">
                Горящая бронь
              </FormButton>
            </div>
          </div>
        </div>
      </div>
      <div class="orders-row" v-for="(item, index) in filteredData" :key="index">
        <OrderFullElement :newItemId="newItemId"
                          :type="'order'"
                          :item="item"
                          @showBPZ="showBPZ"
                          @createBPZ="createBPZ"
                          @showGraf="showGraf"
                          @showInvoice="showInvoice"
                          @updateOrders="updateOrders(item, index)">
        </OrderFullElement>
      </div>
      <div v-if="filteredData.length === 0">
        <requestMessage text="Нет данных для отображения"></requestMessage>
      </div>
      <Preloader v-if="isFetchingData"></Preloader>
      <div class="orders-row"  v-if="arrRequests.length === requestsShow">
        <div class="orders-btn">
          <FormButton @click="showAllOrders()" type="solid">Показать ещё</FormButton>
        </div>
      </div>
      <OrderConfirmation v-if="showBPZModal"
                         :active="showBPZModal"
                         :item="modalData"
                         :error="modalBpzError"
                         :dog101="dog101"
                         @sendBPZ="sendBPZ"
                         @modalClosed="showBPZModal = false">
      </OrderConfirmation>
      <Order v-if="showInvoiceModal"
             :active="showInvoiceModal"
             :item="modalData"
             @modalClosed="showInvoiceModal = false">
      </Order>
      <ScheduleOrders v-if="showScheduleOrdersModal"
                      :active="showScheduleOrdersModal"
                      :item="modalData"
                      :position="currentPosition"
                      :parent="currentPositionParent"
                      :order="orderNumber"
                      @modalClosed="showScheduleOrdersModal = false">
      </ScheduleOrders>
      <WidgetManager></WidgetManager>
    </div>
    <div class="booking-limit" slot="aside">
      <BookingLimit :limits="bookingLinit" @bookingReport="getBookingReport"></BookingLimit>
    </div>
    <div class="booking-limit" slot="aside">
      <OrderAmount :limits="bookingLinit"></OrderAmount>
    </div>
  </PageLayout>
</template>

<script>
import Preloader from '@/components/Preloader'
import requestMessage from '@/components/shared/requestMessage'
import SearchInput from '@/components/SearchInput'
import FormSelect from '@/components/FormSelect'
import FormButton from '@/components/FormButton'
import searchIcon from '@/assets/svg/search.svg'
import fireIcon from '@/assets/svg/fire.svg'
import { UserService } from '@/services/UserService'
import { OrdersService } from '@/services/OrdersService'
import { RequestsService } from '@/services/RequestsService'
import { privilegesMixin } from '@/mixins'

export default {
  name: 'Orders',
  mixins: [privilegesMixin],
  components: {
    Preloader,
    SearchInput,
    FormSelect,
    FormButton,
    requestMessage
  },
  data () {
    return {
      isProduction: process.env.NODE_ENV === 'production',
      searchIcon,
      fireIcon,
      bookingLinit: {},
      showedAllOrders: false,
      orderNumber: '',
      currentPosition: {},
      currentPositionParent: {},
      bookingReport: {},
      bpzSend: false,
      dog101: '',
      showBPZModal: false,
      showInvoiceModal: false,
      showScheduleOrdersModal: false,
      showAcceptBPZModal: false,
      modalBpzError: false,
      modalData: {
        provider: {},
        payer: {},
        items: []
      },
      arrRequests: [],
      filteredData: [],
      requestsShow: 20,
      lastKey101: 0,
      managerId: 0,
      booking: 0,
      searchInputValue: '',
      cardAction: false,
      isFetchingData: false,
      hotReserve: false,
      searchEntities: [],
      newItemId: 0,
      searchSelectValue: ''
    }
  },
  created () {
    this.getOrders()
    this.getEntities()
    this.getBookingLimit()
  },
  computed: {
    getLastKey () {
      let lastKey = this.filteredData.length - 1
      return this.filteredData[lastKey].id
    },
    getFilteredData () {
      let data = []
      if (this.filteredData.length) {
        data = this.filteredData
        if (this.lastKey101 > 0) {
          this.$_.each(this.arrRequests, function (item) {
            data.push(item)
          })
        }
        if (this.cardAction) {
          data = this.filteredData
          let newData = this.$_.unionBy(this.arrRequests, data, 'number')
          data = this.$_.orderBy(newData, ['type', 'number'], ['asc', 'desc'])
        }
      } else {
        data = this.arrRequests
      }

      return data
    }
  },
  methods: {
    onSearchInput () {
      this.requestsShow = 20
      this.filteredData = []
      this.lastKey101 = 0
      this.hotReserve = false
      this.booking = 0
      this.getOrders()
    },
    onSearchSelect (id) {
      this.requestsShow = 20
      this.managerId = id
      this.filteredData = []
      this.lastKey101 = 0
      this.searchInputValue = ''
      this.hotReserve = false
      this.booking = 0
      this.getOrders()
    },
    onBookingButton () {
      this.hotReserve = !this.hotReserve
      this.hotReserve ? this.booking = 1 : this.booking = 0
      this.requestsShow = 20
      this.filteredData = []
      this.lastKey101 = 0
      this.searchInputValue = ''
      this.getOrders()
    },
    showAllOrders () {
      this.requestsShow = 20
      this.lastKey101 = this.getLastKey
      this.getOrders({lastKey101: this.lastKey101, select: this.managerId})
    },
    updateOrders (item, index) {
      this.query = item.number
      if (index > 0) {
        this.lastKey101 = this.filteredData[index - 1].id
      } else {
        this.lastKey101 = 0
      }
    },
    getOrders (params = {
      count: this.requestsShow,
      lastKey101: this.lastKey101,
      select: this.managerId,
      booking: this.booking,
      query: this.searchInputValue
    }) {
      this.isFetchingData = true
      OrdersService.getOrders(params)
        .then((data) => {
          this.arrRequests = data
        })
        .catch(e => console.error('error getting orders', e))
        .finally(() => {
          this.filteredData = this.getFilteredData
          this.isFetchingData = false
        })
    },
    showBPZ (item) {
      this.modalBpzError = false
      if (item.booking_status === 5) {
        this.modalBpzError = true
      }
      if (item.BPZ_link) {
        window.open(`${item.BPZ_link}`, '_blank')
      }
    },
    createBPZ (item) {
      this.modalBpzError = false
      if (item.booking_status === 5) {
        this.modalBpzError = true
        this.requestsShow = 20
      } else {
        this.requestsShow = 1
      }
      this.getBPZ(item.id)
    },
    showInvoice (item) {
      this.getInvoice(item.id)
    },
    showGraf ({ item, dog101, order }) {
      this.orderNumber = order
      this.currentPosition = item
      this.currentPositionParent = dog101
      this.getGraf(dog101, item.sale_id)
    },
    getBPZ (data) {
      this.isFetchingData = true
      this.dog101 = data
      OrdersService.getBPZ(data)
        .then((data) => {
          this.modalData = data
          this.showBPZModal = true
        })
        .catch(e => console.error('error getting bpz', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getInvoice (data) {
      this.isFetchingData = true
      OrdersService.getInvoice(data)
        .then((data) => {
          this.modalData = data
        })
        .catch(e => console.error('error getting invoice', e))
        .finally(() => {
          this.isFetchingData = false
          this.showInvoiceModal = true
        })
    },
    getGraf (id, saleId) {
      this.isFetchingData = true
      OrdersService.getGraf(id, saleId)
        .then((data) => {
          this.modalData = data
        })
        .catch(e => console.error('error getting graf', e))
        .finally(() => {
          this.isFetchingData = false
          this.showScheduleOrdersModal = true
        })
    },
    getEntities () {
      UserService.getUserIdAndEntities()
        .then(data => {
          this.searchEntities = [{ id: 0, name: 'от всех ЮЛ' }, ...data.items.map(v => ({ id: v.id, name: v.name }))]
        })
        .catch(e => console.error('error getting entities', e))
    },
    sendBPZ (credentials) {
      this.isFetchingData = true
      OrdersService.sendBPZ(credentials)
        .then((data) => {
          this.showBPZModal = false
          this.$messageBox({
            request: credentials.dog101,
            type: 'info',
            'from': 'BPZ',
            positions: data
          })
          this.getOrders()
        })
        .catch(e => console.error('error sending bpz to client', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getBookingLimit () {
      this.loader = true
      return RequestsService.getBookingLimit()
        .then((data) => {
          this.bookingLinit = data
        })
        .catch(e => console.error('error getting booking limit', e))
        .finally(() => {
          this.loader = false
        })
    },
    getBookingReport () {
      return window.open('https://adjutant.ru/dilerzoneajax/siteBronOrg/all/show/1', '_blank') // TODO захардкоженные ссылки чет мне не нравятся :(
    }
    // search (params) {
    //   this.getOrders(params)
    // }
  }
}
</script>

<style lang="scss" scoped>
.booking-limit {
  padding-bottom: 30px;

  &-mobile {
    padding-bottom: 10px;
    display: none;
    @media all and (max-width: getBreakpointVal(md)) {
      display: block;
    }
  }

}

.orders {
  &_title-link {
    font-size: 14px;
    color: $colorBrand;
    display: inline-block;
    margin: 0 5px;
    position: relative;
    top: -3px;
    text-transform: lowercase;
    text-underline-position: under;
    font-family: $fontMain;
    &:hover {
      color: $colorBrandDark;
      &::after {
        left: 6px;
        top: -0.5px;
        border: 2px solid $colorBrandDark;
        border-top-color: transparent;
        border-right-color: transparent;
        transition: left 125ms;
      }
    }
    &::after {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      position: relative;
      left: 4px;
      border: 2px solid $colorBrand;
      border-top-color: transparent;
      border-right-color: transparent;
      box-sizing: border-box;
      transform: rotate(-135deg);
      transition: left 125ms;
    }
  }
  &-row {
    margin-bottom: 10px;
  }
  &-search {
    padding-bottom: 30px;
    &-grid {
      @include createGrid(8px);
    }
    &-input {
      flex: 1 1 auto;
    }
    &-select {
      flex: 0 0 auto;
      width: 180px;
      padding-right: 8px;
    }
    &-button {
      flex: 0 0 auto;
      width: 160px;
      box-sizing: content-box;
      /deep/ .button._skeleton {
        padding-top: 7px;
        padding-bottom: 7px;
      }
    }
    &-group {
      display: flex;
    }
  }
  &-btn {
    max-width: 325px;
    padding-top: 40px;
    padding-bottom: 50px;
  }
  @media all and (max-width: getBreakpointVal(sm)) {
    &-search {
      &-grid {
        flex-wrap: wrap;
      }
      &-input {
        width: 100%;
        margin-bottom: 8px;
      }
      &-select {
        width: 50%;
      }
      &-button {
        width: 50%;
      }
      &-group {
        width: 100%;
      }
    }
  }
}
</style>
