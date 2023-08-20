import request from '@/utils/request'
import type { AreaInfo, CityList, HousingInfo } from './type'

enum Api {
  AreaInfo = '/area/info',
  CityList = '/area/city',
  HotCity = '/area/hot', // 热门城市
  HousingInfo = '/area/map' // 区域房源信息
}

/**@description 根据城市名称查询该城市信息 */
export function getAreaInfoApi(name: string) {
  return request.get<any, AreaInfo>(Api.AreaInfo, {
    params: {
      name
    }
  })
}

/**
 * @description 获取城市列表
 * @param level 1 表示获取所有城市数据 2 表示城市下区的数据
 * */
export function getCityListApi(level: number) {
  return request.get<any, CityList>(Api.CityList, {
    params: {
      level
    }
  })
}

/**@description 获取热门城市 */
export function getHotCityApi() {
  return request.get<any, CityList>(Api.HotCity)
}

/**@description 获取区域房源信息 */
export function getHousingInfoApi(id: string) {
  return request.get<any, HousingInfo>(Api.HousingInfo, {
    params: {
      id
    }
  })
}
