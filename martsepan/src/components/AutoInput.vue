<template>
  <div class="autoInput">
    <FormInput ref="input" v-bind="$props" type="number" @input="onChange($event)"
               @blur="onBlur($event)" :disabled="disabled"></FormInput>
    <transition name="fade">
      <span v-if="hasErrors" class="error">{{errorText}}</span>
    </transition>
  </div>
</template>

<script>
import FormInput from '@/components/FormInput'
import { uniqueId } from '../helpers'

export default {
  name: 'autoInput',
  components: {
    FormInput
  },
  props: {
    multiplier: {
      type: Number
    },
    id: {
      type: [String, Number],
      default: uniqueId
    },
    value: {
      type: [String, Number]
    },
    name: {
      type: String
    },
    placeholder: {
      type: String
    },
    calcType: {
      type: String,
      default: 'minmax',
      validator (val) {
        const set = new Set(['multiply', 'minmax'])
        return set.has(val)
      }
    },
    allowZero: {
      type: Boolean,
      default: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      TO: null,
      errorText: '',
      hasErrors: false
    }
  },
  methods: {
    recalcMultiply (val) {
      let num = parseInt(val, 10)
      if (!isNaN(num)) {
        if (num > 0 && num % this.multiplier === 0) {
          this.$emit('input', num)
        } else {
          if (num === 0) {
            if (this.allowZero) {
              this.$emit('input', 0)
            } else {
              this.$emit('input', this.multiplier)
              this.$emit('errorInput')
            }
          } else {
            // Вычисляем ближайшее число, кратное коэффициенту
            let result = num > 0 ? (num + (this.multiplier - num % this.multiplier)) : (num + (this.multiplier + num % this.multiplier) * -1)
            result = result < 0 ? result * -1 : result
            this.$emit('input', result)
            this.$emit('errorInput')
          }
        }
      } else {
        this.$emit('input', 0)
      }
      this.$refs.input.$forceUpdate() // Not updating on itself for some reason
    },
    recalcMinMax (val) {
      let num = parseInt(val, 10)

      if (!isNaN(num)) {
        switch (true) {
          case (num > this.max):
            this.$emit('input', this.max)
            this.errorText = `Максимальный тираж ${this.max} шт.`
            setTimeout(() => {
              this.errorText = ''
              this.hasErrors = false
            }, 2000)
            break

          case (num < this.min):
            this.$emit('input', this.min)
            this.hasErrors = true
            this.errorText = `Минимальный тираж ${this.min} шт.`
            setTimeout(() => {
              this.errorText = ''
              this.hasErrors = false
            }, 2000)
            break

          default:
            this.$emit('input', num)
            this.errorText = ''
            this.hasErrors = false
            break
        }
      } else {
        this.$emit('input', 0)
        this.$emit('errorInput')
      }
      this.$refs.input.$forceUpdate() // Not updating on itself for some reason
    },
    onBlur (e) {
      const val = e.target.value
      switch (this.calcType) {
        case 'minmax':
          this.recalcMinMax(val)
          break

        case 'multiply':
          this.recalcMultiply(val)
          break

        default:
          break
      }
    },
    onChange (e) {
      // clearTimeout(this.TO)
      // this.TO = setTimeout(this.recalcMultiply.bind(this, e), 500)
      // console.log(e % this.multiplier)
      // this.$emit('input', e)
    }
  }
}
</script>

<style lang="scss">
.autoInput {
  position: relative;
  display: flex;
  align-items: center;
  .error {
    white-space: nowrap;
    position: absolute;
    font-size: 12px;
    color: $colorDanger;
    font-weight: 500;
    left: 125%;
  }
}

</style>
