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
