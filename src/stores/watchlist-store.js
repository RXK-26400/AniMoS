import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref([])
  const loading = ref(false)
  const errorMessage = ref('')

  // แปลง error เป็นข้อความ
  const setError = (error) => {
    if (error.response) {
      errorMessage.value = `Server Error (${error.response.status})`
    } else if (error.request) {
      errorMessage.value = 'Unable to connect to the server.'
    } else {
      errorMessage.value = error.message
    }
    console.error(error)
  }

  // GET ดึงรายการทั้งหมด
  async function fetchAll() {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await api.get('/watchlist')
      items.value = response.data
    } catch (error) {
      // MockAPI จะตอบ 404 ตอนที่ยังไม่มีข้อมูล(ลิสต์ว่าง)
      if (error.response && error.response.status === 404) {
        items.value = []
      } else {
        setError(error)
      }
    } finally {
      loading.value = false
    }
  }

  // GET ดึงรายการเดียว (ใช้ในหน้าแก้ไข)
  async function fetchOne(id) {
    try {
      const response = await api.get(`/watchlist/${id}`)
      return response.data
    } catch (error) {
      setError(error)
      return null
    }
  }

  // POST เพิ่มรายการใหม่
  async function addItem(newItem) {
    try {
      const response = await api.post('/watchlist', newItem)
      items.value.unshift(response.data)
      return true
    } catch (error) {
      setError(error)
      return false
    }
  }

  async function updateItem(id, data) {
    try {
      const response = await api.put(`/watchlist/${id}`, data)
      const index = items.value.findIndex(item => String(item.id) === String(id))
      if (index !== -1) {
        items.value[index] = response.data
      }
      return true
    } catch (error) {
      setError(error)
      return false
    }
  }

  // DELETE
  async function deleteItem(id) {
    try {
      await api.delete(`/watchlist/${id}`)
      items.value = items.value.filter(item => String(item.id) !== String(id))
      return true
    } catch (error) {
      setError(error)
      return false
    }
  }

  return { items, loading, errorMessage, fetchAll, fetchOne, addItem, updateItem, deleteItem }
})