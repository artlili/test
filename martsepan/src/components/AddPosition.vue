<template>
  <div class="addPosition">
    <template v-if="!showEditPerson">
      <div class="addPosition-section">
        <div class="addPosition-section-header">
          <h2 class="addPosition-title">
            <span v-if="dataAction.action === 'create'">Добавьте новую позицию в запрос</span>
            <span v-if="dataAction.action === 'edit'">Редактировать позицию в запросе</span>
            №{{dataAction.order}}
            <a href="#" v-if="createRequest" @click.prevent="createEmptyRequest">Создать
              пустой запрос</a>
          </h2>
        </div>
      </div>
      <div class="addPosition-section">
        <div class="addPosition-tabsGrid">
          <div class="addPosition-tabsGrid-button"
               :class="'_' + dataAction.action">
            <form :action="formAction"
                  method="post"
                  @submit="passToConstructor($event)">
              <input type="hidden" name="dog101" v-model="dog101">
              <input type="hidden" name="dog100" v-model="dog100">
              <button type="submit" class="button-submit"
                      :class="{'disabled': !isFromConstructor}"
                      :disabled="!isFromConstructor">
                Перейти в конструктор
                <span class="button-submit-subtext">изделия планирования</span>
                <span class="help-text">Только для изделий созданных в конструкторе</span>
              </button>
            </form>
          </div>
          <div class="addPosition-tabsGrid-item" :class="{'_disable': !activatedTabs}"
               v-if="dataAction.action === 'create'">
            <Tab text="Ежедневники" subtext="FreeStyle" :icon="productIcon" :active="activeTab === 1"
                 @click="onClickTab(1)"></Tab>
          </div>
          <div class="addPosition-tabsGrid-item"
               v-if="activeTab === 1 && dataAction.action === 'edit'">
            <Tab text="Ежедневники" subtext="FreeStyle" :icon="productIcon" :active="activeTab === 1"></Tab>
          </div>
          <div class="addPosition-tabsGrid-item" :class="{'_disable': !activatedTabs}"
               v-if="dataAction.action === 'create'">
            <Tab text="Деловая галантерея" subtext="FreeStyle" :icon="walletIcon" :active="activeTab === 3"
                 @click="onClickTab(3)"></Tab>
          </div>
          <div class="addPosition-tabsGrid-item"
               v-if="activeTab === 3 && dataAction.action === 'edit'">
            <Tab text="Деловая галантерея" subtext="FreeStyle" :icon="walletIcon" :active="activeTab === 3"></Tab>
          </div>
          <div class="addPosition-tabsGrid-item" :class="{'_disable': !activatedTabs}"
               v-if="dataAction.action === 'create'">
            <Tab text="Complete" subtext="Freestick, Календари, Деловая галантерея" :icon="completeIcon"
                 :active="activeTab === 8" @click="onClickTab(8)"></Tab>
          </div>
          <div class="addPosition-tabsGrid-item"
               v-if="activeTab === 8 && dataAction.action === 'edit'">
            <Tab text="Complete" subtext="Freestick, Календари, Деловая галантерея" :icon="completeIcon"
                 :active="activeTab === 8"></Tab>
          </div>
        </div>
      </div>
    </template>
    <template v-if="activeTab !== 0">
      <div class="addPosition-section grids" v-if="activeTab === 1 && !showEditPerson">

        <!-- GRID-1 -->
        <div class="grid">
          <div class="row">
            <div class="col-xs-8 mob-col">
              <FormGroup label="Блок" for="block" class="addPosition-field">
                <FormSelect slot="input" id="block"
                            :value="block"
                            @input="selectBlock({'id': $event, 'click': true})"
                            name="block"
                            :disabled="selectDiariesBlocks"
                            :options="arrBlocks"></FormSelect>
              </FormGroup>
            </div>
            <div v-if="block" class="avaible">
              Свободно блоков: <span>{{blocksAvailable}}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-8 mob-col">
              <FormGroup label="Обложка" for="cover" class="addPosition-field">
                <FormSelect slot="input" id="cover"
                            :value="cover"
                            @input="selectCover({'id': $event, 'click': true})"
                            name="cover"
                            :disabled="selectDiariesCovers"
                            :options="arrCovers"></FormSelect>
              </FormGroup>
            </div>
          </div>
        </div><!-- End GRID-1 -->

        <!-- GRID-2 -->
        <div class="grid">
          <div class="row">
            <div class="col-xs-8 mob-col">
              <FormGroup label="Сшивка" for="stitching" class="addPosition-field">
                <FormSelect slot="input" id="stitching"
                            :value="stitching"
                            :emptyField="true"
                            @input="selectStitching({'id': $event, 'click': true})"
                            name="stitching"
                            :disabled="selectDiariesStitchings"
                            :options="arrStitchings"></FormSelect>
              </FormGroup>
            </div>
          </div>
        </div><!-- End GRID-2 -->

        <!-- GRID-STR -->
        <div class="grid-stitchings">
          <Stitchings v-show="stitchingBlock"
                      :getStitchingsFrame="getStitchingsFrame"
                      :arrBlocks="arrBlocks"
          ></Stitchings>
        </div><!-- End GRID-STR -->

        <!-- GRID-3 -->
        <div class="grid">
          <template v-if="stitchingBlock === false">
            <div class="row">
              <div class="col-xs-8 mob-col">
                <FormGroup label="Материал" for="material" class="addPosition-field">
                  <FormSelect slot="input" id="material"
                              :value="material"
                              @input="selectMaterial({'id': $event, 'click': true})"
                              name="material"
                              :disabled="selectDiariesMaterials"
                              :options="arrMaterials"></FormSelect>
                </FormGroup>
              </div>
              <div v-if="color && material" class="avaible">
                Свободно материала: <span>{{Number(materialAvailable)}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-8 mob-col">
                <FormGroup label="Цвет" for="color" class="addPosition-field">
                  <FormSelect slot="input" id="color"
                              :value="color"
                              @input="selectColor({'id': $event, 'click': true})"
                              name="color"
                              :disabled="selectDiariesColors"
                              :options="arrColors"></FormSelect>
                </FormGroup>
              </div>
            </div>
          </template>
        </div><!-- End GRID-3 -->

        <!-- GRID-3 -->
        <div class="grid">
          <template v-if="stitchingBlock">
            <div v-for="(item, index) in materialsStitching" :key="'m' + (index + 1)">
              <div class="row">
                <div class="col-xs-8 mob-col">
                  <FormGroup :label="'Материал_' + index" :for="'material' + index" class="addPosition-field">
                    <FormSelect slot="input" :id="'material' + index"
                                :value="materialsStitching[index]"
                                @input="selectMaterialStitching({'id': $event, 'click': true, 'index': index})"
                                :name="'material_' + index"
                                :disabled="selectDiariesStitchingMaterials"
                                :options="arrMaterialsStitching"></FormSelect>
                  </FormGroup>
                </div>
                <div v-if="materialsStitching[index] && colorsStitching[index]" class="avaible">
                  Свободно материала: <span>{{Number(materialStitchingAvailable[index - 1])}}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-8 mob-col">
                  <FormGroup :label="'Цвет_' + index" :for="'color' + index" class="addPosition-field">
                    <FormSelect slot="input" :id="'color' + index"
                                :value="colorsStitching[index]"
                                @input="selectColorStitching({'id': $event, 'click': true, 'index': index})"
                                :name="'color_' + index"
                                :disabled="selectDiariesStitchingColors"
                                :options="arrColorsStitching[index]"></FormSelect>
                  </FormGroup>
                </div>
              </div>
            </div>
            <div v-for="(item, index) in arrStitchings" :key="'o' + index">
              <div v-if="stitching === item.id">
                <div class="row" v-if="item.param_name_1">
                  <div class="col-xs-8 mob-col">
                    <FormGroup :label="item.param_name_1" for="param_name_1"
                               class="addPosition-field">
                      <FormInput slot="input" type="number"
                                 name="productsNumber" id="param_name_1"
                                 v-model="paramsStitching[1]"></FormInput>
                    </FormGroup>
                  </div>
                </div>
                <div class="row" v-if="item.param_name_2">
                  <div class="col-xs-8 mob-col">
                    <FormGroup :label="item.param_name_2" for="param_name_2"
                               class="addPosition-field">
                      <FormInput slot="input" type="number"
                                 name="productsNumber" id="param_name_2"
                                 v-model="paramsStitching[2]"></FormInput>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            <!-- isdopmat -->
            <div v-if="stitchingData.Isdopmat">
              <div class="row">
                <div class="col-xs-8 mob-col">
                  <FormGroup label="Внутренний материал" for="innerMaterial" class="addPosition-field">
                    <FormSelect slot="input" id="innerMaterial"
                                :value="innerMaterial"
                                @input="selectInnerMaterial($event)"
                                name="innerMaterial"
                                :options="arrMaterialsStitching"></FormSelect>
                  </FormGroup>
                  <FormGroup label="Цвет внутреннего материала" for="innerMaterialColor" class="addPosition-field">
                    <FormSelect slot="input" id="innerMaterial"
                                v-model="innerMaterialColor"
                                name="innerMaterialColor"
                                :options="innerMaterialColors"></FormSelect>
                  </FormGroup>
                </div>
              </div>
            </div><!-- end -->
          </template>
          <div class="row align-items-end align-items-sm-center">
            <div class="col-xs-3">
              <FormGroup label="Тираж, шт." for="productsNumber">
                <AutoInput class="input_number"
                           slot="input" name="number"
                           id="number" :min="minProductsNumber"
                           :disabled="showDiariesProductsNumber"
                           v-model="number"></AutoInput>
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="addPosition-section grids" v-if="activeTab === 3 && !showEditPerson">
        <div class="grid">
          <div class="row">
            <div class="col-xs-8 mob-col">
              <FormGroup label="Изделие" for="product" class="addPosition-field">
                <FormSelect slot="input" id="product"
                            :value="blockBusiness"
                            @input="selectBlockBusiness({'id': $event, 'click': true})"
                            name="product"
                            :disabled="selectBusinessBlocks"
                            :options="arrBlocks"></FormSelect>
              </FormGroup>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-8 mob-col">
              <FormGroup label="Материал" for="materialBusiness" class="addPosition-field">
                <FormSelect slot="input" id="materialBusiness"
                            :value="materialBusiness"
                            @input="selectMaterialBusiness({'id': $event, 'click': true})"
                            name="materialBusiness"
                            :disabled="selectBusinessMaterials"
                            :options="arrMaterials"></FormSelect>
              </FormGroup>
            </div>
            <div v-if="materialBusiness && colorBusiness" class="avaible">
              Свободно материала: <span>{{Number(materialBusinessAvailable)}}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-8 mob-col">
              <FormGroup label="Цвет" for="colorBusiness" class="addPosition-field">
                <FormSelect slot="input" id="colorBusiness"
                            :value="colorBusiness"
                            @input="selectColorBusiness({'id': $event, 'click': true})"
                            name="colorBusiness"
                            :disabled="selectBusinessColors"
                            :options="arrColors"></FormSelect>
              </FormGroup>
            </div>
          </div>
          <div class="row align-items-end align-items-sm-center">
            <div class="col-xs-3">
              <FormGroup label="Тираж, шт." for="numberBusiness">
                <AutoInput class="input_number"
                           slot="input" name="numberBusiness"
                           id="numberBusiness"
                           :min="minProductsNumber"
                           :disabled="showBusinessProductsNumber"
                           v-model="numberBusiness"></AutoInput>
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="addPosition-section grids" v-if="activeTab === 8 && !showEditPerson">
        <div class="grid">
          <div class="row">
            <div class="col-xs-8 mob-col">
              <FormGroup label="Изделие" for="blockComplete" class="addPosition-field">
                <FormSelect slot="input" id="blockComplete"
                            :value="blockComplete"
                            @input="selectBlockComplete({'id': $event, 'click': true})"
                            name="blockComplete"
                            :disabled="selectCompleteBlocks"
                            :options="arrBlocks"></FormSelect>
              </FormGroup>
            </div>
            <div v-if="blockComplete" class="avaible">
              Свободно изделий : <span>{{Number(blockCompleteAvailable)}}</span>
            </div>
          </div>
          <div class="row align-items-center">
            <div class="col-xs-8">
              <FormGroup label="Тираж, шт." for="numberComplete">
                <AutoInput class="input_number"
                           slot="input"
                           name="numberComplete"
                           id="numberComplete"
                           :min="minProductsNumber"
                           :disabled="selectCompleteBlocks"
                           v-model="numberComplete"></AutoInput>
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
      <div class="addPosition-section addPosition-personals">
        <div class="row" v-show="!showPersonParams && !showEditPerson">
          <div class="col-sm-6 addPosition-personals-item">
            <div class="addPosition-personals-title _arrow">
              <span>Добавить персонализации</span>
            </div>
            <TreeList :items="arrPersonals" @itemAdded="onItemAdded($event)"></TreeList>
          </div>
          <div class="col-sm-6 addPosition-personals-item">
            <div class="addPosition-personals-title">
              Персонализации на изделии
            </div>
            <TreeList :items="listItems" @itemRemoved="onItemRemoved($event)" type="list"></TreeList>
          </div>
        </div>
        <div class="row" v-if="showPersonParams">
          <div class="col-sm-12">
            <PersonParams @personAdded="onPersonAdded($event)" @cancel="onCancel($event)"
                          :name="editedPersonal.name" :item="editedPersonal" :action="showEditPerson"
                          :params="arrPersonParamPossible"></PersonParams>
          </div>
        </div>
      </div>
      <div class="addPosition-section" v-if="!showPersonParams">
        <div class="row">
          <div class="col-sm-4 col-lg-3">
            <FormButton :disabled="addBtnDisabled" v-if="dataAction.action === 'create'" type="solid" @click="onAddPosition">Добавить изделие
            </FormButton>
            <FormButton :disabled="addBtnDisabled" v-if="dataAction.action === 'edit'" type="solid" @click="onAddPosition">Сохранить</FormButton>
          </div>
          <span v-if="dataAction.action === 'edit'">Изменения приведут к снятию брони с позиции, после редактирования не забудьте забронировать материалы снова</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Stitchings from '@/components/Stitchings'
import PersonParams from '@/components/PersonParams'
import productIcon from '@/assets/svg/product.svg'
import walletIcon from '@/assets/svg/wallet.svg'
import completeIcon from '@/assets/svg/complete.svg'
import { Personal, createPostParams } from '@/helpers'
import { RequestsService } from '@/services/RequestsService'
import AutoInput from '@/components/AutoInput'
import {MIN_PRODUCTS_NUMBER_DEFAULT, isProduction} from '@/constants'

export default {
  name: 'addPosition',
  components: {
    PersonParams,
    AutoInput,
    Stitchings
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    dataAction: {
      action: {
        type: String,
        default: ''
      },
      order: {
        type: String,
        default: ''
      },
      dog101: {
        type: String,
        default: ''
      },
      itemPersonals: {
        type: Array,
        default: ''
      },
      numProduct: {
        type: String,
        default: ''
      },
      item: {
        type: Object,
        default: {}
      }
    },
    createRequest: {
      type: String
    }
  },
  data () {
    return {
      isProduction,
      productIcon,
      walletIcon,
      completeIcon,
      // Данные для построения изделия
      /* freestyle */
      idIzd: '',
      block: '',
      cover: '',
      stitching: '',
      material: '',
      color: '',
      number: 20,
      /* Деловая галантерея */
      blockBusiness: '',
      coverBusiness: '',
      materialBusiness: '',
      colorBusiness: '',
      numberBusiness: 20,
      /* Complete */
      blockComplete: '',
      numberComplete: 20,
      // Массивы для селектов
      arrBlocks: [],
      arrCovers: [],
      arrStitchings: [],
      arrMaterials: [],
      arrColors: [],
      // Массивы сохраненных селектов
      arrBlocksDiaries: [],
      arrCoversDiaries: [],
      arrBlocksBusiness: [],
      arrCoversBusiness: [],
      // Блокировка выбора селектов
      selectDiariesBlocks: true,
      selectDiariesCovers: true,
      selectDiariesStitchings: true,
      selectDiariesMaterials: true,
      selectDiariesColors: true,
      selectDiariesStitchingMaterials: true,
      selectDiariesStitchingColors: true,
      showDiariesProductsNumber: true,
      showBusinessProductsNumber: true,
      selectBusinessBlocks: true,
      selectBusinessCovers: true,
      selectBusinessMaterials: true,
      selectBusinessColors: true,
      selectCompleteBlocks: true,
      // Активация табов
      activatedTabs: false,
      // ----------------------------
      activeTab: 1, // 1 Изделия для планирования Freestyle, 3 Деловая галантерея, 8 Complete
      treeItems: [],
      listItems: [],
      showPersonParams: false,
      editedPersonal: new Personal(),
      editedPersonParam: [],
      editDataProduct: {},

      stitchingBlock: false, // скрыть/отобразить блок с материалами сшивки
      arrMaterialsStitching: [],
      arrColorsStitching: {},
      materialsStitching: {}, // обьект содержит индексы с id выбранных материалов (кол-во идексов = кол-во материала)
      colorsStitching: {}, // обьект содержит индексы с id выбранных цветов (кол-во идексов = кол-во материала)
      paramsStitching: { 1: 20, 2: 20 }, // обьект содержит индексы с id выбранных параметров (кол-во идексов = кол-во материала)
      arrPersonals: [], // массив содержит персонализации для изделия
      arrNewPersonals: [], // массив содержит персонализации для изделия
      arrDeletePersonals: [], // массив содержит персонализации для изделия
      arrAddedPersonals: [], // массив содержит персонализации добавленные изделия
      personParamPossible: {}, // обьект содержит параметры для персонализации
      arrPersonParamPossible: [], // массив содержит параметры для персонализации
      dog100: 0,
      dog101: this.dataAction.dog101,
      personParam: {}, // обьект содержит индексы с массивом параметров для персонализации
      savingPersonals: false,
      isFetchingData: false,
      innerMaterial: '',
      innerMaterialColors: [],
      innerMaterialColor: '',
      addBtnDisabled: true,
      // Изделие полученное из конструктора
      isFromConstructor: false
    }
  },
  created () {
    if (this.dataAction.action && this.dataAction.action === 'edit') {
      let vm = this
      this.getEditData(this.dataAction.numProduct).then(() => {
        let data = this.editDataProduct
        this.activeTab = data.productType
        if (this.activeTab === 1) {
          this.block = data.block
          this.cover = data.cover
          this.material = data.material
          this.color = data.color
          this.number = data.number
          this.stitching = data.stitching
          if (this.stitching > 1) {
            let countParam = ''
            this.stitchingBlock = true
            data.stitching_material.forEach(function (el, i) {
              if (el !== 0) {
                vm.$set(vm.materialsStitching, i + 1, el)
              }
            })
            data.stitching_color.forEach(function (el, i) {
              if (el !== 0) {
                vm.$set(vm.colorsStitching, i + 1, el)
              }
            })
            data.stitching_param.forEach(function (el, i) {
              if (el !== 0) {
                vm.paramsStitching[i + 1] = el
                countParam = +countParam + 1
              }
            })
            this.innerMaterial = data.material_backs
            this.innerMaterialColor = data.color_backs
          }
          this.dog100 = data.dog100upd
          this.dog101 = data.dog101
          this.onClickTab(1)
        } else if (this.activeTab === 3) {
          this.blockBusiness = data.block
          this.coverBusiness = data.cover
          this.materialBusiness = data.material
          this.colorBusiness = data.color
          this.numberBusiness = data.number
          this.dog100 = data.dog100upd
          this.dog101 = data.dog101
          this.onClickTab(3)
        } else if (this.activeTab === 8) {
          this.blockComplete = data.tmckey
          this.numberComplete = data.number
          this.dog100 = data.dog100upd
          this.dog101 = data.dog101
          this.onClickTab(8)
        }
        if (this.dataAction.itemPersonals) {
          this.listItems = this.dataAction.itemPersonals.filter((el) => el.AutoPerson !== 1)
        }
      })
    }
    if (this.dataAction.action && this.dataAction.action === 'create') {
      this.getBlocks(this.activeTab).then(() => {
        this.selectBlock()
      })
      this.isFromConstructor = true
    }
    if (this.dataAction.action && this.dataAction.action === 'editPerson') {
      this.editPerson({ item: this.dataAction.item, person: this.dataAction.person })
    }
    this.getParamsFromConstructor(this.dataAction.item)
  },
  computed: {
    formAction () {
      return isProduction ? '/constructor' : 'https://test-adjutant.1gb.ru/constructor'
    },
    getStitchingsFrame () {
      return {
        'block': this.block,
        'cover': this.cover,
        'innerMaterial': this.innerMaterial,
        'innerMaterialColors': this.innerMaterialColors,
        'innerMaterialColor': this.innerMaterialColor,
        'arrMaterialsStitching': this.arrMaterialsStitching,
        'arrColorsStitching': this.arrColorsStitching,
        'stitching': this.stitching,
        'material': this.material,
        'materialsStitching': this.materialsStitching,
        'colorsStitching': this.colorsStitching
      }
    },
    materialAvailable () {
      if (this.material && this.color && this.arrColors.length) {
        const result = this.arrColors.find(color => color.id === this.color)
        return result ? result.Free : this.arrColors[0].Free
      }
      return 0
    },

    blocksAvailable () {
      if (this.block && this.arrBlocks.length) {
        const result = this.arrBlocks.find(block => block.id === this.block)
        return result ? result.free : this.arrBlocks[0].free
      }
      return 0
    },

    blockBusinessAvailable () {
      if (this.blockBusiness && this.arrBlocks.length) {
        const result = this.arrBlocks.find(block => block.id === this.blockBusiness)
        return result ? result.free : 0
      }
      return 0
    },

    blockCompleteAvailable () {
      if (this.blockComplete && this.arrBlocks.length) {
        const blockComplete = this.blockComplete.toString()
        const result = this.arrBlocks.find(block => block.id === blockComplete)
        return result ? result.import_free : 'numberBusiness' + this.arrBlocks[0].import_free
      }
      return 0
    },

    materialStitchingAvailable () {
      if (this.stitchingBlock && this.materialsStitching) {
        let result = []
        if (this.dataAction.action === 'create') {
          return Object.keys(this.materialsStitching).map((key) => {
            for (let props in this.colorsStitching) {
              props = +props
              if (this.colorsStitching[key]) {
                result = this.arrColorsStitching[key].find(color => color.id === this.colorsStitching[key])
                return result ? result.Free : 0
              }
            }
          })
        } else {
          return Object.keys(this.materialsStitching).map((key) => {
            if (this.arrColorsStitching[key]) {
              result = this.arrColorsStitching[key].find(color => +color.id === +this.colorsStitching[key])
            } else return 0
            return result ? result.Free : 0
          })
        }
      }
    },

    materialBusinessAvailable () {
      if (this.materialBusiness && this.colorBusiness && this.arrColors.length) {
        for (let i = 0; i < this.arrColors.length; i++) {
          if (+this.arrColors[i].id === +this.colorBusiness) {
            return this.arrColors[i].Free
          }
        }
      } else return 0
    },

    minProductsNumber () {
      if (this.activeTab === 8 && this.completeData) {
        return Number(this.completeData.minNumber)
      }
      // TODO пока что минимальный тираж приходит в МАТЕРИАЛАХ , если сшивка - мы хз сколько тираж EDIT: накостылили
      if (this.materialData) {
        if (this.materialData.length) {
          return this.materialData.reduce((acc, item) => {
            if (+item.MinTirag > acc) {
              return item.MinTirag
            }
            return acc
          }, MIN_PRODUCTS_NUMBER_DEFAULT)
        }
        return +this.materialData.MinTirag
      } else {
        return MIN_PRODUCTS_NUMBER_DEFAULT
      }
    },
    materialData () {
      if (this.arrMaterials && this.arrMaterials.length) {
        if (this.stitching && this.materialsStitching) {
          // TODO костыль, если сшивки - будет не консистентный ретурн
          return Object.keys(this.materialsStitching).map((key) => {
            try {
              const result = this.arrMaterials[key].find(el => el.id === this.materialsStitching[key])
              return result || {}
            } catch (e) {
              return {}
            }
          })
        } else {
          return this.arrMaterials.find((el) => el.id === this.material)
        }
      }
      return {}
    },
    completeData () {
      if (this.arrBlocks && this.arrBlocks.length > 0) {
        return this.arrBlocks.find((el) => el.id === this.blockComplete)
      }
      return {}
    },
    blockData () {
      if (this.arrBlocks && this.arrBlocks.length > 0) {
        return this.arrBlocks.find((el) => el.id === this.block)
      }
      return {}
    },
    numMaterials () {
      if (this.stitchingData && this.stitchingData.numMaterials) {
        return this.stitchingData.numMaterials
      } else if (this.editDataProduct && this.editDataProduct.stitching_material) {
        let arr = this.editDataProduct.stitching_material.filter((el) => el !== 0)
        return arr.length
      }
    },
    stitchingData () {
      if (this.arrStitchings && this.arrStitchings.length > 0) {
        return this.arrStitchings.find((el) => el.id === this.stitching)
      }
      return {}
    },
    stitchingHasInnerMaterial () {
      return this.stitchingData.Isdopmat
    },
    showEditPerson () {
      return !!(this.dataAction.action && this.dataAction.action === 'editPerson')
    }
  },
  methods: {
    selectInnerMaterial (id = null) {
      let _id = id
      if (id === null) {
        _id = this.arrMaterialsStitching[0].id
        this.innerMaterial = _id
      } else {
        this.innerMaterial = id
      }
      this.getColorsStitching(_id).then(res => {
        this.innerMaterialColors = res
        this.innerMaterialColor = res[0].id
      })
    },
    createEmptyRequest () {
      this.$emit('getRequest')
      this.$emit('modalClosed', false)
    },
    onClickTab (id) {
      if (this.dataAction.action === 'create' && this.activatedTabs) {
        this.stitching = 0
        this.stitchingBlock = false
        this.listItems = []
        this.arrNewPersonals = []
        this.arrPersonals = []
        this.$set(this, 'activeTab', id)
      }
      if (this.activeTab === 1) {
        if (this.block === '') {
          // Создание позиции таб 1
          this.getBlocks(this.activeTab).then(() => {
            this.selectBlock()
          })
        } else {
          // Редактирование позиции таб 1
          this.selectAllArr({
            tab: 1,
            block: this.block,
            cover: this.cover,
            material: this.material,
            color: this.color,
            stitching: this.stitching,
            innerMaterial: this.innerMaterial
          })
        }
      } else if (this.activeTab === 3) {
        if (this.blockBusiness === '') {
          // Создание позиции таб 3
          this.getBlocks(this.activeTab).then(() => {
            this.selectBlockBusiness()
          })
        } else {
          // Редактирование позиции таб 3
          this.selectAllArr({
            tab: 3,
            block: this.blockBusiness,
            cover: this.coverBusiness,
            material: this.materialBusiness,
            color: this.colorBusiness
          })
        }
      } else if (this.activeTab === 8) {
        this.selectCompleteBlocks = true
        if (this.blockComplete === '') {
          // Создание позиции таб 8
          this.getComplete().then(() => {
            this.selectBlockComplete()
            this.selectCompleteBlocks = false
          })
        } else {
          // Редактирование позиции таб 8
          this.getComplete().then(() => {
            this.selectBlockComplete({id: this.blockComplete})
            this.selectCompleteBlocks = false
          })
        }
      }
    },
    editPerson ({ item, person }) {
      this.editedPersonal = person
      this.getEditedPersonParam(item.id, person.indexPerson).then((data) => {
        if (this.editedPersonParam.params && this.editedPersonParam.params.length) {
          this.arrPersonParamPossible = this.personParamPossible.params
          this.showPersonParams = true
        } else {
          this.$emit('getRequest')
          this.$emit('modalClosed', false)
          this.showMessageBox({ 'err': person.name }, 'noParam')
        }
      })
    },
    onItemAdded (item) {
      this.editedPersonal = item
      this.getPersonParam(item.id).then((data) => {
        if (data) {
          this.arrPersonParamPossible = this.personParamPossible.params
          this.showPersonParams = true
        } else {
          this.onPersonAdded({ 'person': item, 'action': 'add' })
        }
      })
    },
    onItemRemoved (item) {
      const i = this.listItems.findIndex(v => v === item)
      this.listItems.splice(i, 1)
      this.arrDeletePersonals.push(item)
      this.arrDeletePersonals.forEach((item) => {
        this.arrNewPersonals.forEach((n, key) => {
          if (item.id === n.id) {
            this.arrNewPersonals.splice(key, 1)
          }
        })
      })
    },
    onPersonAdded ({ action, person, param, work, workIds }) {
      let arrPromises = []
      if (action === 'add') {
        this.showPersonParams = false
        this.editedPersonal = new Personal()
        this.listItems.push(person)
        // нужно присылать работы в формате через ; только НЕ ВКЛЮЧЕННЫЕ, у которых будет false
        this.arrNewPersonals.push({ 'id': person.id, 'name': person.name, 'param': param, work, workIds })
      } else {
        this.arrPersonParamPossible.forEach((el, i) => {
          if (el.idparam !== 0) {
            arrPromises.push(this.sendEditedPersonParam({
              idVar: el.idvars + '=' + param[i],
              dog100: this.dataAction.item.id,
              index: person.indexPerson
            }))
          }
          if (el.idWork !== 0) {
            arrPromises.push(this.sendEditedWorkParam({
              dog100: this.dataAction.item.id,
              personIndex: person.indexPerson,
              workId: el.idWork,
              val: Number(work[i])
            }))
          }
        })
      }
      Promise.all(arrPromises).then((data) => {
        let err = false
        data.forEach((el) => {
          if (el[0] === 0) {
            this.$emit('modalClosed', false)
          } else {
            err = true
            this.$emit('modalClosed', false)
          }
        })
        if (err) {
          this.validateError(data)
        } else {
          if (data.length > 0) {
            if (Object.keys(work).length) {
              this.$emit('getRequest')
            }
          }
        }
      })
      this.$emit('getRequest')
    },
    validateError (data) {
      let err = data.filter((elem) => elem[0] !== 0)
      this.showMessageBox({ err }, 'changePerson')
    },
    showMessageBox ({ pos, err }, status) {
      if (status === 'changePerson') {
        this.$messageBox({
          type: 'error',
          'from': 'changePerson',
          errors: err
        })
      }
      if (status === 'noParam') {
        this.$messageBox({
          type: 'info',
          'from': 'noParam',
          errors: err
        })
      }
    },
    onCancel () {
      this.showPersonParams = false
      this.editedPersonal = new Personal()
      if (this.dataAction.action && this.dataAction.action === 'editPerson') {
        this.$emit('modalClosed', false)
      }
    },
    onAddPosition () {
      this.isFromConstructor = false
      this.addBtnDisabled = true
      let vm = this
      let parametrs = {}
      if (this.dataAction.item && this.dataAction.item.booking_status === 2) {
        if (this.dataAction.numProduct) {
          this.removeBooking(this.dataAction.numProduct)
        }
      }
      if (this.activeTab === 1) {
        if (this.stitching > 1) {
          parametrs = {
            'block': this.block,
            'cover': this.cover,
            'stitching': this.stitching,
            'material1': this.materialsStitching[1],
            'material2': this.materialsStitching[2],
            'material3': this.materialsStitching[3],
            'material4': this.materialsStitching[4],
            'color1': this.colorsStitching[1],
            'color2': this.colorsStitching[2],
            'color3': this.colorsStitching[3],
            'color4': this.colorsStitching[4],
            'paramvalue1': this.paramsStitching[1],
            'paramvalue2': this.paramsStitching[2],
            'qty': this.number
          }
          if (this.stitchingHasInnerMaterial) {
            parametrs.materialBacks = this.innerMaterial
            parametrs.colorBacks = this.innerMaterialColor
          }
        } else {
          parametrs = {
            'block': this.block,
            'material': this.material,
            'color': this.color,
            'cover': this.cover,
            'qty': this.number
          }
        }
      } else if (this.activeTab === 3) {
        parametrs = {
          'block': this.blockBusiness,
          'material': this.materialBusiness,
          'color': this.colorBusiness,
          'cover': this.coverBusiness,
          'qty': this.numberBusiness
        }
      } else if (this.activeTab === 8) {
        parametrs = {
          'tmckey': this.blockComplete,
          'qty': this.numberComplete
        }
      }

      this.addNewPosition(parametrs).then((data) => {
        if (data) {
          let arrPromise = []
          if (data[0] === 0 && data[1] === '') {
            vm.dog100 = data[2]
            //  Запросы на добавление персоналок
            if (this.arrNewPersonals.length > 0) {
              this.arrNewPersonals.forEach((el) => {
                let obj = {
                  param1: 0,
                  param2: 0,
                  param3: 0
                }
                let works = []
                for (let props in el.param) {
                  let val = el.param[props]
                  obj[`param${+props + 1}`] = val
                }
                for (let key in el.work) {
                  let val = el.work[key]
                  if (val === false) works.push(el.workIds[key])
                }
                arrPromise.push(vm.addNewPersonal({
                  'id': el.id,
                  'dog100': vm.dog100,
                  'param': obj,
                  works
                }))
              })
              //  Запросы на удаление персоналок
            }
            if (this.arrDeletePersonals.length > 0) {
              this.arrDeletePersonals.forEach(function (el) {
                arrPromise.push(vm.deletePersonal(
                  el.indexPerson,
                  vm.dog100
                ))
              })
            }
            Promise.all(arrPromise).then(values => {
              this.$emit('modalClosed', true)
              this.$emit('getRequest')
              this.addBtnDisabled = false
            }, reason => {
              console.error(reason)
            })
          }
        }
      })
    },
    showStitchingBlock () {
      this.stitchingBlock = true
      this.showDiariesProductsNumber = true
      this.selectDiariesStitchingMaterials = true
      this.selectDiariesStitchingColors = true
      this.materialsStitching = {}
      this.colorsStitching = {}
      for (let i = 1; i <= this.numMaterials; i++) {
        this.$set(this.materialsStitching, i, '')
        this.$set(this.colorsStitching, i, '')
      }
    },
    selectAllArr ({ tab, block, cover, material, color, stitching, innerMaterial = null } = {}) {
      if (this.dataAction.action === 'edit') {
        this.getBlocks(tab)
        this.getCovers(block)
        this.getMaterials(block, cover)
        this.getColors(material)
        this.getStitchings(block, cover)
        this.getPersonals({ block, cover, color, material })
        if (stitching) {
          this.getMaterialsStitching(block, cover)
          for (let i = 1; i <= this.numMaterials; i++) {
            this.getColorsStitching(this.materialsStitching[i]).then((data) => {
              this.$set(this.arrColorsStitching, i, data)
            })
          }
          if (innerMaterial !== null) {
            this.getColorsStitching(innerMaterial).then((data) => {
              this.innerMaterialColors = data
            })
          }
        }
      } else {
        this.getPersonals({ block, cover, color, material })
        if (this.activeTab === 1) {
          this.arrBlocks = this.arrBlocksDiaries
          this.arrCovers = this.arrCoversDiaries
          this.selectDiariesBlocks = false
          this.selectDiariesCovers = false
          this.selectDiariesStitchings = false
          this.selectDiariesMaterials = false
          this.selectDiariesColors = false
          this.selectDiariesStitchingMaterials = false
          this.selectDiariesStitchingColors = false
          this.showDiariesProductsNumber = false
        } else if (this.activeTab === 3) {
          this.arrBlocks = this.arrBlocksBusiness
          this.arrCovers = this.arrCoversBusiness
          this.selectBusinessBlocks = false
          this.selectBusinessMaterials = false
          this.selectBusinessColors = false
          this.showBusinessProductsNumber = false
        }
      }
    },
    // Выбор Блока FreeStyle
    selectBlock ({ id = 0, click = false } = {}) {
      if (!click) {
        this.block = this.arrBlocks[0].id
      } else {
        this.block = id
      }
      this.getCovers(this.block).then(() => {
        this.selectCover()
      })
      this.stitching = 0
      this.arrStitchings = []
      this.stitchingBlock = false
    },
    selectCover ({ id = 0, click = false } = {}) {
      if (!click) {
        this.cover = this.arrCovers[0].id
      } else {
        this.cover = id
      }
      this.getMaterials(this.block, this.cover).then(() => {
        this.selectMaterial()
      })
      this.getStitchings(this.block, this.cover)
      this.stitching = 0
      this.arrStitchings = []
      this.stitchingBlock = false
    },
    selectStitching ({ id = 0, click = false } = {}) {
      if (!click) {
        this.stitching = 0
      } else {
        this.stitching = id
        if (this.stitching > 0) {
          this.showStitchingBlock()
          this.getMaterialsStitching().then(() => {
            this.selectMaterialStitching()
            if (this.stitchingData.Isdopmat) {
              this.selectInnerMaterial()
            }
          })
          this.getPersonals({ block: this.block, cover: this.cover })
        } else {
          this.stitchingBlock = false
          this.getMaterials(this.block, this.cover).then(() => {
            this.selectMaterial()
          })
          this.getPersonals({ block: this.block, cover: this.cover, material: this.material, color: this.color })
        }
      }
    },
    selectMaterialStitching ({ id = 0, click = false, index = 0 } = {}) {
      if (!click) {
        for (let i = 1; i <= this.numMaterials; i++) {
          this.materialsStitching[i] = this.arrMaterialsStitching[0].id
          this.getColorsStitching(this.materialsStitching[i]).then((data) => {
            this.arrColorsStitching[i] = data
            this.selectColorStitching({ index: i })
          })
        }
      } else {
        this.materialsStitching[index] = id
        this.getColorsStitching(this.materialsStitching[index]).then((data) => {
          this.arrColorsStitching[index] = data
          this.selectColorStitching({ index: index })
        })
      }
    },
    selectColorStitching ({ id = 0, click = false, index = 0 } = {}) {
      if (!click) {
        this.colorsStitching[index] = this.arrColorsStitching[index][0].id
      } else {
        this.colorsStitching[index] = id
      }
    },
    selectMaterial ({ id = 0, click = false } = {}) {
      if (!click) {
        this.material = this.arrMaterials[0].id
      } else {
        this.material = id
      }
      this.getColors(this.material).then(() => {
        this.selectColor()
      })
      this.arrMaterials.forEach(item => {
        if (item.id === this.material) {
          this.number = item.MinTirag
        }
      })
    },
    selectColor ({ id = 0, click = false } = {}) {
      if (!click) {
        this.color = this.arrColors[0].id
      } else {
        this.color = id
      }
      if (this.stitching > 1) {
        this.getPersonals({ block: this.block, cover: this.cover })
      } else {
        this.getPersonals({ block: this.block, cover: this.cover, material: this.material, color: this.color })
      }
    },
    // Выбор деловой галантереи
    selectBlockBusiness ({ id = 0, click = false } = {}) {
      if (!click) {
        this.blockBusiness = this.arrBlocks[0].id
      } else {
        this.blockBusiness = id
      }
      this.getCovers(this.blockBusiness).then(() => {
        this.selectCoverBusiness()
      })
    },
    selectCoverBusiness ({ id = 0, click = false } = {}) {
      if (!click) {
        this.coverBusiness = this.arrCovers[0].id
      } else {
        this.coverBusiness = id
      }
      this.getMaterials(this.blockBusiness, this.coverBusiness).then(() => {
        this.selectMaterialBusiness()
      })
    },
    selectMaterialBusiness ({ id = 0, click = false } = {}) {
      if (!click) {
        this.materialBusiness = this.arrMaterials[0].id
      } else {
        this.materialBusiness = id
      }
      this.getColors(this.materialBusiness).then(() => {
        this.selectColorBusiness()
      })
      this.arrMaterials.forEach(item => {
        if (item.id === this.materialBusiness) {
          this.numberBusiness = item.MinTirag
        }
      })
    },
    selectColorBusiness ({ id = 0, click = false } = {}) {
      if (!click) {
        this.colorBusiness = this.arrColors[0].id
      } else {
        this.colorBusiness = id
      }
      this.getPersonals({ block: this.blockBusiness, cover: this.coverBusiness, material: this.materialBusiness, color: this.colorBusiness })
    },
    // Выбор Complete
    selectBlockComplete ({ id = 0, click = false } = {}) {
      if (!click) {
        if (!this.editDataProduct.tmckey) {
          this.blockComplete = this.arrBlocks[0].id
        } else {
          this.blockComplete = this.editDataProduct.tmckey
        }
      } else {
        this.blockComplete = id
      }
      this.getPersonals({complete: this.blockComplete})
    },
    // Получить данные для редактирования
    getEditData (id) {
      if (!this.isFetchingData) {
        return this.$http.get('/getAddEditPositionDefParam/' + id)
          .then(({ data }) => {
            if (data) {
              this.editDataProduct = data
            }
          })
          .catch(e => console.error(e))
          .finally(() => {
          })
      }
    },
    getBlocks (data) {
      this.selectDiariesBlocks = true
      this.selectBusinessBlocks = true
      this.activatedTabs = false
      this.isFetchingData = true
      return this.$http.get('/getAllBlockForZapros/' + data)
        .then(({ data }) => {
          if (data) {
            this.arrBlocks = data
          }
          if (this.activeTab === 1) {
            this.arrBlocksDiaries = data
            this.selectDiariesBlocks = false
          }
          if (this.activeTab === 3) {
            this.arrBlocksBusiness = data
            this.selectBusinessBlocks = false
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getCovers (block) {
      this.selectDiariesCovers = true
      this.selectDiariesStitchings = true
      this.selectDiariesStitchingMaterials = true
      this.selectDiariesStitchingColors = true
      this.selectDiariesMaterials = true
      this.selectDiariesColors = true
      this.selectBusinessCovers = true
      this.showDiariesProductsNumber = true
      this.showBusinessProductsNumber = true
      this.isFetchingData = true
      return this.$http.get('/getAllNodeForZapros/all/artBlock/' + block)
        .then(({ data }) => {
          if (data) {
            this.arrCovers = data
          }
          if (this.activeTab === 1) {
            this.arrCoversDiaries = data
            this.selectDiariesCovers = false
          }
          if (this.activeTab === 3) {
            this.arrCoversBusiness = data
            this.selectBusinessCovers = false
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getStitchings (block, cover) {
      this.selectDiariesStitchings = true
      this.selectDiariesStitchingMaterials = true
      this.selectDiariesStitchingColors = true
      this.selectDiariesMaterials = true
      this.selectDiariesColors = true
      this.showDiariesProductsNumber = true
      this.showBusinessProductsNumber = true
      this.isFetchingData = true
      return this.$http.get('/getAllShivka/all/artBlock/' + block + '/node/' + cover)
        .then(({ data }) => {
          if (data) {
            this.arrStitchings = data
            this.selectDiariesStitchings = false
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getMaterials (block, cover) {
      this.selectDiariesMaterials = true
      this.selectDiariesColors = true
      this.selectBusinessMaterials = true
      this.selectBusinessColors = true
      this.showDiariesProductsNumber = true
      this.showBusinessProductsNumber = true
      this.isFetchingData = true
      return this.$http.get('/getAllMaterialForZapros/all/artBlock/' + block + '/idNode/' + cover)
        .then(({ data }) => {
          if (data) {
            this.arrMaterials = data
          }
          if (this.activeTab === 1) {
            this.selectDiariesMaterials = false
          }
          if (this.activeTab === 3) {
            this.selectBusinessMaterials = false
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getMaterialsStitching () {
      this.selectDiariesStitchingMaterials = true
      this.selectDiariesStitchingColors = true
      this.selectDiariesColors = true
      this.showDiariesProductsNumber = true
      this.showBusinessProductsNumber = true
      this.isFetchingData = true
      return this.$http.get('/getAllMaterialForShivka/all')
        .then(({ data }) => {
          if (data) {
            this.arrMaterialsStitching = data
            this.selectDiariesStitchingMaterials = false
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getColors (material) {
      this.selectDiariesStitchingColors = true
      this.selectDiariesColors = true
      this.selectBusinessColors = true
      this.showDiariesProductsNumber = true
      this.showBusinessProductsNumber = true
      this.isFetchingData = true
      return this.$http.get('/getAllColorForZapros/' + material)
        .then(({ data }) => {
          if (data) {
            this.arrColors = data
          }
          if (this.activeTab === 1) {
            this.selectDiariesColors = false
            this.showDiariesProductsNumber = false
          }
          if (this.activeTab === 3) {
            this.selectBusinessColors = false
            this.showBusinessProductsNumber = false
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getColorsStitching (material) {
      this.selectDiariesStitchingColors = true
      this.showDiariesProductsNumber = true
      this.showBusinessProductsNumber = true
      // this.activatedTabs = false
      return this.$http.get('/getAllColorForZapros/' + material)
        .then(({ data }) => {
          if (data) {
            return data
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.selectDiariesStitchingColors = false
          this.showDiariesProductsNumber = false
        })
    },
    getComplete () {
      this.activatedTabs = false
      return this.$http.get('/getCompleteLaguna/all')
        .then(({ data }) => {
          if (data && data instanceof Array) {
            this.arrBlocks = data.map((el) => {
              let newName = `${el.art} ${el.name}`
              el.name = newName
              return el
            })
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.activatedTabs = true
        })
    },
    getPersonals ({ block = 0, cover = 0, material = 0, color = 0, complete = 0 } = {}) {
      let post = createPostParams({ num: block, node: cover, mat: material, color, idCompl: complete })
      this.activatedTabs = false
      this.isFetchingData = true
      return this.$http.post('/getListPerson/all', post)
        .then(({ data }) => {
          if (data) {
            this.arrPersonals = data
            this.addBtnDisabled = false
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
          this.activatedTabs = true
        })
    },
    getPersonParam (id) {
      this.personParamPossible = {}
      this.isFetchingData = true
      return RequestsService.getPersonalParamsById(id)
        .then((data) => {
          this.personParamPossible = data
          return data
        })
        .catch(e => console.error('error getting personal params', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    getEditedPersonParam (dog100, index) {
      this.personParamPossible = {}
      this.isFetchingData = true
      return this.$http.get('/getPersonVarList/' + dog100 + '/idPerson/' + index)
        .then(({ data }) => {
          if (data) {
            this.editedPersonParam = data
            this.personParamPossible = data
          }
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    sendEditedPersonParam ({ idOrg, type = 2, dog100, index, idVar }) {
      this.isFetchingData = true
      return this.$http.get(`/changePersolization/true/dog100/${dog100}/type/${type}/indexPerson/${index}/list/${idVar}`)
        .then(({ data }) => {
          if (data) {
            return data
          }
        })
        .catch(e => console.error('error saving personalization change', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    sendEditedWorkParam ({ dog100, personIndex, workId, val }) {
      this.isFetchingData = true
      return this.$http.get(`/setWorkChange/true/dog100/${dog100}/idPerson/${personIndex}/idWork/${workId}/inOut/${val}`)
        .then(({ data }) => {
          if (data) {
            return data
          }
        })
        .catch(e => console.error('error saving work change', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    addNewPosition (
      {
        block = 0,
        material = 0,
        color = 0,
        cover = 0,
        stitching = 0,
        material1 = 0,
        material2 = 0,
        material3 = 0,
        material4 = 0,
        color1 = 0,
        color2 = 0,
        color3 = 0,
        color4 = 0,
        paramvalue1 = 0,
        paramvalue2 = 0,
        materialBacks = 0,
        colorBacks = 0,
        tmckey = 0,
        price = 0,
        boxing = 0,
        dog101,
        dog100 = 0,
        qty = 20
      }) {
      const post = {
        infBlock: block,
        material: material,
        color: color,
        node: cover,
        typeSew: stitching,
        material_1: material1,
        material_2: material2,
        material_3: material3,
        material_4: material4,
        color_1: color1,
        color_2: color2,
        color_3: color3,
        color_4: color4,
        paramvalue1: paramvalue1,
        paramvalue2: paramvalue2,
        materialBacks: materialBacks,
        colorBacks: colorBacks,
        tmckey: tmckey,
        price: price,
        boxing: boxing,
        dog101: this.dog101,
        dog100: this.dog100,
        qty: qty
      }
      this.isFetchingData = true
      return RequestsService.createPosition(post)
        .catch(e => console.error('error creating position', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    addNewPersonal ({ id, dog100, param, works }) {
      this.isFetchingData = true
      return RequestsService.createAndAddNewPersonalWithParamsToPosition({
        personId: id,
        positionId: dog100,
        params: param,
        workIds: works
      })
        .catch(e => console.error('error adding personal', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    deletePersonal (personIndex, dog100) {
      this.isFetchingData = true
      return RequestsService.removePersonalizationFromPositionByIndex({
        positionId: dog100,
        personIndex: personIndex
      })
        .catch(e => console.error('error removing personal', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    removeBooking (dog100) {
      this.isFetchingData = true
      return RequestsService.unBookRequestPositionById(dog100)
        .catch(e => console.error('error unbooking position', e))
        .finally(() => {
          this.isFetchingData = false
        })
    },
    passToConstructor (event) {
      let formData = new FormData(event.target)
      let object = {}
      formData.forEach((value, key) => { object[key] = value })
    },
    getParamsFromConstructor (val) {
      if (val) {
        return RequestsService.passToConstructor(val.id)
          .then(res => {
            if (res) {
              this.isFromConstructor = true
            } else {
              this.isFromConstructor = false
            }
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .addPosition {
    $this: &;

    &-title {
      font-size: 32px;
      font-family: $fontHeading;
      margin-bottom: 25px;
      font-weight: 400;

      & a {
        font-family: $fontMain;
        font-size: 13px;
        color: $colorBrand;
        text-underline-position: under;
        margin: 0 5px;
        position: relative;
        top: -3px;

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
    }

    /deep/ &-field {
      margin-bottom: 20px;
    }

    &-section {
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 5px;
      }

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
      @media all and (max-width: getBreakpointVal(sm)) {
        flex-wrap: wrap;
      }
      &-button {
        &._create {
          width: 33%;
        }
        &._edit {
          width: 25%;
        }
        margin-right: 20px;

        @media all and (max-width: getBreakpointVal(sm)) {
          flex: 1 0 100%;
        }
      }

      &-item {
        width: 33.33%;
        flex: 1 1 auto;

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

    &-personals {
      padding-top: 20px;

      &-title {
        margin-bottom: 10px;
        font-weight: 500;
        font-size: 14px;

        &._arrow {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            top: calc(50% - 2px);
            left: 0;
            display: block;
            width: calc(100% - 5px);
            height: 4px;
            background-color: $colorGrayLight;
            z-index: 1;
          }

          &::after {
            content: '';
            position: absolute;
            top: calc(50% - 10px);
            right: -10px;
            display: block;
            border: 10px solid $colorGrayLight;
            border-top-color: transparent;
            border-right-color: transparent;
            border-bottom-color: transparent;
            z-index: 1;
          }

          & > span {
            position: relative;
            display: inline-block;
            background-color: #fff;
            padding-right: 10px;
            z-index: 2;
          }
        }
      }
    }

    .row {
      flex-wrap: nowrap;

      & > span {
        color: red;
        font-size: 14px;
        line-height: 21px;
      }
    }

    .col-4 {
      background-color: transparent;
    }

    @media all and (max-width: getBreakpointVal(sm)) {
      &-field {
        margin-bottom: 30px;
      }

      &-personals {
        .row {
          flex-direction: column;
        }

        &-item {
          margin-bottom: 20px;
        }

        &-title {
          &._arrow {
            &::before, &::after {
              display: none;
            }
          }
        }
      }
      .grid .row {
        display: block;
      }
      .mob-col {
        width: 100%;
      }
    }

    .button-submit {
      padding: 7px 8px;
      background-color: $colorBrand;
      border: none;
      border-radius: 3px;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      line-height: 0.9;
      box-shadow: 0 3px 3px 0 #c73d00;
      cursor: pointer;
      outline: none;
      position: relative;

      &.disabled,
      &.disabled:hover,
      &.disabled:focus {
        background-color: #c5c5c5;
        box-shadow: 0 3px 3px 0 #666666;
        cursor: no-drop;
      }

      .help-text {
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -67px;
        font-family: "Rubik";
        color: #4d4d4d;
        background-color: #fff;
        // white-space: nowrap;
        box-shadow: 0 4px 6px -3px rgba(0, 0, 0, 0.35);
        border: 1px solid #b0b1b1;
        padding: 8px;
        z-index: 2;
        font-size: 13px;
        line-height: 1.4;

        @media all and (max-width: getBreakpointVal(sm)) {
          bottom: -51px;
        }

        &::before {
          content: '';
          display: block;
          border: 9px solid transparent;
          position: absolute;
          top: -18px;
          right: 15px;
          left: unset;
          border-bottom: 9px solid #b0b1b1;
          box-sizing: content-box;
          z-index: 2;
        }

        &::after {
          content: '';
          display: block;
          border: 9px solid transparent;
          position: absolute;
          top: -17px;
          right: 15px;
          left: unset;
          z-index: 3;
          border-bottom: 9px solid white;
          box-sizing: content-box;
        }
      }
      &.disabled:hover,
      &.disabled:focus {
        .help-text {
          display: block;
        }
      }

      &:hover {
        background-color: lighten($colorBrand, 5.5%);
      }
      @media all and (max-width: getBreakpointVal(sm)) {
        width: 100%;
        min-height: 44px;
        margin-bottom: 30px;
      }
      &-subtext {
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 0;
        /*max-width: 200px;*/
        // Полная херня. В дизайне примерно так и сделано.
      }

      @media all and (max-width: getBreakpointVal(sm)) {
        display: flex;
        flex-direction: column;
        // min-height: 80px;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .grid {
    padding: 0 15px;
  }
  .grid-stitchings {
    margin-bottom: 20px;
    position: relative;
  }
  .avaible {
    font-size: 13px;
    color: #00ad5d;
    margin-top: -12px;
    margin-bottom: 20px;
    span {
      display: inline-block;
    }
  }

  @media all and (min-width: getBreakpointVal(sm)) {
    .avaible {
      margin: 1px 0 0 0;
      line-height: 1.2;
      span {
        display: block;
      }
    }
    /*** Grids ***/
    .grids {
      display: grid;
      grid-template-columns: 1fr 33%;
      grid-template-rows: minmax(auto, 1fr);
    }
    .grid {
      grid-column: 1;
      /* grid-row: 1; */
    }
    .grid-stitchings {
      grid-column: 2 ;
      /* grid-row: 2 / auto; */
    }
  }
</style>
