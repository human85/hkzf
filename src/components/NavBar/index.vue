<script lang="ts" setup>
defineOptions({
  name: 'NavBar'
})

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <van-nav-bar class="nav-bar" fixed :title="title" :z-index="10" left-arrow @click-left="$router.back()" />
</template>

<style lang="scss" scoped></style>
