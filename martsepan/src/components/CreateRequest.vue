<template>
  <Modal size="lg" :active="active" @modalClosed="$emit('modalClosed', false)" :close-on-click-outside="false">
    <div class="createRequest">
      <div class="createRequest-section">
        <h2 class="createRequest-title">Создание нового запроса</h2>
        <div class="row">
          <div class="col-sm-7 col-lg-6">
            <FormGroup label="Название" for="orderName" class="createRequest-field">
              <FormInput :disabled="disabledInputs" slot="input" name="orderName" placeholder="Введите название запроса" id="orderName"
                         v-model="orderName"></FormInput>
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-7 col-lg-6">
            <FormGroup label="ЮЛ Заказчика" for="customer" class="createRequest-field">
              <FormSelect :disabled="disabledInputs" slot="input" id="customer" v-model="customer" name="customer"
                          :options="arrCustomer"></FormSelect>
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-7 col-lg-6">
            <FormGroup label="ЮЛ Поставщика" for="provider" class="createRequest-field">
              <FormSelect :disabled="disabledInputs" slot="input" id="provider" v-model="provider" name="provider"
                          :options="arrProvider"></FormSelect>
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3 createRequest-firstStepButton" :class="{'_hide': step !== 0}">
            <div v-if="step === 0 && showLoader">
              <Spinner></Spinner>
            </div>
            <!--<FormButton type="solid" :disabled="firstStepButtonDisabled" @click="step = 1" @clcik="setRequest">Создать</FormButton>-->
            <FormButton v-if="step === 0 && !showLoader" type="solid" :disabled="firstStepButtonDisabled" @click="setRequest">Создать</FormButton>
          </div>
        </div>
      </div>
      <template v-if="step !== 0">
        <addPosition :dataAction="productDataAction" :existingPerson="productDataAction" :createRequest="'createRequest'" @getRequest="getRequest"
                     @modalClosed="modalClosed" @setLoader="$emit('setLoader', true)"></addPosition>
      </template>
    </div>
  </Modal>
</template>

<script>
import Spinner from '@/components/shared/Spinner'
import CreatePersonals from '@/components/CreatePersonals'
import PersonParams from '@/components/PersonParams'
import walletIcon from '@/assets/svg/wallet.svg'
import boxIcon from '@/assets/svg/box.svg'
import completeIcon from '@/assets/svg/complete.svg'
import { ARR_PROVIDER } from '@/constants.js'
import { UserService } from '@/services/UserService'
import { RequestsService } from '@/services/RequestsService'

