import request from '@/utils/request'
import type { HouseListRes } from './type'

enum Api {
  HouseList = '/houses' // 房源查询
}

export function getHouseListApi(id: string) {
  return request.get<any, HouseListRes>(Api.HouseList, {
    params: {
      cityId: id
    }
  })
}
