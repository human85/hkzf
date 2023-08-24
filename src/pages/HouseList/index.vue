<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getLocation } from '@/utils/getLocation'
import Filter from './components/Filter.vue'
import { getHouseListApi } from '@/api/house'
import type { HouseList, Params } from '@/api/house/type'
import { showToast } from 'vant'
import 'vant/es/toast/style'

defineOptions({
  name: 'HouseList'
})

// 获取房屋列表数据
const cityName = ref('')
let cityId = ''
const list = ref<HouseList>([]) // 房源列表
let count = 0 // 房源总数
let start = 1 // 开始项
const showEmpty = ref(false)

async function getHouseList(params: Params) {
  const { body } = await getHouseListApi(params)
  list.value = [...list.value, ...body.list]
  count = body.count
  start = start + 20 // 计算下次请求开始项
}

onMounted(async () => {
  const { label, value } = await getLocation()
  cityName.value = label
  cityId = value
  await getHouseList({ cityId, start, end: start + 19 })
  showHint()
})

export interface Filters {
  area?: string
  subway?: string
  rentType?: string
  price?: string
  more?: string
}
async function filterHandler(filters: Filters) {
  list.value = [] // 筛选完后让房源列表置空防止拼接
  start = 1 // 开始项重置
  await getHouseList({
    cityId,
    ...filters,
    start,
    end: start + 19
  })
  showHint()
}

// 房源信息提示
function showHint() {
  if (count === 0) {
    showEmpty.value = true
  } else {
    showToast(`为您找到 ${count} 条房源信息`)
    showEmpty.value = false
  }
}

// 实现触底加载功能
const loading = ref(false)
const finished = ref(false)
async function onLoad() {
  if (list.value.length >= count) {
    finished.value = true
    return
  }
  await getHouseList({ cityId })
  loading.value = false // 加载状态结束
}
</script>

<template>
  <div class="house-list">
    <!-- 搜索栏 -->
    <SearchHeader class="search-box" :back="true" :current-city="cityName" />
    <Filter @filter="filterHandler" />
    <!-- TODO: 房屋列表 -->
    <div v-if="list.length > 0" class="house-items">
      <van-list
        :immediate-check="false"
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <HouseItem v-for="house in list" :key="house.houseCode" :house="house" />
      </van-list>
    </div>
    <div class="empty" v-if="showEmpty">
      <img src="@/assets/images/empty.png" />
      <p>没有找到房源，请您换个搜索条件吧~</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.house-list {
  padding-top: 10px;
  min-height: calc(100vh - 50px);
  background-color: #f4f4f4;
  .search-box {
    :deep(.map) {
      color: #00ae66;
    }
  }

  .house-items {
    padding: 0 10px;
    background-color: #fff;
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30%;
    font-size: 14px;
    color: #a2a1a1;

    img {
      width: 300px;
    }
  }
}
</style>
