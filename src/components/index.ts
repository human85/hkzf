import NavBar from './NavBar/index.vue'
import SearchHeader from './SearchHeader/index.vue'
import type { App } from 'vue'
const globalComponents = {
  NavBar,
  SearchHeader
}

export const globalComponentsPlugin = {
  install(app: App<Element>) {
    for (const [name, component] of Object.entries(globalComponents)) {
      app.component(name, component)
    }
  }
}
