<template>
  <div class="orderDetails">
    <template v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.sm)">
      <table>
        <thead class="orderDetails-head">
        <tr>
          <td>№</td>
          <td>Артикул</td>
          <td>Наименование</td>
          <td style="min-width: 80px;">Цена, руб.</td>
          <td>Скидка %</td>
          <td>Цена со скидкой, руб.</td>
          <td>Тираж, шт.</td>
          <td>Стоимость, руб.</td>
          <td v-if="showMoreCol">&nbsp;</td>
          <td class="orderDetails-status"></td>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item, index) in positions">
          <tr :key="item.id + '_' + index" class="orderDetails-position" :class="{'_active' : itemActiveClass === item.id}">
            <td></td>
            <td>{{ item.art }}</td>
            <td class="orderDetails-position-name">
              <span>{{ item.name }}</span>
              <span class="orderDetails-position-actions" v-if="$mq.resize">
              <template v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.md) && type === 'request' && driver !== 0">
                <span v-if="bookingIsAvailable">
                  <span class="orderDetails-position-actions-item" v-if="item.booking_status === 2">
                    <IconButton :icon="removeBookingIcon" hint="Снять бронь"
                                @click="onClick('removeBooking', {'item': item, 'num': 'one'})"></IconButton>
                  </span>
                  <span class="orderDetails-position-actions-item" v-else>
                    <IconButton :icon="bookingIcon" hint="Забронировать"
                                @click="onClick('addBooking', {'item': item, 'num': 'one'})"></IconButton>
                  </span>
                </span>
                <span class="orderDetails-position-actions-item" v-if="requestsCreationIsAvailable">
                  <IconButton :icon="editIcon" hint="Редактировать изделие"
                              @click="onClick('editPosition', {'action': 'edit', 'order': orderNumber, 'numProduct': item.id, dog101: dog101, 'itemPersonals': item.personals, item: item})"></IconButton>
                </span>
                <!--Функционал отложен на потом-->
                <!--              <span class="orderDetails-position-actions-item">
                                <IconButton :icon="copyIcon" hint="Копировать изделие"></IconButton>
                              </span>
                              <span class="orderDetails-position-actions-item">
                                <IconButton :icon="inspectIcon" hint="Внешний вид" @click="onClick('view')"></IconButton>
                              </span>-->
              <span class="orderDetails-position-actions-item" v-if="requestsCreationIsAvailable">
                <IconButton :icon="deleteIcon" hint="Удалить" @click="onClick('deletePosition', item)"></IconButton>
              </span>
              </template>
              <template v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.lg) && type === 'order'">
                <span class="orderDetails-position-actions-item">
                  <IconButton :icon="grafIcon" hint="График прохождения"
                              @click="onClick('showGraf', {item: item, dog101: dog101, order: orderNumber})"></IconButton>
                </span>
              </template>
            </span>
            </td>
            <td style="min-width: 80px;">{{ item.price_for_one | formatPrice }}</td>
            <td>{{ ((item.price_for_one - item.discounted_price)*100/ item.price_for_one) | formatPrice(0)}}</td>
            <td>{{ item.discounted_price | formatPrice }}</td>
            <td>{{ item.products_number }}</td>
            <td>{{ item.price_full | formatPrice }}</td>
            <td v-if="showMoreCol" class="orderDetails-more">
              <MoreActions :actions="actionsRequestPosition[index]" type="vertical"
                           @deletePosition="onClick('deletePosition', item)"
                           @removeBooking="onClick('removeBooking', {'item': item, 'num': 'one'})"
                           @addBooking="onClick('addBooking', {'item': item, 'num': 'one'})"
                           @editPosition="onClick('editPosition', {'action': 'edit', 'order': orderNumber, 'numProduct': item.id, dog101: dog101, 'itemPersonals': item.personals, item: item})"
              ></MoreActions>
            </td>
            <td class="orderDetails-status">
              <span class="orderDetails-status-icon">
                <IconButton :icon="BOOKINGICON[item.booking_status]" :hint="bookingDayStr[index]"
                            v-if="!BPZIsSignedByBothSides && bookingDayStr"></IconButton>
              </span>
            </td>
          </tr>
          <template v-for="(el, elIndex) in item.personals">
            <tr :key="item.id + '_' + elIndex + '_2'" class="orderDetails-position-element">
              <td colspan="2" style="text-align: right"></td>
              <td class="orderDetails-position-name">
                <span>{{ el.name }}</span>
                <span class="orderDetails-position-actions"
                      v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.md) && type === 'request' && driver !== 0">
                  <!--<span class="orderDetails-position-actions-item" v-if="el.AutoPerson !== 1 && el.varsstatus !== 0">-->
                  <span class="orderDetails-position-actions-item" v-if="el.varsstatus !==0 && requestsCreationIsAvailable">
                      <IconButton v-if="(item.isFromConstructor === 1 && el.AutoPerson === 1) || item.isFromConstructor === 0" :icon="editIcon" hint="Редактировать персонализацию"
                                  @click="onClick('editPerson', {action: 'editPerson', item: item, person: el})"></IconButton>
                  </span>
                  <span class="orderDetails-position-actions-item" v-if="requestsCreationIsAvailable">
                    <IconButton v-if="item.isFromConstructor === 0 && el.AutoPerson !== 1" :icon="deleteIcon" hint="Удалить"
                                @click="onClick('deletePerson', {item, index: el.indexPerson})"></IconButton>
                  </span>
                </span>
              </td>
              <td>{{ el.price_for_one | formatPrice }}</td>
              <td>{{ ((el.price_for_one - el.discounted_price)*100/ el.price_for_one) | formatPrice(0) }}</td>
              <td>{{ el.discounted_price | formatPrice }}</td>
              <td>{{ el.count }}</td>
              <td>{{ el.price_full | formatPrice }}</td>
              <td v-if="showMoreCol" class="orderDetails-more">
                <MoreActions v-if="(requestsCreationIsAvailable || bookingIsAvailable)  && actionsRequestPerson[index][elIndex].length > 0" :actions="actionsRequestPerson[index][elIndex]" type="vertical"
                             @editPerson="onClick('editPerson', {action: 'editPerson', item: item, person: el})"
                             @deletePerson="onClick('deletePerson', {item, index: el.indexPerson})"
                ></MoreActions>
              </td>
              <td class="orderDetails-status"></td>
            </tr>
          </template>
          <template>
            <tr class="orderDetails-position _result" :key="item.id + '_' + index + '_' + 1">
              <td class="orderDetails-position-cell"></td>
              <td colspan="2" class="orderDetails-position-cell">Итого за позицию:</td>
              <td>{{positionSum[index] | formatPrice}}</td>
              <td></td>
              <td></td>
              <td></td>
              <td>{{positionSumAfterSale[index] | formatPrice}}</td>
              <td class="orderDetails-status"></td>
            </tr>
          </template>
        </template>
        </tbody>
      </table>
    </template>
    <!--Верстка для адаптива-->
    <template v-else>
      <div class="orderDetails-adaptive">
        <template v-for="(item, index) in positions">
          <div :key="item.id+ '_' + index  + '_100'" class="orderDetails-adaptive-position">
            <div class="orderDetails-adaptive-number">{{ `${index+1}.` }}</div>
            <div class="orderDetails-adaptive-data">
              <div class="orderDetails-adaptive-data-name">
                {{ item.art }}
                <br>
                {{ item.name }}
              </div>
              <div class="orderDetails-adaptive-data-items">
                <div class="orderDetails-adaptive-data-item">Цена, руб. - {{ item.price_for_one | formatPrice }}</div>
                <div class="orderDetails-adaptive-data-item">Скидка % -
                  {{ ((item.price_for_one - item.discounted_price)*100/ item.price_for_one) | formatPrice(0) }}
                </div>
                <div class="orderDetails-adaptive-data-item">Цена со скидкой, руб. - {{ item.discounted_price |
                  formatPrice }}
                </div>
                <div class="orderDetails-adaptive-data-item">Тираж, шт - {{ item.products_number }}</div>
                <div class="orderDetails-adaptive-data-item">Стоимость, руб. - {{ item.price_full | formatPrice }}</div>
              </div>
            </div>
            <div class="orderDetails-adaptive-more">
              <div class="orderDetails-adaptive-more-action" v-if="type === 'order'">
                <MoreActions :actions="actionsOrderPosition" type="vertical"
                             @showGraf="onClick('showGraf', {item: item, dog101: dog101})"></MoreActions>
              </div>
              <div class="orderDetails-adaptive-more-action" v-if="type === 'request'">
                <MoreActions
                            :actions="actionsRequestPosition[index]" type="vertical"
                             @deletePosition="onClick('deletePosition', item)"
                             @removeBooking="onClick('removeBooking', {'item': item, 'num': 'one'})"
                             @addBooking="onClick('addBooking', {'item': item, 'num': 'one'})"
                             @editPosition="onClick('editPosition', {'action': 'edit', 'order': orderNumber, 'numProduct': item.id, dog101: dog101, 'itemPersonals': item.personals, item: item})"
                ></MoreActions>
              </div>
              <div class="orderDetails-adaptive-more-status">
                <IconButton :icon="BOOKINGICON[item.booking_status]" :hint="bookingDayStr[index]"
                            v-if="!BPZIsSignedByBothSides && bookingDayStr"></IconButton>
              </div>
            </div>
          </div>
          <template v-for="(el, elIndex) in item.personals">
            <div :key="el.id+ '_' + index  + '_100'" class="orderDetails-adaptive-element">
              <div class="orderDetails-adaptive-number">{{ `${index+1}.${elIndex+1}.` }}</div>
              <div class="orderDetails-adaptive-data">
                <div class="orderDetails-adaptive-data-name">
                  {{ el.name }}
                </div>
                <div class="orderDetails-adaptive-data-items">
                  <div class="orderDetails-adaptive-data-item">Цена, руб. &ndash; {{ el.price_for_one | formatPrice }}
                  </div>
                  <div class="orderDetails-adaptive-data-item">Скидка % &ndash; {{ ((el.price_for_one -
                    el.discounted_price)*100/ el.price_for_one) | formatPrice(0) }}
                  </div>
                  <div class="orderDetails-adaptive-data-item">Цена со скидкой, руб. &ndash; {{ el.discounted_price |
                    formatPrice }}
                  </div>
                  <div class="orderDetails-adaptive-data-item">Тираж, шт &ndash; {{ el.count }}</div>
                  <div class="orderDetails-adaptive-data-item">Стоимость, руб. &ndash; {{ el.price_full | formatPrice }}
                  </div>
                </div>
              </div>
              <div class="orderDetails-adaptive-more" v-if="actionsRequestPerson[index][elIndex].length > 0">
                <div class="orderDetails-adaptive-more-action" v-if="type === 'request'">
                  <MoreActions v-if="requestsCreationIsAvailable || bookingIsAvailable" :actions="actionsRequestPerson[index][elIndex]" type="vertical"
                               @editPerson="onClick('editPerson', {action: 'editPerson', item: item, person: el})"
                               @deletePerson="onClick('deletePerson', {item, index: el.indexPerson})">
                  </MoreActions>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
    <div class="orderDetails-add"
         @click="onClick('addPosition', {'action': 'create', 'order': orderNumber, 'dog101': dog101})"
         v-if="type === 'request' && driver !== 0 && requestsCreationIsAvailable">
      <svg class="icon-svg">
        <use :xlink:href="`#${addIcon.id}`"></use>
      </svg>
      <span>Добавить позицию</span>
    </div>
  </div>
