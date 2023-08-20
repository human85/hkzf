import request from '@/utils/request'
import type { Groups, News, Swiper } from './type'

enum Api {
  Swiper = '/home/swiper',
  Groups = '/home/groups',
  News = '/home/news'
}

export function getSwiperApi() {
  return request.get<any, Swiper>(Api.Swiper)
}

export function getGroupsApi(areaId: string) {
  return request.get<any, Groups>(Api.Groups, {
    params: {
      areaId
    }
  })
}

export function getNewsApi(areaId: string) {
  return request.get<any, News>(Api.News, {
    params: {
      areaId
    }
  })
}
