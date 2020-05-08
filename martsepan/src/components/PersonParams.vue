<template>
  <div class="personParam">
    <div class="personParam-title">
      {{ name }} - задайте параметры
    </div>
    <div class="personParam-grid">
      <div class="personParam-grid-fields">
        <div class="personParam-grid-fields-item" v-for="(item, index) in params" :key="index">
          <template v-if="item.idparam !== 0 && item.idparam !== void 0">
            <FormGroup :label="item.name" :for="`${item.idparam}_${index}`">
              <FormSelect @input="setInputParam($event, index, false)"
                          :value="param[index]"
                          slot="input"
                          :options="item.values"
                          :id="`${item.idparam}_${index}`"></FormSelect>
            </FormGroup>
          </template>
          <template v-if="item.idWork !== 0 && item.idWork !== void 0">
            <FormGroup :for="`${item.idWork}_${index}`">
              <FormCheckbox @input="setInputParam($event, index, true)"
                            :value="work[index]"
                            slot="input"
                            :label="item.nameWork"
                            :options="item.values"
                            :id="`${item.idWork}_${index}`"></FormCheckbox>
            </FormGroup>
          </template>
        </div>
      </div>
      <div class="personParam-grid-actions">
        <div class="personParam-grid-actions-item" v-if="!action">
          <FormButton type="solid" @click="concludeEditing('add')" size="sm">Добавить персонализацию</FormButton>
        </div>
        <div class="personParam-grid-actions-item" v-if="action">
          <FormButton type="solid" @click="concludeEditing('save')" size="sm">Сохранить персонализацию</FormButton>
        </div>
        <div class="personParam-grid-actions-item">
          <FormButton type="skeleton" @click="concludeEditing('cancel')" size="sm">Отменить</FormButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormCheckbox from '@/components/FormCheckbox'

export default {
  name: 'personParam',
  components: {
    FormCheckbox
  },
  props: {
    name: {
      type: String,
      required: true
    },
    params: {
      type: Array
    },
    item: {
      type: Object,
      id: '',
      name: ''
    },
    action: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isFetchingData: false,
      paramPossible: [],
      param: {},
      work: {}
    }
  },
  created () {
    this.setParam()
    this.setWorks()
  },
  methods: {
    setParam () {
      for (let i = 0; i < this.params.length; i++) {
        let curr = this.params[i]
        // Выбираем известное значение или первый элемент
        if (curr.idparam !== 0 && curr.idparam !== void 0) {
          this.$set(this.param, i, '')
          if (curr.value) {
            this.param[i] = curr.value
          } else {
            this.param[i] = curr.values[0].id
          }
        }
      }
    },
    setWorks () {
      for (let i = 0; i < this.params.length; i++) {
        let curr = this.params[i]
        // Выбираем известное значение или первый элемент
        if (this.isWork(curr)) {
          this.$set(this.work, i, true)
          this.work[i] = Boolean(curr.InOut)
        }
      }
    },
    isWork (param) {
      return param.idWork !== 0 && param.idWork !== void 0
    },
    setInputParam (value, index, isWork) {
      if (isWork) {
        this.work[index] = value
      } else {
        this.param[index] = value
      }
    },
    concludeEditing (action) {
      let workIds = {}
      for (let index in this.work) {
        workIds[index] = this.params[index].idWork
      }
      if (action === 'add') {
        this.$emit('personAdded', {action: 'add', person: this.item, param: this.param, work: this.work, workIds})
      }
      if (action === 'save') {
        this.$emit('personAdded', {action: 'save', person: this.item, param: this.param, work: this.work, workIds})
      }
      if (action === 'cancel') {
        this.$emit('cancel')
      }
    }
  }
}
</script>

<style lang="scss">
.personParam {
  height: $createRequestPersonalsContainerHeight;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid $colorGrayMedium;
  padding: 20px;

  &-title {
    font-weight: 500;
    margin-bottom: 20px;
  }

  &-grid {
    @include createGrid(30px);

    &-fields {
      flex: 0 0 auto;
      width: 40%;

      &-item {
        margin-bottom: 15px;
      }
    }

    &-actions {
      @include createGrid(20px);
      flex: 1 1 auto;
      align-items: flex-start;

      &-item {
        &:first-child {
        }
      }
    }
  }

  @media all and (max-width: getBreakpointVal(sm)) {
    height: auto;

    &-grid {
      flex-direction: column;

      &-fields {
        width: 100%;
        margin-bottom: 20px;

        &-item {
          margin-bottom: 20px;
        }
      }

      &-actions {
        @include nullifyGrid;
        width: 100%;
        flex-direction: column;
        align-items: stretch;

        &-item {
          &:not(:last-child) {
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>
