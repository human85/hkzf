import NavBar from './NavBar/index.vue'
import SearchHeader from './SearchHeader/index.vue'
import HouseItem from './HouseItem/index.vue'
import type { App } from 'vue'

const globalComponents = {
  NavBar,
  SearchHeader,
  HouseItem
}

export const globalComponentsPlugin = {
  install(app: App<Element>) {
    for (const [name, component] of Object.entries(globalComponents)) {
      app.component(name, component)
    }
  }
}
