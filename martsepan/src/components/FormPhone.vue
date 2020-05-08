<template>
  <div class="input">
    <masked-input class="input-field"
                  slot="input"
                  :id="id"
                  :name="name"
                  :placeholder="placeholder"
                  :mask="mask"
                  :value="value"
                  hasErrors="hasErrors"
                  :error="error"
                  v-validate=""
                  @input="$emit('input', $event)">
                  </masked-input>
    <div class="input-hint" v-if="hasErrors">
      {{ error }}
    </div>
  </div>
</template>

<script>
import maskedInput from 'vue-masked-input'
export default {
  name: 'formInput',
  props: ['id', 'placeholder', 'name', 'value', 'hasErrors', 'error', 'disabled', 'mask'],
  data () {
    return {}
  },
  components: {
    maskedInput
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.input {
  position: relative;
  &-field {
    box-sizing: border-box;
    width: 100%;
    padding: 7px 10px;
    border: 1px solid #9d9e9e;
    border-radius: 1px;
    line-height: 1;
    font-family: $fontMain;
    font-size: 14px;
    box-shadow: inset 0 1px 3px 0 rgba(#000, 0.3);
    color: $colorTextMain;
    opacity: 1;
    transition: opacity $time;

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &-hint {
    @include hintBlock;
    right: 20px;
  }
  & input::placeholder {
    font-family: $fontMain;
    color: #9d9e9e;
  }
}
.input_number .input-field {
  width: 70px;
}
</style>
