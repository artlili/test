<template>
  <PageLayout>
    <div slot="content" class="requests">
      <h1>Запросы</h1>
      <div class="booking-limit-mobile" slot="bron">
        <BookingLimit :limits="bookingLinit" @bookingReport="getBookingReport"></BookingLimit>
      </div>
      <div class="requests-search">
        <div class="requests-search-grid">
          <div class="requests-search-input">
            <SearchInput v-model="searchInputValue"
                         placeholder="Поиск по номеру или названию..."
                         @change="onSearchInput"
                         :disabled="isFetchingData">
            </SearchInput>
          </div>
          <div class="requests-search-group">
            <div class="requests-search-select">
              <FormSelect :options="searchManagers" :value="searchSelectValue"
                          @input="onSearchSelect"></FormSelect>
            </div>
            <div class="requests-search-button">
              <FormButton type="hotBooking" :active="hotReserve"
                          @click="onBookingButton">Горящая бронь
              </FormButton>
            </div>
          </div>
        </div>
      </div>
      <div class="requests-row">
        <div v-if="requestsCreationIsAvailable" class="requests-add" @click="addRequest">
          <svg class="icon-svg">
            <use :xlink:href="`#${addIcon.id}`"></use>
          </svg>
          <span>Создать новый запрос</span>
        </div>
      </div>
      <form :action="formAction"
                  method="post"
                  ref="form"
                  @submit="passToConstructor($event)">
        <input type="hidden" name="dog101" v-model="toConstructor.dog101">
        <input type="hidden" name="dog100" v-model="toConstructor.dog100">
      </form>
      <div class="requests-row" v-for="(item, index) in filteredData" :key="item.id">
        <OrderFullElement :newItemId="newItemId" :type="'request'" :item="item" @showParts="showParts" @showCP="showCP" @showView="showView"
                          @showBPZ="showBPZ"
                          @actionProduct="actionProduct"
                          @actionCard="actionCard"
                          @getRequest="getRequest"
                          @deleteRequest="deleteRequest"
                          @updateRequest="updateRequest(item, index)"
                          @setLoader="setLoader"></OrderFullElement>
      </div>
      <MessageBox :close-on-click-outside="false" size="lg" v-if="showMessageBox" :active="showMessageBox" @modalClosed="showMessageBox = false">
        <div slot="title">Ошибка запрос №
          <span>{{getErrorNumber[0].number}}</span>
        </div>
        <div slot="body">{{fromConstructor.error}}</div>
        <div slot="buttons">
          <FormButton type="notColored" @click="callback('Chat')">Связаться с менеджером</FormButton>
        </div>
      </MessageBox>
      <div v-if="filteredData.length === 0">
        <requestMessage text="Нет данных для отображения"></requestMessage>
      </div>

      <div class="requests-row" v-if="arrRequests.length === requestsShow">
        <div class="requests-btn">
          <FormButton @click="showAllOrders()" type="solid">Показать ещё</FormButton>
        </div>
      </div>
      <Preloader v-if="isFetchingData"></Preloader>
      <Accessories v-if="showPartsModal" :active="showPartsModal" :item="modalData"
                   @modalClosed="showPartsModal = false"></Accessories>
      <Commercial v-if="showCPModal" :active="showCPModal" :item="currentReqest" :arr="modalData"
                  @modalClosed="showCPModal = false"></Commercial>
      <Appearance v-if="showViewModal" :active="showViewModal" :item="modalData.items"
                  @modalClosed="showViewModal = false"></Appearance>
      <CreateRequest v-if="showCreateRequest" :active="showCreateRequest" @modalClosed="showCreateRequest = false"
                     @getRequest="getRequest" @setLoader="setLoader"></CreateRequest>
      <Modal :close-on-click-outside="false" size="lg" v-if="showAddPositionModal" :active="showAddPositionModal"
             @modalClosed="showAddPositionModal = false" @getRequest="getRequest">
        <AddPosition :dataAction="productDataAction" :existingPerson="productDataAction" @getRequest="getRequest"
                     @modalClosed="showAddPositionModal = false" @setLoader="setLoader"></AddPosition>
      </Modal>
      <WidgetManager :show="widgetShow"></WidgetManager>
    </div>
    <div class="booking-limit" slot="aside">
      <BookingLimit :limits="bookingLinit" @bookingReport="getBookingReport"></BookingLimit>
    </div>
  </PageLayout>
