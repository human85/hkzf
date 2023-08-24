<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getLocation } from '@/utils/getLocation'
import { getHousingInfoApi } from '@/api/area/index'
import type { HousingInfoItem } from '@/api/area/type'
import { getHouseListApi } from '@/api/house/index'
import type { HouseList } from '@/api/house/type'

defineOptions({
  // eslint-disable-next-line
  name: 'Map'
})
let map: any

/**@description 初始化地图的函数 */
async function initMap() {
  // 创建地图实例
  map = new BMapGL.Map('container')
  // 设置中心点坐标
  // const point = new BMapGL.Point(116.404, 39.915)
  // 获取当前定位城市
  const { label: cityName, value: areaId } = await getLocation()

  //创建地址解析器实例
  const myGeo = new BMapGL.Geocoder()
  // 将地址解析结果显示在地图上，并调整地图视野
  const point: any = await new Promise(resolve => {
    myGeo.getPoint(cityName, resolve, cityName)
  })

  if (!point) return alert('您选择的地址没有解析到结果！')

  map.centerAndZoom(point, 11) // 地图初始化，同时设置地图展示级别
  map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
  const scaleCtrl = new BMapGL.ScaleControl() // 添加比例尺控件
  map.addControl(scaleCtrl)
  const zoomCtrl = new BMapGL.ZoomControl() // 添加缩放控件
  map.addControl(zoomCtrl)

  // 创建房源信息覆盖物
  renderOverlays(areaId)

  // 地图移动时隐藏房屋列表
  map.addEventListener('dragstart', () => {
    if (!isShow.value) return
    isShow.value = false
  })
}
onMounted(() => initMap())

/**@description 渲染覆盖物的函数 */
async function renderOverlays(areaId: string) {
  const { body } = await getHousingInfoApi(areaId)

  // 获取级别和类型
  const { type, nextZoom } = getTypeAndZoom()
  // 渲染覆盖物
  body.forEach((area: HousingInfoItem) => {
    createOverlays(area, type, nextZoom)
  })
}

/**@description 计算类型(区/镇/小区)与缩放级别 */
function getTypeAndZoom() {
  // 区   -> 11 范围 10 <= zoom <12
  // 镇   -> 13 范围 12 <= zoom <14
  // 小区 -> 15 范围 14 <= zoom <15
  const zoom = map.getZoom()
  let type = 'circle'
  let nextZoom = 13
  if (zoom >= 10 && zoom < 12) {
    type = 'circle'
    nextZoom = 13
  } else if (zoom >= 12 && zoom < 14) {
    type = 'circle'
    nextZoom = 15
  } else if (zoom >= 14 && zoom < 16) {
    type = 'rect'
  }
  return { type, nextZoom }
}

/**@description 创建覆盖物的函数 */
function createOverlays(area: HousingInfoItem, type: string, zoom: number) {
  if (type === 'circle') {
    createCircle(area, zoom)
  } else {
    createRect(area)
  }
}

/**@description 创建区、镇覆盖物的函数 */
function createCircle(area: HousingInfoItem, zoom: number) {
  const areaPoint = new BMapGL.Point(area.coord.longitude, area.coord.latitude)

  const opts = {
    position: areaPoint, // 指定文本标注所在的地理位置
    offset: new BMapGL.Size(-22.5, -22.5) // 设置文本偏移量
  }

  const label = new BMapGL.Label('', opts) // 创建文本标注对象

  label.setContent(/*html*/ `
          <div class="area">${area.label}</div>
          <p class="house-count">${area.count}套</p>
        `)

  label.setStyle({
    width: '55px',
    height: '55px',
    backgroundColor: 'rgba(12, 181, 106, 0.9)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    fontSize: '12px',
    border: '1px solid white',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  })

  map.addOverlay(label)

  label.addEventListener('click', () => {
    map.centerAndZoom(areaPoint, zoom) // 放大地图
    map.clearOverlays() // 清除所有覆盖物
    renderOverlays(area.value)
    // 确保地图放大后再渲染
    setTimeout(() => {
      renderOverlays(area.value) // 渲染下一级覆盖物
    }, 0)
  })
}

const isShow = ref(false) // 控制列表平移类

/**@description 创建小区覆盖物的函数 */
function createRect(area: HousingInfoItem) {
  const areaPoint = new BMapGL.Point(area.coord.longitude, area.coord.latitude)

  const opts = {
    position: areaPoint, // 指定文本标注所在的地理位置
    offset: new BMapGL.Size(-50, -25) // 设置文本偏移量
  }

  const label = new BMapGL.Label('', opts) // 创建文本标注对象

  label.setContent(/*html*/ `
        <div class="rect">${area.label}&nbsp;${area.count}套</div>
      `)

  label.setStyle({
    width: '100px',
    height: '20px',
    backgroundColor: 'rgba(12, 181, 106, 0.9)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '2px',
    fontSize: '12px',
    border: '1px solid white',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  })

  map.addOverlay(label)

  label.addEventListener('click', (e: any) => {
    getHouseList(area.value)
    isShow.value = true
    // 将点击的覆盖物移动到中心点
    const target = e.currentTarget.domElement
    const x = window.innerWidth / 2 - target.offsetLeft - 50
    const y = (window.innerHeight - 330) / 2 - target.offsetTop - 10
    map.panBy(x, y)
  })
}

// 房屋列表数据
const houseList = ref<HouseList>([])

async function getHouseList(cityId: string) {
  const { body } = await getHouseListApi({ cityId })
  houseList.value = body.list
}
</script>

<template>
  <div class="map">
    <NavBar title="地图找房" />
    <!-- 地图 -->
    <div id="container"></div>
    <!-- 房屋列表 -->
    <div :class="['house-list', { show: isShow }]">
      <div class="title">
        <h3>房屋列表</h3>
        <span>更多房源</span>
      </div>
      <div class="list-content">
        <HouseItem v-for="house in houseList" :key="house.houseCode" :house="house" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.map {
  position: relative;
  height: 100%;

  #container {
    height: 100%;
  }
}

.house-list {
  position: fixed;
  z-index: 10;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 330px;
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  transition: all 0.5s ease;
  translate: 0 330px;

  &.show {
    translate: 0;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #b5b7bb;

    h3 {
      margin: 10px 0;
    }
  }

  .list-content {
    padding: 0 10px 45px;
    overflow-y: auto;
    height: 100%;
  }
}

:deep(.house-count) {
  margin: 0;
}

:deep(.rect) {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top: 5px solid rgba(12, 181, 106, 0.9);
  }
}
</style>
