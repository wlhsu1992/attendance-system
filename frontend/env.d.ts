/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 這裡的 'any', 'object', 'object' 是通配符，表示組件的類型。
  // 它告訴 TypeScript 任何從 .vue 檔案導入的東西都是一個 Vue 組件。
  const component: DefineComponent<{}, {}, any>
  export default component
}