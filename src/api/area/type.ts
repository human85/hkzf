interface Response {
  description: string
  status: number
}

export interface AreaInfo extends Response {
  body: {
    label: string
    value: string
  }
}

// 城市列表
export interface CityItem {
  label: string
  value: string
  pinyin: string
  short: string
}

export interface CityList extends Response {
  body: CityItem[]
}

export interface HousingInfoItem {
  label: string
  value: string
  coord: {
    latitude: string
    longitude: string
  }
  count: number
}

export interface HousingInfo extends Response {
  body: HousingInfoItem[]
}
