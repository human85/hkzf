<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getLocation } from '@/utils/getLocation'
import Filter from './components/Filter.vue'

defineOptions({
  name: 'HouseList'
})

const currentCity = ref('')

onMounted(async () => {
  const { label } = await getLocation()
  currentCity.value = label
})
</script>

<template>
  <div class="house-list">
    <!-- 搜索栏 -->
    <SearchHeader class="search-box" :back="true" :current-city="currentCity" />
    <!-- TODO: 筛选栏 -->
    <Filter />
    <!-- TODO: 房屋列表 -->
  </div>
</template>

<style lang="scss" scoped>
.house-list {
  padding-top: 10px;
  min-height: calc(100vh - 50px);
  background-color: #f4f4f4;
  .search-box {
    :deep(.map) {
      color: #00ae66;
    }
  }
}
</style>
