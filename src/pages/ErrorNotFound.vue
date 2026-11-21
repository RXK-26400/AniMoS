<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>
      <div class="text-h4 text-grey-6">ไม่พบหน้าที่ต้องการ</div>
      <q-btn class="q-mt-xl" color="primary" label="กลับหน้าแรก"
        @click="router.push({ name: 'main' })" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
