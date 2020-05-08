<template>
  <div class="widgetManager">
    <transition name="slideWidget" mode="out-in" @enter="scrollToBottom">
      <div class="widgetManager-container" v-if="open" key="open">
        <div class="widgetManager-wrapper">
          <div class="widgetManager-header">
            <div class="widgetManager-icon">
              <img src="../assets/img/profile_icon.png" alt="">
            </div>
            <div class="widgetManager-group">
              <div class="widgetManager-person">
                <div class="widgetManager-person-cell">Ваш менеджер</div>
                <div class="widgetManager-person-cell">{{manager.mname}}</div>
              </div>
              <div class="widgetManager-contact">
                <div class="widgetManager-contact-cell">(812)345-6789 {{manager.phone}}</div>
                <div class="widgetManager-contact-cell">{{manager.mmail}}</div>
              </div>
            </div>
          </div>
          <div class="widgetManager-main">
            <template v-if="arrMessage.length > 0" v-for="(item, index) in arrMessage">
              <div class="widgetManager-message" :key="index"
                   :class="{'_in': item.fuser === manager.mname, '_out': item.fuser !== manager.mname}">
                <div class="widgetManager-message-who">
                  <span>{{item.fuser}}</span>,
                  <span>{{item.dc}}</span>
                </div>
                <div class="widgetManager-message-text">{{item.stxt}}</div>
              </div>
            </template>
          </div>
          <div class="widgetManager-bottom">
            <div class="widgetManager-input">
              <formInput v-model="selectMessage" @keyup.enter="clickSend(selectMessage)"
                         placeholder="Введите значение...">
              </formInput>
            </div>
            <div class="widgetManager-send" @click="clickSend(selectMessage)">
              <svg class="icon-svg">
                <use :xlink:href="`#${sendIcon.id}`"></use>
              </svg>
            </div>
          </div>
          <div class="widgetManager-control">
            <div class="widgetManager-btn" v-if="!open" @click="onClick('show')">
              <svg class="icon-svg">
                <use :xlink:href="`#${dialog.id}`"></use>
              </svg>
            </div>
            <div class="widgetManager-btn" v-if="open" @click="onClick('hide')">
              <svg class="icon-svg">
                <use :xlink:href="`#${arrowLeft.id}`"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="widgetManager-control _out" v-else key="close">
        <div class="widgetManager-btn" @click="onClick('show')"  v-if="contactIsAvailable">
          <svg class="icon-svg">
            <use :xlink:href="`#${dialog.id}`"></use>
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FormInput from '@/components/FormInput'
import IconButton from '@/components/IconButton'
import sendIcon from '@/assets/svg/send.svg'
import arrowLeft from '@/assets/svg/arrow_left.svg'
import dialog from '@/assets/svg/dialog.svg'
import { WidgetService } from '@/services/WidgetService'
import { bus } from '@/bus.js'
import { privilegesMixin } from '@/mixins'

