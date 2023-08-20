<script lang="ts" setup>
import { onMounted } from 'vue'
import { getLocation } from '@/utils/getLocation'
import { getHousingInfoApi } from '@/api/area/index'
import type { HousingInfoItem } from '@/api/area/type'
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
}
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
    createRect(area, zoom)
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

  label.addEventListener('click', () => {
    map.centerAndZoom(areaPoint, zoom) // 放大地图
    map.clearOverlays() // 清除所有覆盖物
    renderOverlays(area.value) // 渲染下一级覆盖物
  })
  map.addOverlay(label)
}

/**@description 创建小区覆盖物的函数 */
function createRect(area: HousingInfoItem, zoom: number) {
  console.log(area, zoom)
}
onMounted(() => initMap())
</script>

<template>
  <div class="map">
    <NavBar title="地图找房" />

    <div id="container"></div>
  </div>
</template>

<style lang="scss" scoped>
.map {
  height: 100%;

  #container {
    height: 100%;
  }
}

:deep(.house-count) {
  margin: 0;
}
</style>
