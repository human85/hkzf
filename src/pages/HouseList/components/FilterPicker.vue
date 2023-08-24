<script lang="ts" setup>
import { type PropType, ref, onMounted } from 'vue'
import FilterFooter from './FilterFooter.vue'
import type { PickerColumn } from 'vant'
import type { SelctedValues } from './Filter.vue'

const props = defineProps({
  filterData: {
    required: true,
    type: Array as PropType<PickerColumn>
  },
  selectedValues: {
    required: true,
    type: Object as PropType<SelctedValues>
  },
  openType: {
    required: true,
    type: String as PropType<keyof SelctedValues>
  }
})

const customFieldName = {
  text: 'label',
  value: 'value',
  children: 'children'
}

// 绑定默认选中值
const selected = ref<string[]>([])
onMounted(() => {
  selected.value = props.selectedValues[props.openType]
})
</script>

<template>
  <div class="filter-picker">
    <van-picker v-model="selected" :columns-field-names="customFieldName" :show-toolbar="false" :columns="filterData" />
    <FilterFooter :open-type="openType" :selected="selected" />
  </div>
</template>

<style lang="scss" scoped>
.filter-picker {
  position: absolute;
  width: 100%;
  z-index: 4;
}
</style>
