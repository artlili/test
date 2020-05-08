<template>
  <div class="orderCard"
       :class="{'order': type === 'order', '_archive': show === 'orderArchive', '-rename': showRenameInput}"
       @click="onClickCard($event.target)">
    <div class="orderCard-adaptiveWrapper">
      <div class="orderCard-main">
        <div class="orderCard-main-number">
          №{{ item.number }}
        </div>
        <div class="orderCard-main-details">
          <div class="orderCard-main-details-content" :class="{'_noEdit': driver == 0}">
            <div class="orderCard-main-details-name">
              <span v-if="item.name && !showRenameInput">{{ item.name }}</span>
              <FormInput v-model="renameText" v-if="showRenameInput" data-rename="input"
                         @keyup.enter="rename({text: renameText, dog101: item.id})"
                         @keyup.esc="onHideRename"></FormInput>
              <div class="orderCard-main-details-other" v-if="type === 'request'">
                <div class="orderCard-main-details-other-edit" v-if="driver != 0">
                  <div class="orderCard-main-details-other-edit-button"
                       @click="rename({text: renameText, dog101: item.id})">
                    <svg class="icon-svg">
                      <use :xlink:href="`#${editIcon.id}`"></use>
                    </svg>
                  </div>
                </div>
                <div class="orderCard-main-details-other-nds" :class="{'_corss': item.NDS == '0'}">НДС</div>
              </div>
            </div>
            <div class="orderCard-main-details-subs">
              <div class="orderCard-main-details-subs-org">
                Организация: {{ item.company_name }}
              </div>
              <template v-if="type === 'request'">
                <div class="orderCard-main-details-subs-manager" v-if="item.manager">
                  Создан менеджером: {{ item.manager }}
                </div>
                <div class="orderCard-main-details-subs-manager" v-else>
                  Создан менеджером: ООО "ПОНИ"
                </div>
              </template>
              <div class="orderCard-main-details-subs-manager" v-if="type === 'order'">
                Связанный запрос: {{ item.linked_query }}
              </div>
            </div>
          </div>
        </div>
        <div class="orderCard-main-split"></div>
        <div class="orderCard-main-status" v-if="type === 'order'">
          <div class="orderCard-main-actions-grid-item">
            <IconButton :icon="ORDER_STATUS[item.status]['icon']"
                        :hint="ORDER_STATUS[item.status]['hint']" v-if="ORDER_STATUS[item.status]"></IconButton>
          </div>
          <template>
            <div class="orderCard-main-actions-grid-item"
                 v-if="item.status_oplaty_cod === 2">
              <IconButton :icon="paid" hint="Оплачен"></IconButton>
            </div>
            <div class="orderCard-main-actions-grid-item"
                 v-if="item.status_oplaty_cod === 0">
              <IconButton :icon="paidNot" hint="Не оплачен"></IconButton>
            </div>
            <div class="orderCard-main-actions-grid-item"
                 v-if="item.status_oplaty_cod === 1">
              <IconButton :icon="paidPart" :hint="'Оплачен частично ' + item.pl1"></IconButton>
            </div>
          </template>
        </div>
        <div class="orderCard-main-actions" :class="{'orders': type === 'order'}">
          <div class="orderCard-main-actions-grid">
            <template v-if="type === 'request'">
              <div class="orderCard-main-actions-grid-item" v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.md)">
                <IconButton :icon="arrowIcon" hint="Подробнее" @click="onClick('show_more')"
                            :class="{'_rotate': open}"></IconButton>
              </div>
              <div class="orderCard-main-actions-grid-item" :class="{'_disabled': disabledIcon}"
                   v-if="canSetBooking && (bookingNone || bookingPartial) && !disabledIcon && bookingIsAvailable">
                <IconButton :icon="shieldFullIcon" hint="Забронировать материалы"
                            @click="onClick('addBooking', {'item': item, 'num': 'all'})"></IconButton>
              </div>
              <div class="orderCard-main-actions-grid-item" :class="{'_disabled': disabledIcon}"
                   v-else-if="canSetBooking && bookingExpired && !disabledIcon  && bookingIsAvailable">
                <IconButton :icon="BOOKINGICON[BOOKING_STATUS_TYPES.EXPIRED]" hint="Бронь просрочена"
                            @click="onClick('expiredBooking', item)"></IconButton>
              </div>
              <div class="orderCard-main-actions-grid-item" :class="{'_disabled': disabledIcon}"
                   v-else-if="canSetBooking && (bookingFull || bookingHot) && !disabledIcon && bookingIsAvailable">
                <IconButton :icon="cancelShieldIcon" hint="Снять бронь"
                            @click="onClick('deleteBooking', {'item': item, 'num': 'all'})"></IconButton>
              </div>
              <div class="orderCard-main-actions-grid-item" :class="{'_disabled': disabledIcon}"
                   v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.lg) && !disabledIcon">
                <IconButton :icon="puzzleIcon" hint="Посмотреть комплектующие"
                            @click="onClick('show_parts', item)"></IconButton>
              </div>
              <div class="orderCard-main-actions-grid-item" :class="{'_disabled': disabledIcon}"
                   v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.lg) && this.driver !== 0 && !disabledIcon">
                <IconButton :icon="KPIcon" hint="Сохранить КП" @click="onClick('save_CP', item)"></IconButton>
              </div>
              <div class="orderCard-main-actions-grid-item"
                   v-if="$mq.resize && $mq.above(GRID_BREAKPOINTS.lg) && this.driver !== 0 && requestsCreationIsAvailable">
                <IconButton :icon="trashIcon" hint="Удалить"
                            @click="onClick('deleteRequest', item)"></IconButton>
              </div>
            </template>
            <template v-if="type === 'order' && $mq.resize && $mq.above(GRID_BREAKPOINTS.md)">
              <div class="orderCard-main-actions-grid-item">
                <IconButton :icon="arrowIcon" hint="Подробнее" @click="onClick('show_more')"
                            :class="{'_rotate': open}"></IconButton>
              </div>
            </template>
            <div class="orderCard-main-actions-grid-item"
                 v-if="$mq.resize && $mq.between([GRID_BREAKPOINTS.md, GRID_BREAKPOINTS.lg - 1]) && type === 'request' && driver !== 0">
              <MoreActions :actions="actionsRequest"
                           @setBooking="onClick('addBooking', {'item': item, 'num': 'all'})"
                           @moreInfo="onClick('show_more', item)"
                           @deleteBooking="onClick('deleteBooking', {'item': item, 'num': 'all'})"
                           @show_parts="onClick('show_parts', item)"
                           @save_CP="onClick('save_CP', item)"
                           @deleteRequest="onClick('deleteRequest', item)"

              ></MoreActions>
            </div>
          </div>
          <div class="orderCard-main-date">
            {{ item.date }}
          </div>
        </div>
        <div class="orderCard-main-price">
          <span v-if="$mq.resize && $mq.below(GRID_BREAKPOINTS.sm - 1)">
            {{ item.date }}
          </span>
          {{ item.price | formatPrice }} руб.
        </div>
        <div class="orderCard-main-procedures" v-if="type === 'request'">
          <FormButton type="skeleton" @click="onClick('Checkout', item)" :disabled="disabledIcon || !bookingIsAvailable">Оформить заказ
          </FormButton>
        </div>
        <template v-if="type === 'order'">
          <div class="orderCard-main-procedures" v-if="!signedByBothSides">
            <FormButton type="skeleton" @click="onBpzButtonClick" :disabled="bpzError || !bpzApprovalIsAvailable">
              <template v-if="BPZNotCreated || bpzError">
                Сформировать БПЗ
              </template>
              <template v-if="awaitingManagerConfirmation || awaitingDealerSign">
                Просмотр БПЗ
              </template>
              <template v-if="managerDeclined || dealerNotSignedBpz">
                БПЗ повторно
              </template>
            </FormButton>
            <span class="status" v-if="item.BPZ_Date && awaitingDealerSign">{{ item.BPZ_Date }}</span>
            <span class="status" v-if="managerDeclined || dealerNotSignedBpz">БПЗ не согласован</span>
            <span class="status" v-if="awaitingManagerConfirmation">
              Ожидание подписи менеджера ПОНИ {{ item.BPZ_Date }}
            </span>
            <span class="status" v-if="bpzError">Ошибка</span>
          </div>
          <div class="orderCard-main-procedures _row" v-else>
            <div>
              <span><FormButton type="skeleton" @click="onBpzButtonClick">БПЗ</FormButton></span>
              <span><FormButton type="skeleton" @click="onClick('invoice', item)">Счет</FormButton></span>
              <span class="status _date" v-if="item.BPZ_Date">{{item.BPZ_Date}}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="orderCard-aside">
        <div class="orderCard-aside-more"
             v-if="$mq.resize && $mq.below(GRID_BREAKPOINTS.md - 1) && type === 'request' && driver !== 0">
          <MoreActions :actions="actionsRequestSM" type="vertical"
                       @setBooking="onClick('addBooking', {'item': item, 'num': 'all'})"
                       @moreInfo="onClick('show_more', item)"
                       @deleteBooking="onClick('deleteBooking', {'item': item, 'num': 'all'})"
                       @show_parts="onClick('show_parts', item)"
                       @save_CP="onClick('save_CP', item)"
                       @deleteRequest="onClick('deleteRequest', item)"></MoreActions>
        </div>
        <div class="orderCard-aside-more"
             v-if="$mq.resize && $mq.below(GRID_BREAKPOINTS.md - 1) && type === 'order' && driver !== 0">
          <MoreActions :actions="actionsOrderSM" type="vertical"
                       @moreInfo="onClick('show_more', item)"></MoreActions>
        </div>
        <div class="orderCard-aside-status" v-if="bpzStatus">
          <IconButton :icon="BOOKINGICON[item.booking_status]" :hint="bookingDayStr" v-if="bookingDayStr"></IconButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormButton from '@/components/FormButton'
