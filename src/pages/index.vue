<script lang="ts" setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<template>
  <!-- 二级路由出口 -->
  <div class="page-container">
    <router-view></router-view>
    <van-tabbar v-model="active" route fixed active-color="hotpink">
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/houselist" icon="search">找房</van-tabbar-item>
      <van-tabbar-item to="/news" icon="new-o">资讯</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  padding-bottom: 50px;

  .van-tabbar {
    bottom: -1px;
  }
}
</style>