export default {
  name: 'widgetManager',
  mixins: [privilegesMixin],
  props: {
    show: false
  },
  components: {
    IconButton,
    FormInput
  },
  data () {
    return {
      sendIcon,
      arrowLeft,
      dialog,
      selectMessage: '',
      open: this.show,
      managerLoaded: false,
      messagesLoaded: false,
      name: '',
      arrMessage: [],
      manager: {},
      isGettingMessages: false
    }
  },
  computed: {
    test () {
      let obj = {}
      if (open) {
        obj = { action: 'hide', icon: arrowLeft }
      } else {
        obj = { action: 'show', icon: dialog }
      }
      return obj
    },
    loaded () {
      return this.managerLoaded && this.messagesLoaded
    }
  },
  created () {
    this.TO = null
    this.getManager()
    bus.$on('show', (data) => {
      this.open = data
      this.getData()
        .then(this.scrollToBottom)
    })
  },
  beforeDestroy () {
    this.clearTO()
  },
  methods: {
    onClick (action) {
      if (action === 'show') {
        this.open = true
        this.getData()
          .then(this.scrollToBottom)
      }
      if (action === 'hide') {
        this.open = false
        this.clearTO()
      }
    },
    clearTO () {
      clearTimeout(this.TO)
    },
    scrollToBottom () {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.widgetManager-main')
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },
    clickSend (msg) {
      if (msg) {
        this.selectMessage = ''
        if (!this.isGettingMessages) {
          const date = new Date(Date.now())
          const dateString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}-${date.getMonth() + 1}-${String(date.getFullYear()).substring(2)}`
          this.arrMessage.push({
            'stxt': msg,
            'fuser': this.name,
            'dc': dateString
          })
          this.scrollToBottom()
        } else {
          this.getData()
        }
        this.sendData(msg)
      }
    },
    getData () {
      this.isGettingMessages = true
      return WidgetService.getData()
        .then((data) => {
          this.arrMessage = data
        })
        .catch(e => console.error('error getting data', e))
        .finally(() => {
          this.clearTO()
          if (this.open) {
            this.TO = setTimeout(this.getData, 5000)
          }
          this.isGettingMessages = false
        })
    },
    getManager () {
      return WidgetService.getManager()
        .then((data) => {
          this.manager = data
        })
        .catch(e => console.error('error getting manager', e))
        .finally(() => {
        })
    },
    sendData (msg) {
      return WidgetService.sendData(msg)
        .catch(e => console.error('error sending message', e))
        .finally(() => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.widgetManager {
  /*width: 100%;*/
  $this: &;
  position: fixed;
  z-index: 2;
  top: 300px;
  left: 0;
  font-family: $fontMain;
  font-size: 14px;
  &-container {
    position: relative;
    z-index: 3;
    width: 375px;
    /*width: 100%;*/
  }
  &-wrapper {
    background-color: #e5e5e5;
    /*max-width: 375px;*/
    /*width: 100%;*/
    box-shadow: 0px 3px 10px rgba(#000, 0.3);
  }
  &-header {
    position: relative;
    display: flex;
    height: 50px;
    font-size: 13px;
    line-height: 18px;
    color: #fde3d7;
    align-items: center;
    background-color: $colorBrand;
  }
  &-icon {
    position: absolute;
    top: -10px;
    left: 10px;
  }
  &-group {
    padding-left: 80px;
    padding-right: 10px;
    flex: 1 1 auto;
    display: flex;
    justify-content: space-between;
  }
  &-person {
    &-cell:first-child {
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
    }
  }
  &-contact {
  }
  &-main {
    display: flex;
    flex-direction: column;
    /*width: 375px;*/
    height: 440px;
    overflow-y: scroll;

    /*padding: 20px 0;*/
    border-bottom: 1px solid #9d9e9e;
  }
  &-message {
    padding: 20px 0;
    max-width: 340px;
    width: 100%;
    &-who {
      padding: 0 20px 10px;
      font-size: 12px;
      color: #9d9e9e;
    }
    &-text {
      border: 1px solid #9d9e9e;
      padding: 10px 20px;
      line-height: 21px;
      word-break: break-word;
    }
    &._in {
      align-self: flex-start;
      /*text-align: left;*/
      & #{$this}-message-text {
        background-color: #ffffff;
        border-left: transparent;
      }
      & #{$this}-message-who {
        text-align: left;
      }
    }
    &._out {
      align-self: flex-end;
      & #{$this}-message-text {
        background-color: $colorBrandLight;
        border-right: transparent;
      }
      & #{$this}-message-who {
        text-align: right;
      }
      /*text-align: right;*/
    }
  }
  &-bottom {
    display: flex;
    padding: 10px 10px 10px 20px;
  }
  &-input {
    width: 100%;
    padding-right: 10px;
  }
  &-send {
    cursor: pointer;
    width: 32px;
    height: 32px;
    .icon-svg {
      width: 100%;
      height: 100%;
      fill: #9d9e9e;
    }
    &:hover {
      .icon-svg {
        fill: #ff7436;
      }
    }
  }
  &-control {
    position: absolute;
    right: -50px;
    top: 0;
    &._out {
      right: inherit;
      top: inherit;
      bottom: 0;
    }
  }
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-color: $colorBrand;
    box-shadow: 0px 3px 10px  -1px rgba(#000, 0.3);
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    &:hover {
      background-color: $colorBrandDark;
    }
    .icon-svg {
      width: 30px;
      height: 30px;
      fill: #ffffff;
    }
  }
  @media all and (max-width: 453px) {
    &-contact {
      display: none;
    }
    &-control {
      &._inner {
        right: 0;
        & #{$this}-btn {
          box-shadow: none;
        }
      }
    }
  }
}
</style>
