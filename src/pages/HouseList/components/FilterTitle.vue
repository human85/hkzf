<script lang="ts" setup>
import type { PropType } from 'vue'
import type { TitleSelectedStatus } from './Filter.vue'

type Title = {
  title: string
  type: keyof TitleSelectedStatus
}
const titleList: Title[] = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'rent' },
  { title: '筛选', type: 'more' }
]

defineProps({
  titleSelectedStatus: {
    required: true,
    type: Object as PropType<TitleSelectedStatus>
  }
})

defineEmits(['titleClick'])
</script>

<template>
  <div class="filter-title">
    <div
      v-for="title in titleList"
      :key="title.type"
      @click="$emit('titleClick', title.type)"
      :class="{ selected: titleSelectedStatus[title.type] }"
    >
      {{ title.title }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-title {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 1.2em;
  border-bottom: 1px solid #e1d7d7;
  background-color: #fff;
  width: 100%;
  z-index: 4;

  div {
    display: flex;
    align-items: center;

    &::after {
      content: '';
      border: 5px solid transparent;
      border-top: 5px solid rgb(184, 180, 180);
      translate: 4px 4px;
    }

    &.selected {
      color: #7bbda9;
    }
  }
}
</style>
