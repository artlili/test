<template functional>
  <button class="sortButton"
          :class="{'_descending': props.direction === 'descending', '_ascending': props.direction === 'ascending', '-active': props.active}"
          v-on="listeners">
    <span class="sortButton-name">
      <slot></slot>
    </span>
    <span class="sortButton-icon"></span>
  </button>
</template>

<script>

export default {
  name: 'sortButton',
  functional: true
}
</script>

<style lang="scss" scoped>
.sortButton {
  $this: &;
  display: inline-flex;
  align-items: center;
  border: 0;
  background: none;
  padding: 4px 5px 4px 9px;
  font-family: $fontMain;
  font-weight: 500;
  font-size: 13px;
  text-align: left;
  border-radius: 5px;
  color: $colorTextMain;
  line-height: 1.4;
  transition: background $time;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: $colorBrandMedium;

    #{$this}-icon {
      opacity: 1;
    }
  }

  &.-active {
    #{$this}-icon {
      opacity: 1;
    }
  }

  &._descending {
    #{$this}-icon {
      transform: scaleY(-1);
    }
  }

  &-icon {
    flex: 0 0 auto;
    box-sizing: content-box;
    width: 12px;
    height: 12px;
    margin-left: 5px;
    opacity: 0;
    transition: opacity $time, transform $time;
    background: center no-repeat url('../assets/img/caret.svg');
    background-size: contain;
  }
}
</style>
