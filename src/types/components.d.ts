// components.d.ts
import NavBar from '@/components/NavBar/index.vue'
import SearchHeader from '@/components/SearchHeader/index.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    NavBar: typeof NavBar
    SearchHeader: typeof SearchHeader
  }
}
export {}
