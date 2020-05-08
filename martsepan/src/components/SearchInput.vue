<template>
  <div class="searchInput">
    <div class="searchInput-field">
      <FormInput :disabled="disabled" :value="value" :placeholder="placeholder" @change="$emit('change', $event)" @input="$emit('input', $event)" @keydown.enter="onKeydown($event)"></FormInput>
    </div>
    <div class="searchInput-button">
      <IconButton :icon="searchIcon" @click="$emit('search')"></IconButton>
    </div>
  </div>
</template>

<script>
import FormInput from '@/components/FormInput'
import IconButton from '@/components/IconButton'
import searchIcon from '@/assets/svg/search.svg'

export default {
  name: 'searchInput',
  components: {
    FormInput,
    IconButton
  },
  props: {
    placeholder: String,
    value: String,
    disabled: Boolean
  },
  data () {
    return {
      searchIcon
    }
  },
  methods: {
    onKeydown () {
      this.$emit('search')
    }
  }
}
</script>

<style lang="scss">
.searchInput {
  position: relative;
  &-button {
    position: absolute;
    top: 0;
    right: 10px;
    transform: translateY(25%)
  }
}
</style>
