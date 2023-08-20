<script lang="ts" setup>
import { getCityListApi, getHotCityApi } from '@/api/area/index'
import type { CityItem } from '@/api/area/type'
import { onMounted, ref } from 'vue'
import { getLocation } from '@/utils/getLocation'
import { showFailToast, showSuccessToast } from 'vant'
import 'vant/es/toast/style'
import { useRouter } from 'vue-router'
// import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

defineOptions({
  name: 'CityList'
})

interface FormattedCityList {
  [key: string]: CityItem[]
}

const formattedCityList = ref<FormattedCityList>({
  A: [
    {
      label: '北京',
      value: 'AREA|88cff55c-aaa4-e2e0',
      pinyin: 'beijing',
      short: 'bj'
    },
    {
      label: '安庆',
      value: 'AREA|b4e8be1a-2de2-e039',
      pinyin: 'anqing',
      short: 'aq'
    }
  ]
})
const cityIndex = ref<string[]>([])

async function getCityList() {
  // 获取所有城市数据
  const { body } = await getCityListApi(1)
  const [list, index] = formatCityList(body)
  // 获取热门城市数据
  const { body: hotCityList } = await getHotCityApi()
  list['🔥'] = hotCityList
  index.unshift('#', '🔥')
  // 获取当前城市数据
  const location = await getLocation()
  list['#'] = [body.find(city => city.label === location.label) as CityItem]
  // 格式化后的城市数据及对应索引
  // console.log(list, index)
  formattedCityList.value = list
  cityIndex.value = index
}

function formatCityList(cityList: CityItem[]): [FormattedCityList, string[]] {
  const formattedCityList: FormattedCityList = {}
  let cityIndex: string[] = []

  cityList.forEach(city => {
    const key = city.short[0].toUpperCase()
    if (formattedCityList[key]) {
      formattedCityList[key].push(city)
    } else {
      formattedCityList[key] = [city]
    }
  })

  cityIndex = Object.keys(formattedCityList).sort()

  return [formattedCityList, cityIndex]
}

onMounted(() => getCityList())

// 城市索引名称格式化的方法
function formatCityIndex(index: string) {
  switch (index) {
    case '#':
      return '当前定位'
    case '🔥':
      return '热门城市'
    default:
      return index
  }
}

const CITY_AVAILABLE = ['上海', '北京', '广州', '深圳']
const router = useRouter()
// 点击切换城市的方法
function changeCurrentCity({ label, value }: CityItem) {
  if (!CITY_AVAILABLE.includes(label)) {
    showFailToast('该地区暂无房源')
    return
  }
  localStorage.setItem('location', JSON.stringify({ label, value }))
  showSuccessToast('切换成功')
  setTimeout(() => router.back(), 1000)
}
</script>

<template>
  <div class="cityList">
    <NavBar title="城市选择" />
    <!-- <van-nav-bar class="nav-bar" fixed title="城市选择" left-arrow @click-left="$router.back()" /> -->
    <van-index-bar :sticky-offset-top="46" class="citys" :index-list="cityIndex">
      <template v-for="index in cityIndex" :key="index">
        <van-index-anchor :index="index">{{ formatCityIndex(index) }}</van-index-anchor>
        <van-cell
          @click="changeCurrentCity(city)"
          v-for="city in formattedCityList[index]"
          :key="city.pinyin"
          :title="city.label"
        />
      </template>

      <!-- <DynamicScroller class="scroller" page-mode :items="cityIndex" :min-item-size="76">
        <template v-slot="{ item, active }">
          <DynamicScrollerItem :item="item" :active="active" :data-index="item">
            <van-index-anchor :index="item">{{ item }}</van-index-anchor>
            <van-cell v-for="city in formattedCityList[item]" :key="city.pinyin" :title="city.label" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller> -->
    </van-index-bar>
  </div>
</template>

<style lang="scss" scoped>
.cityList {
  // padding-top: 46px;

  :deep(.van-index-bar__sidebar) {
    gap: 2vh;
  }
}
</style>
