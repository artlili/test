<template>
  <Modal @modalClosed="callback($event)" :active="show" size="sm">
    <div class="confirm">
      <div class="confirm-text">
        Вы действительно хотите это сделать?
      </div>
      <div class="confirm-buttons">
        <div>
          <FormButton @click="callback(true)" type="skeleton" class="btn_confirm">Да</FormButton>
        </div>
        <div>
          <FormButton @click="callback(false)" type="link">Нет</FormButton>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'
import FormButton from '@/components/FormButton'

export default {
  name: 'confirm',
  components: {
    Modal,
    FormButton
  },
  props: {
    callback: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>

<style lang="scss">
.confirm {
  &-text {
    margin-bottom: 30px;
  }
  &-buttons {
    @include createGrid(30px);
    justify-content: space-between;
  }
}
</style>
