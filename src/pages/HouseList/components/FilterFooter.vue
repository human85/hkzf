<script lang="ts" setup>
import { inject, type PropType } from 'vue'
import type { SelctedValues, Confirm, Cancel } from './Filter.vue'

const cancel = inject<() => void>('cancel') as Cancel
const confirm = inject('confirm') as Confirm
defineProps({
  openType: {
    required: true,
    type: String as PropType<keyof SelctedValues>
  },
  selected: {
    required: true,
    type: Array as PropType<string[]>
  }
})
</script>

<template>
  <div class="filter-footer">
    <button class="cancel" @click="cancel(openType)">
      <slot name="left-btn">取消</slot>
    </button>
    <button class="confirm" @click="confirm(openType, selected)">确认</button>
  </div>
</template>

<style lang="scss" scoped>
.filter-footer {
  display: flex;
  border-top: 1px solid #e1d7d7;
  width: 100%;

  button {
    height: 3em;
    border: none;
  }

  .cancel {
    flex: 1;
    background-color: #fff;
    color: #13a677;

    &:active {
      background-color: #eee7e7;
      color: #10976c;
    }
  }

  .confirm {
    flex: 2;
    background-color: #13a677;
    color: #fff;

    &:active {
      background-color: #10976c;
      color: #eee7e7;
    }
  }
}
</style>
