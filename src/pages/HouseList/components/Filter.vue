<script lang="ts" setup>
import { ref, provide, computed, onMounted } from 'vue'
import FilterTitle from './FilterTitle.vue'
import FilterPicker from './FilterPicker.vue'
import FilterMore from './FilterMore.vue'
import { getFilterConditionsApi } from '@/api/house/index'
import type { FilterConditionsRes, Condition } from '@/api/house/type'
import { getLocation } from '@/utils/getLocation'
import type { Filters } from '../index.vue'

const emit = defineEmits(['filter'])

// 控制标题高亮的数据
export type TitleSelectedStatus = {
  area: boolean
  mode: boolean
  rent: boolean
  more: boolean
}
const titleSelectedStatus = ref<TitleSelectedStatus>({
  area: false,
  mode: false,
  rent: false,
  more: false
})

const openType = ref<keyof TitleSelectedStatus | ''>('') // 点击的标题类型
// 控制选择器和遮罩层显隐
const showPicker = computed(() => {
  if (openType.value === 'more' || openType.value === '') return false
  return true
})

function titleClickHandler(type: keyof TitleSelectedStatus) {
  openType.value = type
  // 阻止页面滚动
  document.body.classList.add('no-scroll')
  isFilterTitleActive(type)
}

export type Cancel = (type: keyof SelctedValues) => void
const cancel = (type?: keyof SelctedValues) => {
  if (type === 'more') {
    selectedValues.value.more = defaultOption.more
    return
  }
  openType.value = ''
  // 恢复页面滚动
  document.body.classList.remove('no-scroll')
  isFilterTitleActive()
}

export type Confirm = (type: keyof SelctedValues, selected: string[]) => void
const confirm: Confirm = (type, selected) => {
  openType.value = ''
  // 恢复页面滚动
  document.body.classList.remove('no-scroll')
  selectedValues.value[type] = selected
  isFilterTitleActive()
  // 拼接 filter 数据 将数据发送给父组件发送请求
  const { area, mode, rent, more } = selectedValues.value
  // 筛选条件数据
  const filters: Filters = {}
  // 区域
  const areaKey = area[0] as 'area' | 'subway'
  if (area.length === 3) {
    filters[areaKey] = area[2] === 'null' ? area[1] : area[2]
  }
  // 方式
  if (mode[0] !== 'null') {
    filters.rentType = mode[0]
  }
  // 租金
  if (rent[0] !== 'null') {
    filters.price = rent[0]
  }
  // 更多
  if (more.length > 0) {
    filters.more = more.join(',')
  }
  // 未选择任何筛选项不请求数据
  if (Reflect.ownKeys(filters).length === 0) return
  emit('filter', filters)
}

/**@description 判断筛选标题是否维持高亮 */
function isFilterTitleActive(type?: keyof TitleSelectedStatus) {
  for (const [key, value] of Object.entries(defaultOption)) {
    if (key === type) {
      // 当前项
      titleSelectedStatus.value[type] = true // 标题高亮
      continue
    }

    const currentValue = selectedValues.value[key as keyof TitleSelectedStatus]
    const isDefault = JSON.stringify(value) === JSON.stringify(currentValue)

    if (isDefault) {
      titleSelectedStatus.value[key as keyof TitleSelectedStatus] = false
    } else {
      if (JSON.stringify(currentValue) === JSON.stringify(['subway', 'null'])) {
        titleSelectedStatus.value[key as keyof TitleSelectedStatus] = false
        continue
      }
      titleSelectedStatus.value[key as keyof TitleSelectedStatus] = true
    }
  }
}

// 将方法传递给子组件
provide('cancel', cancel)
provide('confirm', confirm)

// 获取全部筛选条件数据
const allFilterData = ref<FilterConditionsRes['body'] | null>(null)

async function getFilterData(id: string) {
  const { body } = await getFilterConditionsApi(id)
  allFilterData.value = body
}

onMounted(async () => {
  const { value } = await getLocation()
  getFilterData(value)
})

// 传递给筛选组件的条件数据
export interface FilterMoreData {
  [key: string]: Condition[]
}

const filterData = computed(() => {
  if (!allFilterData.value) return
  const { area, rentType, price, subway, roomType, oriented, floor, characteristic } = allFilterData.value
  let data: Condition[] | null | FilterMoreData = null
  switch (openType.value) {
    case 'area':
      data = [area, subway]
      data = subData(data)
      break
    case 'mode':
      data = rentType
      break
    case 'rent':
      data = price
      break
    case 'more':
      data = { roomType, oriented, floor, characteristic }
  }

  return data
})

// 对 area 数据进行处理，只保留三层数据，删除第三层的 children
// 同时为第二两层无 children属性的 item 赋值一个值为 [] 的 children 防止组件报错
function subData(data: Condition[], count = 0) {
  if (count === 2) {
    data.forEach(item => {
      delete item.children
    })
  } else {
    count++
    data.forEach(item => {
      if (!item.children) {
        item.children = []
        return
      }
      subData(item.children, count)
    })
  }
  return data
}

// 选择器已选择数据
export interface SelctedValues {
  area: string[]
  mode: string[]
  rent: string[]
  more: string[]
}

const defaultOption = {
  area: ['area', 'null'],
  mode: ['null'],
  rent: ['null'],
  more: []
}

const selectedValues = ref<SelctedValues>(JSON.parse(JSON.stringify(defaultOption)))
</script>

<template>
  <div class="filter">
    <FilterTitle :title-selected-status="titleSelectedStatus" @title-click="titleClickHandler" />
    <FilterPicker
      v-if="showPicker"
      :filter-data="filterData as Condition[]"
      :selected-values="selectedValues"
      :key="openType"
      :open-type="openType as keyof TitleSelectedStatus"
    />
    <Transition name="slide-fade">
      <FilterMore
        v-if="openType === 'more'"
        :open-type="openType as keyof TitleSelectedStatus"
        :filter-data="filterData as FilterMoreData"
        :more-selected="selectedValues['more']"
      />
    </Transition>

    <!-- 遮罩层 -->
    <div class="mask" @click="cancel()" v-show="showPicker"></div>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  position: sticky;
  top: -1px;
  z-index: 3;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
