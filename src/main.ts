import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/common.scss'

import App from './App.vue'
import router from './router'
import { globalComponentsPlugin } from '@/components/index'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 注册全局组件插件
app.use(globalComponentsPlugin)
app.mount('#app')
