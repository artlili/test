<template functional>
  <div class="tab" :class="{'_active': props.active, '_nosubtext': !props.subtext}" v-on="listeners">
    <div class="tab-icon">
      <svg class="icon-svg" v-if="props.icon">
        <use :xlink:href="`#${props.icon.id}`"></use>
      </svg>
    </div>
    <div class="tab-mainText">
      {{ props.text }}
    </div>
    <div class="tab-subtext" v-if="props.subtext">
      {{ props.subtext }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab',
  functional: true
}
</script>

<style lang="scss" scoped>
.tab {
  $this: &;
  padding: 7px 8px;
  background-color: $colorGrayLight;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;

  &._active {
    background-color: $colorBrand;
    &:hover {
      background-color: $colorBrand;
      #{$this} {
        &-icon {
          fill: #fff;
        }
        &-mainText, &-subtext {
          color: #fff;
        }
      }
    }
    #{$this} {
      &-icon {
        fill: #fff;
      }
      &-mainText, &-subtext {
        color: #fff;
      }
    }
  }

  &._nosubtext {
    padding: 13px 20px;
  }

  &:hover {
    background-color: $colorBrandMedium;
    #{$this} {
      &-icon {
        /*fill: #fff;*/
      }
      &-mainText, &-subtext {
        color: $colorTextMain;
      }
    }
  }

  &-icon {
    display: none;
    width: 25px;
    height: 25px;
    fill: $colorBrand;
    margin-bottom: 5px;
  }

  &-mainText {
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }

  &-subtext {
    font-size: 11px;
    color: $colorGrayMedium;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
    /*max-width: 200px;*/
    // Полная херня. В дизайне примерно так и сделано.
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    display: flex;
    flex-direction: column;
    min-height: 80px;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: $colorGrayLight;
    }
    &-icon {
      display: inline-block;
    }
    &-mainText {
      line-height: 1.2;
    }
    &-subtext {
      display: none;
    }
  }
}

._disable .tab {
  background-color: $colorGrayLight;
  opacity: 0.8;
  cursor: wait;

  &._active {
    background-color: $colorBrand;
    &:hover {
      .tab-subtext {
        color: #fff;
      }
    }
  }

  &:hover {
    .tab-subtext {
      color: $colorGrayMedium;
    }
  }
}
</style>
