import request from '@/utils/request'
import type { FilterConditionsRes, HouseListRes, Params } from './type'

enum Api {
  HouseList = '/houses', // 房源查询
  FilterConditions = '/houses/condition' // 房屋查询条件
}

export function getHouseListApi(params: Params) {
  return request.get<any, HouseListRes>(Api.HouseList, {
    params
  })
}

export function getFilterConditionsApi(id: string) {
  return request.get<any, FilterConditionsRes>(Api.FilterConditions, {
    params: {
      id
    }
  })
}
