interface Response {
  description: string
  status: number
}

// 房源查询返回数据
export interface HouseListRes extends Response {
  body: {
    list: HouseList
    count: number
  }
}

export type HouseList = HouseItem[]

export interface HouseItem {
  houseImg: string
  title: string
  tags: string[]
  price: number
  desc: string
  houseCode: string
}

// 房源查询参数
export interface Params {
  cityId: string
  area?: string
  subway?: string
  rentType?: string
  price?: string
  more?: string
  start?: number
  end?: number
}

// 房屋查询条件
export interface FilterConditionsRes extends Response {
  body: {
    area: Condition
    characteristic: Condition[]
    floor: Condition[]
    rentType: Condition[]
    oriented: Condition[]
    price: Condition[]
    roomType: Condition[]
    subway: Condition
  }
}

export interface Condition {
  label: string
  value: string
  children?: Condition[]
}