import MoreActions from '@/components/MoreActions'
import IconButton from '@/components/IconButton'
import arrowIcon from '@/assets/svg/arrow.svg'
import shieldFullIcon from '@/assets/svg/shield_full.svg'
import puzzleIcon from '@/assets/svg/puzzle.svg'
import paid from '@/assets/svg/paid.svg'
import paidNot from '@/assets/svg/paid_not.svg'
import paidPart from '@/assets/svg/paid_part.svg'
import KPIcon from '@/assets/svg/KP.svg'
import editIcon from '@/assets/svg/rename.svg'
import trashIcon from '@/assets/svg/trash_can.svg'
import fireIcon from '@/assets/svg/fire.svg'
import cancelShieldIcon from '@/assets/svg/booking_cancel.svg'
import { GRID_BREAKPOINTS, REQUEST_CARD_ACTIONS, BOOKING_STATUS_TYPES, BOOKINGICON, ORDER_STATUS } from '@/constants'
import { formatPrice } from '@/helpers'
import { privilegesMixin } from '@/mixins'

export default {
  name: 'orderCard',
  mixins: [privilegesMixin],
  components: {
    FormButton,
    MoreActions,
    IconButton
  },
  filters: {
    formatPrice
  },
  props: {
    item: {
      type: Object
    },
    open: {
      type: Boolean
    },
    type: {
      type: String
    },
    show: {
      type: String
    }
  },
  data () {
    return {
      arrowIcon,
      shieldFullIcon,
      puzzleIcon,
      paid,
      paidNot,
      paidPart,
      KPIcon,
      trashIcon,
      editIcon,
      fireIcon,
      cancelShieldIcon,
      GRID_BREAKPOINTS,
      BOOKING_STATUS_TYPES,
      BOOKINGICON,
      ORDER_STATUS,
      showRename: false,
      renameText: this.item.name || '',
      isFetchingData: false,
      driver: this.item.driver,
      showRenameInput: false
    }
  },
  computed: {
    awaitingDealerSign () {
      return this.item.BPZ_client === 0 && this.item.BPZ_Poni === 0 && this.item.BPZ_site === '1'
    },
    dealerNotSignedBpz () {
      return this.item.BPZ_client === 0 && this.item.BPZ_Poni === 0 && this.item.BPZ_site === '0'
    },
    managerDeclined () {
      return this.item.BPZ_client === 0 && this.item.BPZ_Poni === 0 && this.item.BPZ_site === '2'
    },
    awaitingManagerConfirmation () {
      return this.item.BPZ_client === 1 && this.item.BPZ_Poni === 0 && this.item.BPZ_site === '1'
    },
    signedByBothSides () {
      return this.item.BPZ_client === 1 && this.item.BPZ_Poni === 1
    },
    BPZNotCreated () {
      return this.item.BPZ_client === 0 && this.item.BPZ_Poni === 0 && this.item.BPZ_site === 'no records'
    },
    bpzError () {
      return !(this.awaitingDealerSign ||
        this.dealerNotSignedBpz ||
        this.managerDeclined ||
        this.awaitingManagerConfirmation ||
        this.signedByBothSides ||
        this.BPZNotCreated)
    },
    actionsRequest () {
      let result = REQUEST_CARD_ACTIONS.slice()
      if (this.$mq.resize && this.$mq.between([GRID_BREAKPOINTS.md, GRID_BREAKPOINTS.lg - 1])) {
        result.splice(0, 3)
      }
      return result
    },
    actionsRequestSM () {
      let result = []
      result.push({ name: 'Подробнее', eventName: 'moreInfo' })
      if ((this.bookingNone || this.bookingPartial) && !this.disabledIcon && this.bookingIsAvailable) {
        result.push({ name: 'Забронировать', eventName: 'setBooking' })
      } else if (this.bookingExpired && !this.disabledIcon && this.bookingIsAvailable) {
        result.push({ name: 'Бронь просрочена', eventName: '' })
      } else if ((this.bookingFull || this.bookingHot) && !this.disabledIcon && this.bookingIsAvailable) {
        result.push({ name: 'Снять бронь', eventName: 'deleteBooking' })
      }
      if (!this.disabledIcon) {
        result.push({ name: 'Комплектующие', eventName: 'show_parts' })
      }
      if (this.driver !== 0 && !this.disabledIcon) {
        result.push({ name: 'Сохранить КП', eventName: 'save_CP' })
      }
      if (this.driver !== 0 && this.requestsCreationIsAvailable) {
        result.push({ name: 'Удалить ', eventName: 'deleteRequest' })
      }
      return result
    },
    actionsOrderSM () {
      let result = []
      result.push({ name: 'Подробнее', eventName: 'moreInfo' })
      return result
    },
    bpzStatus () {
      return !(this.item.BPZ_Poni === 1 && this.item.BPZ_client === 1)
    },
    disabledIcon () {
      return !(this.item && this.item.items && this.item.items.length > 0)
    },
    canSetBooking () {
      // Driver === 0 если создано не в дилзоне, а менеджером ПОНИ в бухте
      return this.driver !== 0
    },
    bookingNone () {
      return this.item.booking_status === BOOKING_STATUS_TYPES.NOT_BOOKED ||
        (this.item.booking_status !== BOOKING_STATUS_TYPES.FULL &&
          this.item.booking_status !== BOOKING_STATUS_TYPES.HOT &&
          this.item.booking_status !== BOOKING_STATUS_TYPES.EXPIRED &&
          this.item.booking_status !== BOOKING_STATUS_TYPES.PARTIAL)
    },
    bookingFull () {
      return this.item.booking_status === BOOKING_STATUS_TYPES.FULL
    },
    bookingHot () {
      return this.item.booking_status === BOOKING_STATUS_TYPES.HOT
    },
    bookingPartial () {
      return this.item.booking_status === BOOKING_STATUS_TYPES.PARTIAL
    },
    bookingExpired () {
      return this.item.booking_status === BOOKING_STATUS_TYPES.EXPIRED
    },
    bookingDayStr () {
      let dataStr = ''
      let curDate = ''
      if (this.item.booking_endDate_unix > 0) {
        let dt = new Date(this.item.booking_endDate_unix * 1000)
        curDate = dt.getDate() + '.' + (+dt.getMonth() + 1) + '.' + dt.getFullYear()
      }
      if (this.item.items) {
        switch (this.item.booking_status) {
          case BOOKING_STATUS_TYPES.NOT_BOOKED:
            // dataStr = el.booking_endDate
            break
          case BOOKING_STATUS_TYPES.FULL:
            dataStr = 'Забронированно до ' + curDate
            break
          case BOOKING_STATUS_TYPES.HOT:
            dataStr = 'Горящая бронь до ' + curDate
            break
          case BOOKING_STATUS_TYPES.PARTIAL:
            dataStr = 'Частично забронированно до ' + curDate
            break
          case BOOKING_STATUS_TYPES.EXPIRED:
            dataStr = 'Бронь просрочена'
            break
        }
      }
      return dataStr
    }
  },
  mounted () {
    if (window.dog101 && window.dog101 > 0) {
      if (window.dog101 === this.item.id) {
        this.$emit('actionCard', { action: 'show_more', obj: this.item })
      }
    }
  },
  methods: {
    onClick (action, obj = {}) {
      this.$emit('actionCard', { action, obj })
    },
    onBpzButtonClick () {
      if (this.BPZNotCreated || this.bpzError || this.dealerNotSignedBpz || this.managerDeclined) {
        this.$emit('actionCard', { action: 'createBPZ', obj: this.item })
      } else {
        this.$emit('actionCard', { action: 'showBPZ', obj: this.item })
      }
    },
    onClickCard (target) {
      const action = target.closest('.orderCard-main-actions-grid-item')
      const btn = target.closest('.orderCard-main-procedures')
      const edit = target.closest('.orderCard-main-details-other-edit-button')
      const moreActions = target.closest('.orderCard-aside-more')
      if (!action && !btn && !edit && !moreActions) {
        this.$emit('actionCard', { action: 'show_more' })
      }
    },
    onShowRename () {
      this.showRenameInput = true
      this.renameText = this.item.name
      this.$nextTick(() => {
        let input = this.$el.querySelector('[data-rename="input"] input')
        input.focus()
      })
    },
    onHideRename () {
      this.showRenameInput = false
      this.renameText = this.item.name
    },
    rename ({ text, dog101 }) {
      if (this.showRenameInput) {
        this.onHideRename()
        this.$emit('actionCard', { action: 'rename', obj: { dog101: dog101, text: text } })
      } else {
        this.onShowRename()
      }
    }
  }
}
</script>

