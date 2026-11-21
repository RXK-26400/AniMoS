<template>
  <q-page padding class="text-white">
    <div class="row items-center q-mb-lg">
      <div class="text-h5">Admin Dashboard</div>
      <q-space />
      <q-btn flat no-caps icon="arrow_back" label="กลับหน้าหลัก" @click="router.push({ name: 'main' })" />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="c in cards" :key="c.label" class="col-12 col-sm-6 col-md-3">
        <q-card dark class="bg-blue-grey-10">
          <q-card-section>
            <div class="text-caption text-grey-5">{{ c.label }}</div>
            <div class="text-h4">{{ c.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- แสดงผู้ใช้ในระบบ -->
    <div class="text-h6 q-mb-sm">ผู้ใช้ในระบบ</div>
    <q-banner v-if="usersError" class="bg-red-1 text-negative" rounded>{{ usersError }}</q-banner>
    <q-table v-else dark flat bordered class="bg-blue-grey-10" :rows="users" :columns="columns"
      row-key="id" :loading="usersLoading" :rows-per-page-options="[0]" hide-bottom />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWatchlistStore } from '@/stores/watchlist-store'
import { getUsers } from '@/services/auth.service'

const router = useRouter()
const store = useWatchlistStore()
const count = (val) => store.items.filter(i => i.status === val).length

// เลือกรายการหมวดหมู่
const cards = computed(() => [
  { label: 'รายการทั้งหมด', value: store.items.length },
  { label: 'ยังไม่ได้ดู', value: count('ยังไม่ได้ดู') },
  { label: 'กำลังดู', value: count('กำลังดู') },
  { label: 'ดูจบแล้ว', value: count('ดูจบแล้ว') }
])

const users = ref([])
const usersLoading = ref(false)
const usersError = ref('')

// คอลัมน์
const columns = computed(() =>
  Object.keys(users.value[0] ?? {})
    .filter(k => !/password/i.test(k))
    .map(k => ({ name: k, label: k, field: k, align: 'left' }))
)

onMounted(async () => {
  store.fetchAll()
  usersLoading.value = true
  try {
    const response = await getUsers()
    users.value = response.data.data ?? response.data
  } catch (error) {
    usersError.value = error.response
      ? `โหลดข้อมูลผู้ใช้ไม่สำเร็จ (${error.response.status})`
      : 'ไม่สามารถเชื่อมต่อ Backend ได้'
  } finally {
    usersLoading.value = false
  }
})
</script>