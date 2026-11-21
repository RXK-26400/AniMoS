<template>
  <q-layout view="hHh lpR fFf" class="app-bg">
    <q-header class="app-header">
      <q-toolbar class="q-py-md q-px-lg">
        <q-toolbar-title class="app-logo cursor-pointer" @click="goHome">AniMoS</q-toolbar-title>

        <div v-if="authStore.isAuthenticated" class="row items-center q-gutter-md">
          <!-- ปุ่ม addmin แสดงเฉพาะตอน Lohin ในฐานะ admin -->
          <q-btn v-if="authStore.isAdmin" no-caps outline class="btn-admin" label="Admin"
            @click="router.push({ name: 'admin' })" />
          <q-btn no-caps unelevated class="btn-logout" label="Logout" @click="onLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const goHome = () => {
  if (authStore.isAuthenticated) router.push({ name: 'main' })
}

// กล้องแจ้งเตือนตอนกด Logout จะถามก่อนกลับไปหน้า Login
const onLogout = () => {
  $q.dialog({
    title: 'Logout',
    message: 'ต้องการออกจากระบบใช่ไหม?',
    cancel: 'ยกเลิก',
    ok: 'ตกลง',
    persistent: true
  }).onOk(() => {
    authStore.logout()
    $q.notify({ type: 'positive', message: 'ออกจากระบบแล้ว' })
    router.replace({ name: 'login' })
  })
}
</script>

<style>
.app-bg { background: #141b2d; }
.app-header { background: #050b1a; color: #fff; }
.app-logo { color: #5ce1e6; font-size: 2.4rem; font-weight: 700; letter-spacing: 1px; }
.btn-admin { background: #0f1629; border: 2px solid #c9d3ea; color: #fff; font-size: 1.2rem; padding: 4px 28px; border-radius: 12px; }
.btn-logout { background: #c0462d; color: #fff; font-size: 1.2rem; padding: 4px 28px; border-radius: 12px; border: 2px solid #e6b0a5; }
</style>