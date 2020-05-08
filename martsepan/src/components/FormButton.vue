<template functional>
  <button class="button"
          :type="props.btnType || ''"
          v-bind="data.attrs"
          v-on="listeners"
          :class="[{
          '_solid': props.type === 'solid',
          '_skeleton': props.type === 'skeleton',
          '_link': props.type === 'link',
          '_hot': props.type === 'hotBooking',
          '_notColored': props.type === 'notColored',
          '_sm': props.size === 'sm',
          '_lg': props.size === 'lg',
          '_inline': props.block ? (props.block === false || props.block === 'false') : false,
          '-loading': props.isLoading,
          '-active': props.active
          }]
          .concat([data.class])
          .concat(data.staticClass)">
    <slot/>
    <span class="button-loader" v-if="props.isLoading">
      <span class="button-loader-wrapper">
        <svg xmlns:svg="www.w3.org/2000/svg" viewbox="0 0 20 20" class="button-loader-image">
          <circle cx="10" cy="10" r="3" class="button-loader-image-one"/>
          <circle cx="10" cy="10" r="8" class="button-loader-image-two"/>
          <circle cx="10" cy="10" r="13" class="button-loader-image-three"/>
          <circle cx="10" cy="10" r="18" class="button-loader-image-four"/>
        </svg>
      </span>
    </span>
    <span>
    <svg v-if="props.type === 'hotBooking'"
         class="button-icon" version="1.1" id="hot"
         xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
          <path d="M13.5,0.7c0,0,0.7,2.7,0.7,4.8c0,2.1-1.4,3.7-3.4,3.7c-2.1,0-3.6-1.7-3.6-3.7l0-0.4C5.2,7.5,4,10.6,4,14c0,4.4,3.6,8,8,8
                s8-3.6,8-8C20,8.6,17.4,3.8,13.5,0.7z M11.7,19c-1.8,0-3.2-1.4-3.2-3.1c0-1.6,1.1-2.8,2.8-3.1c1.8-0.4,3.6-1.2,4.6-2.6
                c0.4,1.3,0.6,2.6,0.6,4C16.5,16.9,14.4,19,11.7,19z"/>
    </svg>
  </span>
  </button>
</template>

<script>
import hot from '@/assets/svg/btn_hot.svg'

export default {
  name: 'formButton',
  functional: true,
  data () {
    return { hot }
  }
}
</script>

