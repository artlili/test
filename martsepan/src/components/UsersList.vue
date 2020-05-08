<template>
  <div class="usersTabs">
    <!-- {{newUserId}}
    {{activeUser}} -->
    <div class="usersTabs-adaptive" @click="onAdaptiveTitleClick" :class="{'-active': listOpened}">
      <svg class="usersTabs-adaptive-icon">
        <use :xlink:href="`#${arrow.id}`"></use>
      </svg>
      <span class="usersTabs-adaptive-name">
        to: {{ userName }}
      </span>
    </div>
    <transition name="fade">
      <div class="usersTabs-list" v-show="showList">
        <div class="usersTabs-grid">
          <div class="usersTabs-grid-item" v-for="(user, index) in users" :key="index">
            <div class="usersTabs-user"
                 :class="{'_active': activeUser === user.id}"
                 @click="onUserTabClick(user.id)">
              <span class="usersTabs-user-name">
                {{ user.name }}
              </span>
              <div class="usersTabs-user-remove" @click.stop="$emit('userRemoved', user.id)" v-if="!user.superUser">
                <svg class="usersTabs-user-remove-icon">
                  <use :xlink:href="`#${removeIcon.id}`"></use>
                </svg>
              </div>
            </div>
          </div>
          <div class="usersTabs-grid-item">
            <div class="usersTabs-user usersTabs-addButton"
                 :class="{'_active': newUserId ? activeUser === newUserId : activeUser === 'new'}"
                 @click="onUserTabClick('new')">
              <svg class="usersTabs-addButton-icon">
                <use :xlink:href="`#${addIcon.id}`"></use>
              </svg>
              <span>
            Добавить пользователя
          </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import addIcon from '@/assets/svg/add.svg'
import arrow from '@/assets/svg/arrow_down.svg'
import removeIcon from '@/assets/svg/cross.svg'
import { GRID_BREAKPOINTS } from '@/constants'

export default {
  name: 'usersTabs',
  props: {
    users: {
      type: Array,
      default: () => []
    },
    activeUser: [String, Number],
    newUser: [String, Number],
    userId: 'test'
  },
  data () {
    return {
      addIcon,
      arrow,
      removeIcon,
      listOpened: false
    }
  },
  computed: {
    userName () {
      let result = this.users.find(u => u.id === this.activeUser)
      if (result) {
        result = result.login
      } else {
        result = 'Новый пользователь'
      }
      return result
    },
    newUserId () {
      let newUserLogin = this.users.find(user => user.login === this.newUser)
      if (newUserLogin) {
        return newUserLogin.id
      }
    },
    showList () {
      return (this.$mq.resize && this.$mq.above(GRID_BREAKPOINTS.sm)) || this.listOpened
    }
  },
  methods: {
    onAdaptiveTitleClick () {
      this.listOpened = !this.listOpened
    },
    onUserTabClick (e) {
      this.$emit('userChanged', e)
      this.listOpened = false
    }
  }
}
</script>

<style lang="scss" scoped>
.usersTabs {
  $this: &;
  font-family: $fontMain;
  font-size: 14px;

  &-list {
    position: static;
  }

  &-adaptive {
    display: none;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid transparent;
    cursor: pointer;

    &-name {
      font-weight: 500;
    }

    &-icon {
      width: 12px;
      height: 12px;
      fill: $colorGrayMedium;
      margin-right: 8px;
      transition: transform $time;
    }
    &.-active {
      border-bottom-color: $colorBorderDefault;
      #{$this}-adaptive {
        &-icon {
          transform: rotate(180deg);
        }
      }
    }
  }

  &-grid {
  }

  &-user {
    position: relative;
    padding: 15px 40px 15px 10px;
    cursor: pointer;
    background-color: $colorGrayLight;
    transition: background $time, color $time;
    &:hover {
      background-color: lighten($colorGrayLight, 4.5%);
    }
    &._active {
      background-color: $colorBrand;
      color: #fff;

      #{$this}-user-remove {
        &:hover {
          color: #fff;
        }
      }
    }
    &-name {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
    &-remove {
      width: 30px;
      height: 30px;
      position: absolute;
      top: calc(50% - 15px);
      right: 10px;
      text-align: center;
      transition: color $time;
      color: $colorTextMain;

      &:hover {
        color: $colorGrayMedium;
      }

      &-icon {
        width: 20px;
        height: 30px;
        fill: currentColor;
      }
    }
  }

  &-addButton {
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      #{$this}-addButton {
        &-icon {
          fill: $colorBrand;
        }
      }
    }

    &._active {
      #{$this}-addButton {
        &-icon {
          fill: #fff;
        }
      }
    }

    &-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 10px;
      fill: $colorGrayMedium;
      transition: fill $time;
      flex: 0 0 auto;
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    position: relative;
    margin-left: -15px;
    margin-right: -15px;
    padding: 0 10px;
    background-color: $colorGrayLight;

    &-list {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      box-shadow: 0 3px 3px rgba(#000, 0.35);
    }

    &-adaptive {
      display: flex;
    }

    &-user {
      &-name {
        display: inline-block;
        position: relative;
        padding-left: 20px;
        &::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: $colorBrand;
          border-radius: 50%;
          top: 2px;
          left: 0;
          opacity: 0;
          transition: opacity $time;
        }
      }
      &._active {
        background-color: $colorGrayLight;
        color: $colorBrand;

        #{$this}-user {
          &-name {
            &::before {
              opacity: 1;
            }
          }
        }
      }
    }

    &-addButton {
      &._active {
        #{$this}-addButton {
          &-icon {
            fill: $colorBrand;
          }
        }
      }
    }
  }
}
</style>