<style lang="scss">
.orderCard {
  $this: &;
  display: block;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  padding: 10px 20px 10px 12px;
  box-shadow: 0 4px 6px -3px rgba(#000, 0.2);
  cursor: pointer;

  &._archive #{$this}-main-status {
    // display: none;
  }

  &:hover {
    background-color: #f0f0f0;
    box-shadow: 0 4px 6px -3px rgba(#000, 0.35);

    #{$this}-main {
      &-details {
        &-name {
          color: $colorBrandDark;
        }

        &-other-edit-button {
          display: block;
        }
      }

      &-actions {
        &-grid {
          opacity: 1;
        }
      }

      &-date {
        opacity: 0;
        pointer-events: none;
      }
    }
  }

  &.-rename {
    #{$this}-main {
      &-details {
        &-name {
          /deep/ .input {
            margin-right: 23px;
          }
        }

        &-other-edit-button {
          display: block;
        }
      }
    }
  }

  &.order:hover {
    background-color: #f0f0f0;
    box-shadow: 0 4px 6px -3px rgba(#000, 0.35);

    #{$this}-main {
      &-details {
        &-name {
          color: $colorBrandDark;
        }
      }

      &-actions {
        &-grid {
          opacity: 1;
        }
      }

      &-price {
        /*opacity: 0;*/
        /*pointer-events: none;*/
      }
    }
  }

  &-adaptiveWrapper {
    position: relative;
    display: flex;
  }

  &-main {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    margin-left: -4px;
    margin-right: -4px;
    font-size: 14px;
    line-height: 1.2;

    & > * {
      padding-left: 4px;
      padding-right: 4px;
    }

    &-status {
      display: flex;
      width: 60px;

      .orderCard-main-actions-grid-item:last-child {
        margin: 0;
      }
    }

    &-details {

      &-name {
        display: inline-block;
        color: $colorBrand;
        margin-bottom: 5px;
        flex-wrap: wrap;
        position: relative;

        & > span {
          line-height: 1.5;
          text-decoration: underline;
          text-underline-position: under;
          padding-right: 8px;
        }

        & input {
          max-width: 300px;
        }

        /deep/ .input {
          display: inline-block;
          max-width: 300px;
        }
      }

      &-subs {
        font-size: 0.7em;
        color: $colorGrayMedium;

        & > * {
          /*white-space: nowrap;*/
          /*overflow: hidden;*/
          /*text-overflow: ellipsis;*/

          &:not(:last-child) {
            margin-bottom: 4px;
          }
        }
      }
    }

    &-split {
      flex: 1 1 auto;
    }

    &-number {
      line-height: 1.5;
      align-self: flex-start;
      width: 66px;
      box-sizing: content-box;
      flex: 0 0 auto;
    }

    &-details {
      display: flex;
      /*Попытка резины */
      flex: 1 1 auto;
      min-width: 150px;
      width: 100%;
      /*-------------- */

      &-other {
        position: relative;
        display: inline-block;
        align-items: center;
        //align-items: flex-start;
        //margin-left: -4px;
        //margin-right: -4px;

        & > * {
          padding: 0 4px;
        }

        &-edit {
          flex: 0 0 auto;

          &-button {
            display: none;
            /*padding: 5px;*/
            cursor: pointer;
            color: $colorGrayMedium;
            position: absolute;
            top: 0;
            left: -20px;
            background-color: #f0f0f0;
            box-shadow: 0 0 5px 5px #f0f0f0;

            &:hover {
              color: #4d4d4d;
            }

            & > svg {
              fill: currentColor;
              width: 15px;
              height: 15px;
            }
          }
        }

        &-nds {
          position: relative;
          flex: 0 0 auto;
          text-transform: uppercase;
          background-color: #fff;
          color: #4d4d4d;
          border: 1px solid #9d9e9e;
          text-decoration: none;
          line-height: 1.1;
          height: 16px;
          font-size: 14px;
          /*box-sizing: content-box;*/

          &._corss {
            &:before {
              position: absolute;
              top: 6px;
              left: 2px;
              content: '';
              width: 32px;
              height: 1px;
              background-color: $colorTextMain;
            }
          }
        }
      }

      &-content {
        /*Попытка резины */
        flex: 1 1 auto;
        min-width: 150px;
        /*-------------- */
        &._noEdit {
          #{$this}-main-details-name {
            color: $colorTextMain;

            & > span {
              text-decoration: none;
            }
          }

          #{$this}-main-details-subs {
            color: $colorTextMain;
            text-decoration: none;
          }
        }
      }
    }

    &-actions {
      position: relative;
      width: 150px;
      flex: 0 0 auto;

      &.orders {
        width: 75px;
        padding-left: 30px;
        box-sizing: content-box;
      }

      &-grid {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: -4px;
        margin-right: -4px;
        opacity: 0;

        &-item {
          padding-left: 4px;
          padding-right: 4px;

          &:last-child {
            margin-left: 10px;
          }

          &._disabled {
            pointer-events: none;
          }
        }
      }

      &-button {
        cursor: pointer;
        color: #9d9e9e;

        &:hover {
          color: #4d4d4d;
        }

        & > svg {
          fill: currentColor;
          width: 25px;
          height: 25px;
        }
      }
    }

    &-date {
      position: absolute;
      top: calc(50% - (0.5em * 1.2));
      right: 0;
    }

    &-price {
      flex: 0 0 auto;
      padding-left: 30px;
      padding-right: 30px;
      width: 110px;
      font-weight: 500;
      text-align: right;
      box-sizing: content-box;

      b {
        font-weight: 500;
      }
    }

    &-procedures {
      position: relative;
      /*padding-left: 30px;*/
      width: 140px;
      box-sizing: content-box;
      flex: 0 0 auto;
      /*width: 100%;*/
      &._row {
        & div {
          display: flex;
          margin: -5px;

          & > span {
            display: block;
            flex: 1 1 auto;
            padding: 5px;
          }
        }
      }

      .status {
        position: absolute;
        display: block;
        bottom: -17px;
        white-space: nowrap;
        right: 0;
        width: auto;
        min-width: 100%;
        text-align: center;
        font-family: $fontMain;
        font-size: 11px;
        color: #9d9e9e;

        &._date {
          left: 3px;
          bottom: -20px;
          right: inherit;
          text-align: left;
        }
      }
    }
  }

  &-aside {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    /*padding-left: 15px;*/
    position: relative;

    &-status {
      position: absolute;
      /*top: 0;*/
      right: -31px;

      & > svg {
        width: 15px;
        height: 20px;
      }
    }
  }

  @media all and (max-width: getBreakpointVal(lg)) {
    &-main {

      &-price {
        padding-left: 15px;
        text-align: center;
        /*min-width: 150px;*/
      }

      &-procedures {
        padding-left: 15px;
      }

      &-date {
        /*position: relative;*/
        /*right: 0;*/
      }

      &-details {

        &-name {
          /*max-width: 150px;*/
        }

        &-subs {
          /*max-width: 150px;*/
        }
      }
    }
  }

  @media all and (max-width: getBreakpointVal(md)) {
    &-main {
      &-actions {
        &-grid {
          display: none !important;
        }
      }
    }
    &:hover {
      background-color: #fff;
      cursor: default;

      #{$this} {
        &-main {
          &-actions {
            /*opacity: 0;*/
          }

          &-date {
            /*position: static;*/
            opacity: 1;
            pointer-events: auto;
          }

          &-details-name {
            color: $colorBrand;
          }
        }
      }
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    & {
      padding-right: 10px;
    }
    &-main {
      flex-direction: column;
      align-items: stretch;

      &-number {
        margin-bottom: 5px;
        font-size: 14px;
      }

      &-details {
        &-content {
        }

        &-name {
          max-width: none;
          white-space: normal;
          font-size: 14px;
        }

        &-subs {
          max-width: none;

          & > * {
            white-space: normal;
          }
        }

        &-other {
          &-edit {
            display: none;
          }
        }
      }

      &-actions {
        display: none;
      }

      &-price {
        font-size: 14px;
        padding-left: 4px;
        text-align: left;
        /*display: flex;*/
        /*justify-content: space-between;*/
        margin-top: 20px;
        margin-bottom: 20px;
        width: 210px;
        padding-right: 0;

        & span:first-child {
          padding-right: 20px;
        }
      }

      &-procedures {
        padding-left: 4px;
        align-self: flex-start;
      }

      &-status {
        position: absolute;
        z-index: 1;
        bottom: 0;
        right: 0;
      }
    }
    &-aside {
      align-items: flex-start;
      margin-left: -4px;
      margin-right: -4px;

      & > * {
        padding-left: 4px;
        padding-right: 4px;
      }

      &-status {
        position: static;
        width: 28px;
      }
    }
  }
}
</style>
