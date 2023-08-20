<script lang="ts" setup>
defineOptions({
  name: 'SearchHeader'
})

defineProps({
  currentCity: {
    type: String,
    required: true
  },
  back: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="search-box">
    <van-icon @click="$router.back()" size="22" color="#bdbdbd" name="arrow-left" v-if="back" />
    <div class="search-box-main">
      <div class="location" @click="$router.push('/citylist')">
        <span>{{ currentCity }}</span>
        <van-icon name="arrow-down" />
      </div>
      <div class="search" @click="$router.push('/search')">
        <van-icon name="search" />
        <span>请输入小区或地址</span>
      </div>
    </div>
    <van-icon @click="$router.push('/map')" class="map" name="location-o" />
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  width: 100%;

  .search-box-main {
    flex: 1;
    display: flex;
    padding: 0.5em;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
    font-size: 14px;

    .location {
      padding-right: 10px;
      border-right: 1px solid #e0e0e5;
    }

    .search {
      padding-left: 10px;
      display: flex;
      align-items: center;
      gap: 5px;
      color: #878383;
      .van-icon {
        font-size: 16px;
      }
    }
  }

  .map {
    font-size: 1.6em;
    color: #fff;
  }
}
</style>