<style lang="scss" scoped>
.button {
  $this: &;
  appearance: none;
  margin: 0;
  padding: 7px;
  background: none;
  border: 0;
  line-height: 1;
  cursor: pointer;
  transition: all 100ms ease;
  outline: none;
  font-size: 14px;
  border-radius: 4px;
  width: 100%;
  /*box-sizing: content-box;*/

  &[disabled] {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
  &._skeleton[disabled] {
    opacity: 0.5;
    cursor: default;
    background-color: $colorGrayMedium !important;
    border-color: $colorGrayMedium !important;
    color: #ffffff !important;
    pointer-events: none;
  }

  /*&._sm {
    border-radius: 3px;
    font-size: 14px;
    font-family: $fontMain;
    font-weight: 400;
  }*/

  &._lg {
    border-radius: 4px;
  }

  &._solid {
    background-color: $colorBrand;
    font-size: 26px;
    color: #fff;
    box-sizing: border-box;
    box-shadow: 0 3px 3px 0 darken($colorBrand, 21.6%);
    font-family: $fontHeading;

    &.-active {
      background-color: lighten($colorBrand, 5.5%);
    }

    &._sm {
      border-radius: 3px;
      font-size: 14px;
      line-height: 1.3;
      padding: 7px 10px;
      font-family: $fontMain;
      font-weight: 400;
    }

    &:hover {
      background-color: lighten($colorBrand, 5.5%);
    }

    &:active {
      background-color: darken($colorBrand, 13%);
      box-shadow: none;
    }

  }
  &._notColored {
    border: 2px solid $colorBrand;
    font-size: 26px;
    color: $colorBrand;
    box-sizing: border-box;
    font-family: $fontHeading;

    &.-active {
      background-color: $colorBrand;
      color: #fff;
    }

    &._sm {
      border-radius: 3px;
      font-size: 14px;
      font-family: $fontMain;
      font-weight: 400;
    }

    &:hover {
      background-color: $colorBrand;
      color: #fff;
    }

    &:active {
      background-color: darken($colorBrand, 13%);
      border-color: darken($colorBrand, 13%);
    }

  }

  &._skeleton {
    border: 2px solid $colorBrand;
    background-color: #ffffff;
    font-family: $fontMain;
    color: $colorTextMain;
    padding: 5px 0;
    &.btn_confirm {
      padding: 5px 12px;
    }
    &.-active {
      background-color: $colorBrand;
      color: #fff;
    }

    &:hover {
      background-color: $colorBrand;
      color: #fff;
    }

    &:active {
      background-color: darken($colorBrand, 13%);
      border-color: darken($colorBrand, 13%);
    }

    &._lg {
      font-size: 26px;
      font-family: $fontHeading;
      color: $colorBrand;
      border-width: 3px;

      &.-active {
        background-color: $colorBrand;
        color: #fff;
      }

      &:hover {
        background-color: $colorBrand;
        color: #fff;
      }

      &:active {
        background-color: darken($colorBrand, 13%);
        border-color: darken($colorBrand, 13%);
      }
    }
    &._sm {
      /*border-radius: 3px;*/
      /*font-size: 14px;*/
      line-height: 1.3;
      padding: 5px 10px;
      //font-family: $fontMain;
      //font-weight: 400;
    }
  }
  &._hot {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
    border: 2px solid $colorBrand;
    font-family: $fontMain;
    color: $colorTextMain;
    padding: 4px;
    & span {
      line-height: 0;
    }

    &.-active {
      background-color: $colorBrand;
      color: #fff;
      &:hover {
        border-color: $colorBrandMedium;
        background-color: $colorBrandMedium;
      }
      #{$this}-icon {
        fill: #ffffff;
      }
    }

    &:hover {
      border-color: $colorBrandDark;
      /*color: #fff;*/
    }

    &:active {
      background-color: darken($colorBrand, 13%);
      border-color: darken($colorBrand, 13%);
    }

    &._lg {
      font-size: 26px;
      font-family: $fontHeading;
      color: $colorBrand;
      border-width: 3px;

      &.-active {
        background-color: $colorBrand;
        color: #fff;
      }

      &:hover {
        background-color: $colorBrand;
        color: #fff;
      }

      &:active {
        background-color: darken($colorBrand, 13%);
        border-color: darken($colorBrand, 13%);
      }
    }
  }
  &._link {
    &:hover {
      color: $colorBrand;
    }
  }
  &-icon {
    fill: $colorBrand;
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }
  &._inline {
    display: inline-block;
    width: auto;
  }

  &.-loading {
    position: relative;
    #{$this}-loader {
      display: block;
    }
  }

  &-loader {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    &-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.3)
    }
    &-image {
      width: 30px;
      height: 30px;
      position: absolute;
      top: calc(50% - 15px);
      left: calc(50% - 15px);
      /*display: block;
      width: 100%;
      height: 100%;
      width: auto;
      max-width: 200px;
      height: 200px;*/
      & > circle {
        fill: none;
        stroke-width: 2px;
      }
      &-one {
        stroke: #33ff33;
        stroke-dasharray: 4 11 4 0;
        animation: cr 3s linear infinite;
      }
      &-two {
        stroke: #ff7436;
        stroke-dasharray: 10 30 10 0;
        animation: co 2.5s linear infinite;
      }
      &-three {
        stroke: #33ff33;
        stroke-dasharray: 17 48 17 0;
        animation: cy 2s linear infinite;
      }
      &-four {
        stroke: #ff7436;
        stroke-dasharray: 23 69 23 0;
        animation: cg 1.5s linear infinite;
      }
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    padding: 7px 13px;

    &._skeleton {
      /*padding: 7px 13px;*/
    }
  }
}

@keyframes cr {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 19;
  }
}

@keyframes co {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 50;
  }
}

@keyframes cy {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 82;
  }
}

@keyframes cg {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 114;
  }
}
</style>
