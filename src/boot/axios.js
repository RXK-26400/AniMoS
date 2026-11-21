import { defineBoot } from '#q-app'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

// API ข้อมูล Watchlist: JSON Server อ่านค่าจาก .env
const api = axios.create({ baseURL: import.meta.env.QCLI_API_URL || 'http://localhost:3001' })

// API Login / Profile / Users ของรายวิชา
const authApi = axios.create({
  baseURL: import.meta.env.QCLI_AUTH_URL || 'http://172.26.117.16:3007/api/v1',
  timeout: 8000
})

authApi.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
  }
  return config
}, (error) => Promise.reject(error))

export default defineBoot(async ({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})
export { api, authApi }