</template>

<script>
import Preloader from '@/components/Preloader'
import requestMessage from '@/components/shared/requestMessage'
import PersonParams from '@/components/PersonParams'
import SearchInput from '@/components/SearchInput'
import FormSelect from '@/components/FormSelect'
import FormButton from '@/components/FormButton'
import searchIcon from '@/assets/svg/search.svg'
import fireIcon from '@/assets/svg/fire.svg'
import addIcon from '@/assets/svg/add.svg'
import { UserService } from '@/services/UserService'
import { RequestsService } from '@/services/RequestsService'
import MessageBox from '@/components/shared/MessageBox'
import { bus } from '@/bus'
import { privilegesMixin } from '@/mixins'
import {isProduction} from '@/constants'

export default {
  name: 'Requests',
  mixins: [privilegesMixin],
  components: {
    Preloader,
    PersonParams,
    SearchInput,
    FormSelect,
    FormButton,
    MessageBox,
    requestMessage
  },
  data () {
    return {
      isProduction,
      fromConstructor: {
        dog101: null,
        dog100: null,
        error: null
      },
      showMessageBox: false,
      searchIcon,
      fireIcon,
      addIcon,
      showCreateRequest: false,
      showAddPositionModal: false,
      isFetchingData: false,
      bookingLinit: {},
      bookingReport: {},
      loader: false,
      showPartsModal: false,
      showCPModal: false,
      showViewModal: false,
      showBPZModal: false,
      widgetShow: false,
      currentReqest: {},
      productDataAction: {},
      arrRequests: [],
      filteredData: [],
      requestsShow: 20,
      lastKey101: 0,
      modalData: {
        provider: {},
        payer: {},
        items: []
      },
      searchManagers: [],
      // Поиск
      hotReserve: false,
      booking: 0,
      managerId: 0,
      searchInputValue: '',
      cardAction: false,
      addAction: false,
      deleteAction: false,
      newItemId: 0,
      itemId: null,
      currentItem: 0,
      searchSelectValue: '',
      // Для конструктора
      toConstructor: {
        dog101: 0,
        dog100: 0
      }
    }
  },
  created () {
    this.getRequest()
    this.getManagers()
    this.getBookingLimit()
    if (window.dog101 && window.dog101 > 0) {
      window.dog101 = Number(window.dog101)
      this.fromConstructor.dog101 = window.dog101
    }
    if (window.dog100 && window.dog100 > 0) {
      window.dog100 = Number(window.dog100)
      this.fromConstructor.dog100 = window.dog100
    }
    if (window.error && window.error !== null) {
      window.error = String(window.error)
      this.fromConstructor.error = window.error
      this.showMessageBox = true
    } else {
      this.showMessageBox = false
    }
  },
  computed: {
    formAction () {
      return isProduction ? '/constructor' : 'https://test-adjutant.1gb.ru/constructor'
    },
    getErrorNumber () {
      let data = this.filteredData
      return this.$_.filter(data, (item) => {
        return item.id === this.fromConstructor.dog101
      })
    },
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
        if (this.addAction) {
          data = this.arrRequests
        }
        if (this.deleteAction) {
          data = this.filteredData
          return this.$_.filter(data, (item) => {
            return item.id !== Number(this.itemId)
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
    callback (result) {
      if (result) {
        if (result === 'Chat') {
          bus.$emit('show', true)
          this.showMessageBox = false
          this.widgetShow = true
        }
      }
    },
    onSearchInput () {
      this.requestsShow = 20
      this.addAction = false
      this.deleteAction = false
      this.filteredData = []
      this.lastKey101 = 0
      this.hotReserve = false
      this.booking = 0
      this.getRequest()
    },
    onSearchSelect (id) {
      this.managerId = id
      this.requestsShow = 20
      this.addAction = false
      this.deleteAction = false
      this.filteredData = []
      this.lastKey101 = 0
      this.searchInputValue = ''
      this.hotReserve = false
      this.booking = 0
      this.getRequest()
    },
    onBookingButton () {
      this.hotReserve = !this.hotReserve
      this.hotReserve ? this.booking = 1 : this.booking = 0
      this.requestsShow = 20
      this.addAction = false
      this.deleteAction = false
      this.filteredData = []
      this.lastKey101 = 0
      this.searchInputValue = ''
      this.getRequest()
    },
    showAllOrders () {
      this.requestsShow = 20
      this.deleteAction = false
      this.addAction = false
      this.lastKey101 = this.getLastKey
      this.getRequest({lastKey101: this.lastKey101, select: this.managerId})
    },
    addRequest () {
      this.addAction = true
      this.deleteAction = false
      this.cardAction = false
      this.searchInputValue = ''
      this.query = ''
      this.requestsShow = 20
      this.lastKey101 = 0
      this.showCreateRequest = true
    },
    deleteRequest (item) {
      this.searchInputValue = ''
      this.deleteAction = true
      this.addAction = false
      this.lastKey101 = 0
      this.itemId = item.id
    },
    updateRequest (item, index) {
      this.currentItem = index
      this.query = item.number
      this.requestsShow = 1
      if (this.deleteAction) {
        this.deleteAction = false
        this.currentItem = index - 1
      } else {
        this.currentItem = index
      }
      if (index > 0) {
        this.lastKey101 = this.filteredData[index - 1].id
      } else {
        this.lastKey101 = 0
      }
    },
    showParts (item) {
      this.getAccessories(item.id)
        .then(() => {
          this.showPartsModal = true
        })
        .catch(() => console.log('error'))
    },
    showCP (item) {
      this.getKP(item.id).then((res) => {
        this.showCPModal = true
        this.currentReqest = item
        this.currentReqest.image = res.image
      }).catch(() => console.log('error'))
    },
    showView (item) {
      this.modalData = item
      this.showViewModal = true
    },
    showBPZ (item) {
      this.modalData = item
      this.showBPZModal = true
    },
    actionProduct (obj) {
      if (obj.item && obj.item.isFromConstructor === 1) {
        console.log('obj.item', obj.item)
        this.toConstructor.dog101 = obj.dog101
        this.toConstructor.dog100 = obj.numProduct
        let form = this.$refs.form
        setTimeout(() => { form.submit() }, 500)
      } else {
        this.query = obj.order
        this.productDataAction = obj
        this.showAddPositionModal = true
      }
    },
    actionCard (obj) {
      this.query = obj.order
      this.productDataAction = obj
      this.showAddPositionModal = true
    },
    passToConstructor (event) {
      let formData = new FormData(event.target)
      let object = {}
      formData.forEach((value, key) => { object[key] = value })
    },
    getRequest (params = {
      count: this.requestsShow,
      lastKey101: this.lastKey101,
      select: this.managerId,
      booking: this.booking,
      query: this.searchInputValue
    }) {
      this.isFetchingData = true

      return RequestsService.getRequests(params)
        .then((data) => {
          this.arrRequests = data
        })
        .catch(e => console.error('error getting requests', e))
        .finally(() => {
          this.filteredData = this.getFilteredData
          this.isFetchingData = false
        })
    },
    getManagers () {
      UserService.getOrganizationUsers().then(users => {
        this.searchManagers = [{ id: 0, name: 'Все менеджеры' }, ...users.map(v => ({ id: v.id, name: v.name }))]
      })
        .catch(e => console.error('error getting managers', e))
    },
    getAccessories (id) {
      this.isFetchingData = true
      return RequestsService.getAccessoriesForRequest(id)
        .then((data) => {
          this.modalData = data
        })
        .catch(e => console.error('error getting accessories', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getBookingLimit () {
      return RequestsService.getBookingLimit()
        .then((data) => {
          this.bookingLinit = data
        })
        .catch(e => console.error('error getting accessories', e))
        .finally(() => {
        })
    },
    getBookingReport () {
      return window.open('https://adjutant.ru/dilerzoneajax/siteBronOrg/all', '_blank') // TODO опять ссылки захардкоженные :((
    },
    getKP (id) {
      this.isFetchingData = true
      return RequestsService.getKP(id)
        .then((data) => {
          this.modalData = data.items
          return data
        })
        .catch(e => console.error('error getting accessories', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    setLoader (arg) {
      this.$set(this, 'isFetchingData', arg)
    }
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

.requests {
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
  &-add {
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    padding: 10px;
    font-size: 14px;
    box-shadow: 0 4px 6px -3px rgba(0, 0, 0, 0.2);

    .icon-svg {
      width: 20px;
      height: 20px;
      fill: #9d9e9e;
      margin-right: 8px;
    }
    &:hover {
      background-color: #f0f0f0;
      .icon-svg {
        fill: #ff7436;
      }
    }
    & span {
      line-height: 0.5;
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