</template>

<script>
import addIcon from '@/assets/svg/add.svg'
import copyIcon from '@/assets/svg/copy.svg'
import grafIcon from '@/assets/svg/graf.svg'
import inspectIcon from '@/assets/svg/eye.svg'
import deleteIcon from '@/assets/svg/trash_can.svg'
import editIcon from '@/assets/svg/pencil.svg'
import fireShieldIcon from '@/assets/svg/fire_shield.svg'
import IconButton from '@/components/IconButton'
import MoreActions from '@/components/MoreActions'
import {
  GRID_BREAKPOINTS,
  BOOKINGICON,
  ORDER_CARD_ACTIONS_MOBILE_POSITION
} from '@/constants'
import { formatPrice } from '@/helpers'
import { privilegesMixin } from '@/mixins'
import bookingIcon from '@/assets/svg/shield_full.svg'
import removeBookingIcon from '@/assets/svg/booking_cancel.svg'
// import { RequestsService } from '@/services/RequestsService'

export default {
  name: 'orderDetails',
  mixins: [privilegesMixin],
  components: {
    IconButton,
    MoreActions
  },
  filters: {
    formatPrice
  },
  props: {
    item: {
      type: Object
    },
    type: {
      type: String,
      default: ''
    },
    activeClass: {
      type: Number,
      default: 0
    }
  },
  computed: {
    itemActiveClass () {
      return this.activeClass
    },
    BPZIsSignedByBothSides () {
      return this.item && this.item.BPZ_Poni === 1 && this.item.BPZ_client === 1
    },
    actionsOrderPosition () {
      let result = ORDER_CARD_ACTIONS_MOBILE_POSITION.slice()
      if (this.$mq.resize && this.$mq.between([GRID_BREAKPOINTS.md, GRID_BREAKPOINTS.lg - 1])) {
        result.splice()
      }
      return result
    },
    actionsRequestPosition () {
      let vm = this
      let result = []
      let arrResult = []
      let arr = this.positions
      if (arr) {
        arr.forEach(function (el, i) {
          result = []
          if (el.booking_status === 2 && vm.driver !== 0) {
            result.push({ name: 'Снять бронь', eventName: 'removeBooking' })
          } else if (el.booking_status !== 2 && vm.driver !== 0) {
            result.push({ name: 'Забронировать', eventName: 'addBooking' })
          }
          if (vm.driver !== 0) {
            result.push({ name: 'Редактировать', eventName: 'editPosition' })
          }
          if (vm.driver !== 0) {
            result.push({ name: 'Удалить ', eventName: 'deletePosition' })
          }
          arrResult.push(result)
        })
        return arrResult
      }
    },
    actionsRequestPerson () {
      let vm = this
      let result = []
      let arrResult = []
      let arrPersonResult = []
      let arr = this.positions
      if (arr) {
        arr.forEach(function (el, i) {
          arrPersonResult = []
          if (el.personals) {
            el.personals.forEach(function (person, i) {
              result = []
              if (vm.driver !== 0 && person.varsstatus) {
                if ((el.isFromConstructor === 1 && person.AutoPerson === 1) || el.isFromConstructor === 0) {
                  result.push({ name: 'Редактировать', eventName: 'editPerson' })
                }
              }
              if (vm.driver !== 0) {
                if (el.isFromConstructor === 0 && person.AutoPerson !== 1) {
                  result.push({ name: 'Удалить', eventName: 'deletePerson' })
                }
              }
              arrPersonResult.push(result)
            })
          }
          arrResult.push(arrPersonResult)
        })
        return arrResult
      }
    },
    showMoreCol () {
      return this.$mq.resize && this.$mq.below(GRID_BREAKPOINTS.md - 1)
    },
    statusIcon () {
      return fireShieldIcon
    },
    bookingDayStr () {
      let dataStr = ''
      let curDate = ''
      let dt = ''
      let arr = []

      this.positions.forEach(function (el, i) {
        if (el.booking_endDate_unix > 0) {
          dt = new Date(el.booking_endDate_unix * 1000)

          curDate = dt.getDate() + '.' + (+dt.getMonth() + 1) + '.' + dt.getFullYear()
        }
        if (el.booking_status) {
          if (el.booking_status === 2) {
            dataStr = 'Забронированно до ' + curDate
          } else if (el.booking_status === 3) {
            dataStr = 'Горящая бронь до ' + curDate
          } else if (el.booking_status === 4) {
            dataStr = 'Частично забронированно до ' + curDate
          } else if (el.booking_status === 5) {
            dataStr = 'Бронь просрочена'
          }
          arr.push(dataStr)
        }
      })

      return arr
    },
    positions () {
      if (this.item && this.item.items) {
        return this.item.items
      }
      return []
    },
    positionSumAfterSale () {
      let sum = 0
      let arr = []
      if (this.item && this.item.items) {
        for (var i = 0; i < this.item.items.length; i++) {
          sum = 0
          var el = this.item.items[i]
          if (el.personals) {
            for (var j = 0; j < el.personals.length; j++) {
              sum += el.personals[j]['price_full']
            }
          }
          arr.push(sum += el.price_full)
        }
      }
      return arr
    },
    positionSum () {
      let sum = 0
      let arr = []
      if (this.item && this.item.items) {
        for (var i = 0; i < this.item.items.length; i++) {
          sum = 0
          var el = this.item.items[i]
          if (el.personals) {
            for (var j = 0; j < el.personals.length; j++) {
              sum += el.personals[j]['price_for_one']
            }
          }
          arr.push(sum += el.price_for_one)
        }
      }
      return arr
    }
  },
  data () {
    return {
      addIcon,
      copyIcon,
      grafIcon,
      inspectIcon,
      deleteIcon,
      bookingIcon,
      removeBookingIcon,
      editIcon,
      isFetchingData: false,
      GRID_BREAKPOINTS,
      BOOKINGICON,
      orderNumber: this.item.number || 0,
      dog101: this.item.id || 0,
      driver: this.item.driver,
      activePosition: 0
    }
  },
  methods: {
    onClick (action, obj) {
      this.$emit('actionDetails', { action, obj })
    }
  }
}
</script>

