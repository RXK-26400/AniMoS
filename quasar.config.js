import { defineConfig } from '#q-app'

export default defineConfig(() => {
  return {
    boot: ['pinia', 'axios', 'auth'],

    css: [],

    extras: ['roboto-font', 'material-icons'],

    build: {
      vueRouterMode: 'history'
    },

    devServer: {
      open: true
    },

    framework: {
      config: {},
      plugins: ['Notify', 'Dialog']
    }
  }
})