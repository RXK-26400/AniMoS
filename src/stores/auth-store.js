import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService, getProfile } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(null)
  const loading = ref(false)
  const errorMessage = ref('')

  // Getters
  const isAuthenticated = computed(() => accessToken.value !== null)
  const role = computed(() => user.value?.role ?? null) // student | teacher | admin
  const isAdmin = computed(() => role.value === 'admin')

  // Actions
  const login = async (username, password) => {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await loginService(username, password)
      accessToken.value = response.data.data.accessToken
      user.value = response.data.data.user
      return response
    } catch (error) {
      errorMessage.value =
        error.response?.data?.message ??
        (error.request ? 'Unable to connect to the server.' : 'Unable to login.')
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    accessToken.value = null
    user.value = null
    errorMessage.value = ''
    loading.value = false
  }

  const checkAuth = async () => {
    if (!accessToken.value) return false
    try {
      await getProfile()
      return true
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) {
        logout()
        return false
      }
      return true
    }
  }

  return {
    user, accessToken, loading, errorMessage,
    isAuthenticated, role, isAdmin,
    login, logout, checkAuth
  }
}, {
  persist: { pick: ['user', 'accessToken'] }
})