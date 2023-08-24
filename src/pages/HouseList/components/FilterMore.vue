<script lang="ts" setup>
import FilterFooter from './FilterFooter.vue'
import { type PropType, ref, inject } from 'vue'
import type { SelctedValues, FilterMoreData, Confirm } from './Filter.vue'
import { watch } from 'vue'

const props = defineProps({
  filterData: {
    required: true,
    type: Object as PropType<FilterMoreData>
  },
  openType: {
    required: true,
    type: String as PropType<keyof SelctedValues>
  },
  moreSelected: {
    required: true,
    type: Array as PropType<string[]>
  }
})

function getFilterTitle(key: string) {
  switch (key) {
    case 'roomType':
      return '户型'
    case 'oriented':
      return '朝向'
    case 'floor':
      return '楼层'
    case 'characteristic':
      return '房屋亮点'
  }
}

const selected = ref<string[]>([])

// 点击清除时同步选中项到 FilterMore 组件中
watch(
  () => props.moreSelected,
  newValue => {
    // 深拷贝 因为后面涉及 push 操作
    selected.value = [...newValue]
  },
  { immediate: true }
)

function tagClickHandler(value: string) {
  const index = selected.value.indexOf(value)
  if (index === -1) {
    selected.value.push(value)
  } else {
    selected.value.splice(index, 1)
  }
}

const confirm = inject('confirm') as Confirm
</script>

<template>
  <div class="filter-more">
    <dl class="filter-list">
      <div class="filter-item" v-for="key in Object.keys(filterData)" :key="key">
        <dt>{{ getFilterTitle(key) }}</dt>
        <dd>
          <span
            :class="['tag', { active: selected?.includes(tag.value) }]"
            @click="tagClickHandler(tag.value)"
            v-for="tag in filterData[key]"
            :key="tag.value"
          >
            {{ tag.label }}
          </span>
        </dd>
      </div>
    </dl>
    <FilterFooter :open-type="openType" :selected="selected">
      <template #left-btn> 清除 </template>
    </FilterFooter>
    <teleport to=".filter">
      <div class="mask" v-show="openType === 'more'" @click="confirm(openType, selected)"></div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.filter-more {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 6;
  width: 75%;
  height: 100%;
  background-color: #fff;

  .filter-list {
    margin: 0;
    padding: 0 15px 10px;
    height: calc(100% - 3em);
    overflow: auto;
    .filter-item {
      padding-top: 15px;
      &:not(:last-child) {
        padding-bottom: 30px;
        border-bottom: 2px solid #e4e6e4;
      }

      dt {
        font-weight: 500;
      }

      dd {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin: 0;
        padding-top: 15px;

        span {
          width: 27%;
          height: 2.2em;
          border: 1px solid #e4e6e4;
          font-size: 12px;
          color: #afb2af;
          line-height: 2.2em;
          text-align: center;

          &.active {
            border: 1px solid #75c7ed;
            color: #75c7ed;
          }
        }
      }
    }
  }
}

.mask {
  z-index: 4;
}
</style>
