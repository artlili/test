<template>
  <transition name="fade">
    <div v-show="active" class="message-box" :class="{ [`_${size}`]: size }">
      <div class="message-box__wrapper">
        <div class="message-box__content">
          <div class="message-box__title  _border">
            <slot name="title"></slot>
          </div>
          <div class="message-box__main">
            <div class="message-box__block">
              <div class="message-box__row">
                <div class="message-box__item">
                  <slot name="body"></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="message-box__buttons">
            <div class="message-box__buttons-item">
              <slot name="buttons"></slot>
            </div>
          </div>
        </div>
        <div class="message-box__close" @click="$emit('modalClosed', false)">
          <svg class="icon-svg">
            <use :xlink:href="`#${closeIcon.id}`"></use>
          </svg>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import closeIcon from '@/assets/svg/cross.svg'

export default {
  name: 'modal',
  props: {
    closeOnClickOutside: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'lg',
      validator (val) {
        const set = new Set(['lg', 'md', 'sm', 'BPZ'])
        return set.has(val)
      }
    }
  },
  model: {
    prop: 'active',
    event: 'modalClosed'
  },
  data () {
    return {
      closeIcon
    }
  },
  methods: {
    _closeOnClickOutside (e) {
      if (this.closeOnClickOutside) {
        if (!e.target.closest('.message-box__wrapper')) {
          this.$emit('modalClosed', false)
        }
      }
    }
  },
  mounted () {
    this.$el.addEventListener('click', this._closeOnClickOutside)
  },
  beforeDestroy () {
    this.$el.removeEventListener('click', this._closeOnClickOutside)
  }
}
</script>

<style lang="scss" scoped>
.message-box {
  $this: &;

  height: 100%;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  background: rgba(#000, 0.5);
  padding: 60px 30px;

  &__title {
    font-family: $fontHeading;
    font-size: 32px;
    padding-bottom: 20px;
    & a {
      color: $colorBrand;
      &:hover {
        color: $colorBrandDark;
      }
    }
    &._border {
      border-bottom: 1px solid #f34f18;
    }
  }

  &__block {
    padding-bottom: 30px;
  }
  &__row {
    padding: 15px 0 0;
  }
  &__item {
    display: flex;
    line-height: 1.2;
    border-bottom: 1px solid #d3d3d3;
    padding-bottom: 15px;
  }

  &__buttons {
    display: flex;
    &-item {
      padding-right: 20px;
    }
  }

  &._BPZ {
    #{$this}__wrapper {
      max-width: 1170px;
    }
  }

  &._lg {
    #{$this}__wrapper {
      max-width: 930px;
    }
  }

  &._md {
    #{$this}__wrapper {
      max-width: 690px;
    }
  }

  &._sm {
    #{$this}__wrapper {
      max-width: 450px;
    }
  }

  &__close {
    position: absolute;
    right: -30px;
    top: -30px;
    width: 30px;
    height: 30px;
    fill: #fff;
    opacity: .5;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  &__wrapper {
    position: relative;
    width: 100%;
    padding: 30px 20px;
    background-color: #fff;
    margin: 0 auto;
  }
  @media all and (max-width: getBreakpointVal(md)) {
    padding-left: 0;
    padding-right: 0;

    &._lg {
      #{$this} {
        &__wrapper {
          max-width: none;
          padding-left: 15px;
          padding-right: 15px;
        }
        &__close {
          right: 0;
        }
      }
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    &__buttons {
      flex-direction: column;
      &-item {
        padding: 5px 0;
      }
    }
    &._md {
      #{$this} {
        &__wrapper {
          max-width: none;
        }
        &__close {
          right: 0;
        }
      }
    }
  }

  @media all and (max-width: getBreakpointVal(sm) - 250px) {

    &._sm {
      #{$this} {
        &__wrapper {
          max-width: none;
        }
        &__close {
          right: 0;
        }
      }
    }
  }
}
</style>
