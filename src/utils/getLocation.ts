import { getAreaInfoApi } from '@/api/area'
import type { AreaInfo } from '@/api/area/type'

export async function getLocation(): Promise<AreaInfo['body']> {
  const location = localStorage.getItem('location')

  if (location) {
    return JSON.parse(location)
  } else {
    // @ts-ignore
    const myCity = new BMapGL.LocalCity()
    const res: any = await new Promise(resolve => myCity.get(resolve))
    const { body } = await getAreaInfoApi(res.name)
    // 本地存储
    localStorage.setItem('location', JSON.stringify(body))
    return body
  }
}