<style lang="scss" scoped>
$darkenBackgroundColor: #f0f0f0;

.orderDetails {
  $this: &;
  counter-reset: position;
  padding-left: 67px;

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid $colorBorderDefault;
    font-size: 13px;

    td {
      padding: 10px 10px;
    }

    tr {
      border-bottom: 1px solid $colorBorderDefault;
    }
  }

  &-head {
    background-color: $darkenBackgroundColor;
    font-weight: 500;
    /*border-bottom: 1px solid #d3d3d3;*/
    & > tr > td:first-of-type {
      padding-left: 20px;
    }
  }

  &-position {
    counter-increment: position;
    counter-reset: item;
    position: relative;
    background-color: transparent;
    transition: background-color .3s ease;

    &:hover {
      background-color: $darkenBackgroundColor;
      transition: background-color .3s ease;
      #{$this} {
        &-position {
          &-actions {
            opacity: 1;
            pointer-events: all;
          }
        }
      }
    }
    &._active {
      background-color: $colorBrandLight;
      transition: background-color .3s ease;
    }
    & > td:first-of-type {
      padding-left: 20px;
      &::before {
        content: counter(position) ".";
        font-weight: 500;
      }
    }
    & > td:nth-child(2) {
      font-weight: 500;
    }
    &._result {
      counter-increment: none;
      counter-reset: none;
      td {
        font-weight: 500;
      }
      #{$this} {
        &-position-cell {

          counter-increment: none;
          counter-reset: none;
          position: relative;
          text-align: right;
          &::before {
            content: "";
          }
        }
      }
    }

    &-element {
      counter-increment: item;

      &:hover {
        background-color: $darkenBackgroundColor;
        #{$this} {
          &-position {
            &-actions {
              opacity: 1;
              pointer-events: all;
            }
          }
        }
      }

      & > td:first-of-type {

        &::before {
          content: counter(position) "." counter(item) ".";
        }
      }
    }

    &-name {
      position: relative;
      line-height: 19px;
      width: 100%;
    }

    &-actions {
      position: absolute;
      top: calc(50% - 10px);
      right: 10px;
      background-color: $darkenBackgroundColor;
      box-shadow: 0 0 10px 7px $darkenBackgroundColor;
      opacity: 0;
      pointer-events: none;

      &-item {
        display: inline-block;
        margin-left: 10px;

        &:first-child {
          margin-left: 0;
        }
        & > * {
          display: inline-block;
        }
      }
    }
  }

  &-add {
    display: block;
    padding: 10px;
    font-size: 14px;
    border: 1px solid $colorBorderDefault;
    border-top: 0;
    cursor: pointer;

    &:hover {
      background-color: $darkenBackgroundColor;

      & > svg {
        fill: $colorBrand;
      }
    }

    & > svg {
      vertical-align: text-bottom;
      width: 20px;
      height: 20px;
      fill: #9d9e9e;
    }
    & span {
      line-height: 0.5;
      margin-left: 8px;
    }
  }

  &-more {
    .moreActions {
      margin-right: 6px;
    }
  }

  &-status {
    padding: 0 !important;
    position: relative;

    &-icon {
      position: absolute;
      top: calc(50% - 10px);
      right: -10px;
      & > svg {
        width: 15px;
        height: 20px;
      }
    }
  }

  &-adaptive {
    font-size: 13px;

    &-position, &-element {
      display: flex;
      padding: 10px;
      border-bottom: 1px solid #d3d3d3;

      & > * {
        padding-left: 5px;
        padding-right: 5px;
      }
    }

    &-number {
      flex: 0 0 auto;
      min-width: 40px;
      font-weight: 500;
    }
    &-data {
      flex: 1 1 auto;
      &-name {
        font-weight: 500;
        line-height: 1.4;
        margin-bottom: 10px;
      }
      &-items {
      }
      &-item {
        margin-bottom: 3px;
        line-height: 18px;
      }
    }
    &-more {
      flex: 0 0 auto;
      display: flex;
      margin-left: -4px;
      margin-right: -4px;
      width: 61px;
      & > * {
        padding-left: 4px;
        padding-right: 4px;
      }
      &-status {
        & > svg {
          width: 15px;
          height: 20px;
        }
      }
    }
  }

  @media all and (max-width: getBreakpointVal(lg)) {
    & {
      padding-left: 37px;
    }
  }

  @media all and (max-width: getBreakpointVal(md)) {
    &-position {
      &:hover {
        background-color: #fff;
      }
      &-element {
        &:hover {
          background-color: #fff;
        }
      }
      &-actions {
        box-shadow: none;
      }
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    & {
      padding-left: 0;
    }
    &-adaptive-more-status {
      width: 23px;
    }
    &-add {
      border-left: 0;
      border-right: 0;
    }
  }
}
</style>
