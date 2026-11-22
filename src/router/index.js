import { defineRouter } from '#q-app'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes.js'
import { useAuthStore } from '@/stores/auth-store.js'
import { Notify } from 'quasar'

export default defineRouter(function () {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  })

  // Global Guard
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login' })
    } else if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
      // หน้า Admin
      Notify.create({ type: 'negative', message: 'ไม่มีสิทธิ์เข้าหน้านี้' })
      next({ name: 'main' })
    } else if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'main' })
    } else {
      next()
    }
  })

  return Router
})