import NavBar from './NavBar/index.vue'
import type { App } from 'vue'
const globalComponents = {
  NavBar
}

export const globalComponentsPlugin = {
  install(app: App<Element>) {
    for (const [name, component] of Object.entries(globalComponents)) {
      app.component(name, component)
    }
  }
}
