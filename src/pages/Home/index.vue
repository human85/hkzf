<script lang="ts" setup>
import { getSwiperApi, getGroupsApi, getNewsApi } from '@/api/home/index'
import type { GroupsItem, SwiperItem, NewsItem } from '@/api/home/type'
import { ref, onMounted } from 'vue'
import { getLocation } from '@/utils/getLocation'
import type { AreaInfo } from '@/api/area/type'

defineOptions({
  name: 'Home'
})
// 获取当前城市信息
const currentCity = ref('')
const areaId = ref('')

onMounted(async () => {
  const location: AreaInfo['body'] = await getLocation()
  currentCity.value = location.label
  areaId.value = location.value
})

// 轮播图
const swiper = ref<SwiperItem[]>([])
const serve = import.meta.env.VITE_SERVE

async function getSwiper() {
  const { body } = await getSwiperApi()
  swiper.value = body
}

onMounted(() => getSwiper())

// 导航菜单
const navList = [
  {
    title: '整租',
    img: '/src/assets/images/nav-1.png',
    path: '/houselist'
  },
  {
    title: '合租',
    img: '/src/assets/images/nav-2.png',
    path: '/houselist'
  },
  {
    title: '地图找房',
    img: '/src/assets/images/nav-3.png',
    path: '/map'
  },
  {
    title: '去出租',
    img: '/src/assets/images/nav-4.png',
    path: '/'
  }
]

// 租房小组
const groups = ref<GroupsItem[]>([])

async function getGroups() {
  const { body } = await getGroupsApi(areaId.value)
  groups.value = body
}
onMounted(() => getGroups())

// 最新资讯
const news = ref<NewsItem[]>([])

async function getNews() {
  const { body } = await getNewsApi(areaId.value)
  news.value = body
}
onMounted(() => getNews())
</script>

<template>
  <!-- 轮播图 -->
  <div class="swiper">
    <van-swipe class="my-swipe" lazy-render :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in swiper" :key="item.id">
        <img :src="serve + item.imgSrc" />
      </van-swipe-item>
    </van-swipe>
    <SearchHeader class="search-box" :current-city="currentCity" />
  </div>

  <!-- 导航菜单 -->
  <nav>
    <router-link class="nav-item" v-for="item in navList" :key="item.title" :to="item.path">
      <img :src="item.img" />
      <h4>{{ item.title }}</h4>
    </router-link>
  </nav>
  <!-- 租房小组 -->
  <div class="groups">
    <div class="groups-header">
      <h3>租房小组</h3>
      <span>更多</span>
    </div>
    <ul class="groups-content">
      <li v-for="group in groups" :key="group.id">
        <div class="info">
          <h4>{{ group.title }}</h4>
          <p>{{ group.desc }}</p>
        </div>
        <img :src="serve + group.imgSrc" />
      </li>
    </ul>
  </div>
  <!-- 最新资讯 -->
  <div class="news">
    <h3>最新资讯</h3>
    <ul>
      <li class="news-item" v-for="item in news" :key="item.id">
        <img :src="serve + item.imgSrc" loading="lazy" />
        <div class="desc">
          <h4>{{ item.title }}</h4>
          <p>
            <span>{{ item.from }}</span>
            <span>{{ item.date }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.swiper {
  position: relative;
  width: 100%;
  .my-swipe {
    height: calc(424vw / 7.5);
    .van-swipe-item {
      height: calc(424vw / 7.5);

      img {
        width: 100%;
        object-fit: cover;
      }
    }
  }

  .search-box {
    position: absolute;
    top: 25px;
    padding: 0 12px 0 20px;
  }
}

nav {
  display: flex;
  justify-content: space-around;
  padding: 3vw;

  .nav-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    img {
      width: calc(96vw / 7.5);
      height: calc(96vw / 7.5);
    }

    h4 {
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      color: #333;
    }
  }
}

.groups {
  padding: 0 10px 10px 10px;
  background-color: #e0e0e5;

  .groups-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0.6em;
    }
  }

  .groups-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 15px;
      background-color: #fff;

      .info {
        font-size: 14px;
        h4 {
          margin: 0;
          line-height: 2;
        }
        p {
          margin: 0;
          line-height: 1.5;
        }
      }

      img {
        width: calc(109vw / 7.5);
        height: calc(106vw / 7.5);
      }
    }
  }
}

.news {
  padding: 0 10px;
  h3 {
    margin: 0;
    padding-left: 10px;
    line-height: 3em;
  }
  .news-item {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;

    &:not(:last-child) {
      border-bottom: 1px solid #e4dcdc;
    }

    img {
      width: calc(211vw / 7.5);
      height: calc(159vw / 7.5);
    }

    .desc {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      h4 {
        margin: 0;
        line-height: 1;
      }

      p {
        display: flex;
        justify-content: space-between;
        margin: 0;
        font-size: 14px;
      }
    }
  }
}
</style>
