<script lang="ts" setup>
import { getHouseListApi } from '@/api/house/index'
import type { HouseList } from '@/api/house/type'
import { ref } from 'vue'

defineOptions({
  name: 'HouseItems'
})

defineExpose({
  getHouseList
})

const houseList = ref<HouseList>([])
const serve = import.meta.env.VITE_SERVE

async function getHouseList(id: string) {
  const { body } = await getHouseListApi(id)
  houseList.value = body.list
}
</script>

<template>
  <div class="house-items">
    <div class="house-item" v-for="house in houseList" :key="house.houseCode">
      <img :src="serve + house.houseImg" />
      <div class="house-info">
        <h4>{{ house.title }}</h4>
        <p class="desc">{{ house.desc }}</p>
        <p class="tags">
          <span v-for="(tag, index) in house.tags" :key="tag" :class="'tag ' + 'tag' + (index + 1)">{{ tag }}</span>
        </p>
        <p class="price">
          <span>{{ house.price }}</span
          >元/月
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.house-items {
  overflow-y: auto;
  height: 100%;
  padding-bottom: 45px;
  .house-item {
    display: flex;
    gap: 10px;
    padding: 12px 10px;
    width: 100%;
    height: 120px;

    &:not(:last-child) {
      border-bottom: 1px solid #c5c5c5;
    }

    img {
      width: 120px;
      height: 100%;
    }

    .house-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: calc(100vw - 150px);

      h4 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .desc {
        font-size: 14px;
        color: #c5c5c5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tags {
        font-size: 14px;
        display: flex;
        gap: 4px;

        .tag {
          padding: 2px;
        }

        .tag1 {
          color: #39becd;
          background-color: #e1f5f8;
        }
        .tag2 {
          color: #3fc28c;
          background-color: #e1f5ed;
        }
        .tag3 {
          color: #5aabfd;
          background-color: #e6f2ff;
        }
      }

      .price {
        color: red;

        span {
          font-weight: 500;
          font-size: 18px;
        }
      }
    }

    h4,
    div,
    p {
      margin: 0;
    }
  }
}
</style>