export default {
  name: 'createRequest',
  components: {
    Spinner,
    CreatePersonals,
    PersonParams
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ARR_PROVIDER,
      walletIcon,
      completeIcon,
      boxIcon,
      isFetchingData: false,
      orderName: '',
      newRequestNumber: '',
      newRequestdog100: '',
      showAddPositionModal: true,
      productDataAction: {
        action: 'create',
        dog101: 0,
        order: 0
      },
      step: 0,
      showLoader: false,
      customers: [],
      suppliers: [],
      customer: '',
      provider: '',
      supplier: 'ООО "ПОНИ"',
      activeTab: 0,
      treeItems: [],
      productsNumber: 0,
      wrappings: [],
      lodgementMaterials: [],
      lodgements: [],
      wrappingMaterials: [],
      wrapping: '',
      lodgementMaterial: '',
      lodgement: '',
      wrappingMaterial: '',
      userData: {},
      arrCustomer: []
    }
  },
  computed: {
    disabledInputs () {
      return this.step !== 0
    },
    firstStepButtonDisabled () {
      return !(this.orderName && this.customer && this.provider)
    },
    arrProvider () {
      let vm = this
      for (let i = 0; i < this.arrCustomer.length; i++) {
        if (vm.customer === vm.arrCustomer[i].id) {
          if (vm.arrCustomer[i].only_pony === 0) {
            return ARR_PROVIDER
          } else {
            vm.provider = ARR_PROVIDER[1].id
            return [ARR_PROVIDER[1]]
          }
        }
      }
    }
  },
  created () {
    this.getRequestData().then(() => {
      this.arrCustomer = this.userData.items.slice()
      this.customer = this.arrCustomer[0].id
      this.provider = this.arrProvider[0].id
    })
  },
  methods: {
    onInput (e) {
      console.log(e)
    },
    onClick (action) {
      if (action === 'close') {
        this.$emit('getRequest')
        this.$emit('modalClosed', false)
      }
    },
    setRequest () {
      this.showLoader = true
      let vm = this
      let idManager = ''
      this.arrCustomer.forEach(function (el) {
        if (el.id === vm.customer) {
          idManager = el.idManager
        }
      })
      this.addRequest({
        'name': this.orderName,
        'idOrg': this.customer,
        'grOtprav': this.provider,
        'idLogin': this.userData.idLogin,
        'idManager': idManager
      }).then((data) => {
        if (data) {
          this.showLoader = false
          this.newRequestNumber = data[2]
          this.newRequestdog100 = data[3]
          this.productDataAction['action'] = 'create'
          this.productDataAction['dog101'] = this.newRequestdog100
          this.productDataAction['order'] = this.newRequestNumber
          this.step = 1
          this.$parent.newItemId = Number(this.newRequestNumber)
        } else {
          console.log('error')
        }
      })
    },
    addRequest ({ name, idOrg, grOtprav, idLogin, idManager }) {
      const params = {
        name: name,
        idOrg: idOrg,
        idManager: idManager,
        idLogin: idLogin,
        grOtprav: grOtprav
      }
      this.$emit('setLoader', true)
      return RequestsService.createRequest(params)
        .then((data) => {
          return data
        })
        .catch(e => console.error('error creating request', e))
        .finally(() => {
          this.isFetchingData = false
          this.$emit('getRequest')
        })
    },
    getRequestData () {
      this.isFetchingData = true
      return UserService.getUserIdAndEntities()
        .then(data => {
          this.userData = data
        })
        .catch(e => console.error('error getting user entities', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getRequest () {
      this.$emit('getRequest')
    },
    modalClosed () {
      this.$emit('modalClosed')
    }
  }
}
</script>

<style lang="scss" scoped>
.createRequest {
  /*padding-bottom: 30px;*/
  $this: &;
  &-title {
    font-size: 32px;
    font-family: $fontHeading;
    margin-bottom: 25px;
    font-weight: 400;
  }
  /deep/ &-field {
    margin-bottom: 20px;
  }
  /deep/ &-field {
    margin-bottom: 20px;
  }
  /deep/ #orderName::placeholder {
    color: #9d9e9e;
  }
  &-firstStepButton {
    padding-top: 10px;
    margin-left: 120px;
    margin-bottom: 5px;
    &._hide{
      padding-bottom: 30px;
    }
  }
  &-section {
    /*margin-bottom: 30px;*/
    &-header {
      @include createGrid(10px);
      flex-wrap: wrap;
      align-items: baseline;
      margin-bottom: 15px;
      & > * {
        margin-bottom: 10px;
      }

      #{$this} {
        &-title {
          margin-bottom: 0;
        }
      }

      &-link {
        font-size: 13px;
      }
    }
  }
  &-tabsGrid {
    @include createGrid(10px);
    &-item {
      &:nth-child(1) {
        flex: 0 0 auto;
        padding-right: 20px;
      }
      &:nth-child(2) {
        flex: 1 1 auto;
      }
      &:nth-child(3) {
        flex: 1 1 auto;
      }
      &:nth-child(4) {
        flex: 1 1 auto;
      }
    }
  }
  &-art {
    margin-left: 10px;
    color: #000;
    font-weight: 500;
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    &-firstStepButton {
      margin-left: 0;
    }
    &-field {
      margin-bottom: 30px;
    }

    &-tabsGrid {
      flex-wrap: wrap;
      &-item {
        width: 33.33%;
        &:first-child {
          width: 100%;
          padding-right: 5px;
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>
