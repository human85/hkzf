// components.d.ts
import NavBar from '@/components/NavBar/index.vue'
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    NavBar: typeof NavBar
  }
}
export {}
