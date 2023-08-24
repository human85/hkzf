<script lang="ts" setup>
import type { HouseItem } from '@/api/house/type'
import type { PropType } from 'vue'

defineProps({
  house: {
    required: true,
    type: Object as PropType<HouseItem>
  }
})

const serve = import.meta.env.VITE_SERVE
</script>

<template>
  <div class="house-item">
    <img :src="serve + house.houseImg" />
    <div class="house-info">
      <h4 class="ellipsis1">{{ house.title }}</h4>
      <p class="desc ellipsis1">{{ house.desc }}</p>
      <p class="tags ellipsis1">
        <span v-for="(tag, index) in house.tags" :key="tag" :class="'tag ' + 'tag' + (index + 1)">{{ tag }}</span>
      </p>
      <p class="price">
        <span>{{ house.price }}</span>
        元/月
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.house-item {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  width: 100%;
  height: 120px;
  background-color: #fff;

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

    .desc {
      font-size: 14px;
      color: #c5c5c5;
    }

    .tags {
      font-size: 12px;
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

      .tag4 {
        color: #39becd;
        background-color: #e1f5f8;
      }
      .tag5 {
        color: #3fc28c;
        background-color: #e1f5ed;
      }
      .tag6 {
        color: #5aabfd;
        background-color: #e6f2ff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
</style>
