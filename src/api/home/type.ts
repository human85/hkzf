interface Response {
  description: string
  status: number
}

// 轮播图
export interface SwiperItem {
  id: number
  imgSrc: string
  alt: string
}

export interface Swiper extends Response {
  body: SwiperItem[]
}

// 租房小组
export interface GroupsItem {
  id: number
  title: string
  desc: string
  imgSrc: string
}

export interface Groups extends Response {
  body: GroupsItem[]
}

// 最新资讯
export interface NewsItem {
  id: number
  title: string
  imgSrc: string
  from: string
  date: string
}

export interface News extends Response {
  body: NewsItem[]
}
