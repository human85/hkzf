import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          component: () => import('@/pages/Home/index.vue')
        },
        {
          path: 'houselist',
          component: () => import('@/pages/HouseList/index.vue')
        },
        {
          path: 'news',
          component: () => import('@/pages/News/index.vue')
        },
        {
          path: 'profile',
          component: () => import('@/pages/Profile/index.vue')
        }
      ]
    },
    {
      path: '/citylist',
      component: () => import('@/views/CityList/index.vue')
    },
    {
      path: '/map',
      component: () => import('@/views/Map/index.vue')
    },
    {
      path: '/search',
      component: () => import('@/views/Search/index.vue')
    }
  ]
})

export default router
