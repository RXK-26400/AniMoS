<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md">
    <q-card class="q-pa-lg shadow-5" style="width: 100%; max-width: 400px; border-radius: 12px;">
      <q-card-section class="text-center q-pb-none">
        <q-avatar size="64px" color="primary" text-color="white" icon="movie" class="q-mb-md" />
        <div class="text-h5 text-weight-bold">AniMoS</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="Username" outlined dense class="q-mb-sm"
          @keyup.enter="onLogin">
          <template v-slot:prepend><q-icon name="person" color="primary" /></template>
        </q-input>
        <q-input v-model="password" type="password" label="Password" outlined dense
          @keyup.enter="onLogin">
          <template v-slot:prepend><q-icon name="lock" color="primary" /></template>
        </q-input>

        <q-banner v-if="errorMessage" class="bg-red-1 text-negative q-mt-md" rounded>
          {{ errorMessage }}
        </q-banner>

        <q-banner class="bg-blue-1 q-mt-md" rounded dense>
          Demo Account (Password: <b>123456</b>)<br>Username: <b>student</b> / <b>teacher</b> / <b>admin</b>
        </q-banner>

        <q-btn color="primary" label="Login" class="full-width q-mt-lg" size="lg" unelevated
          :loading="authStore.loading" :disable="!username || !password" @click="onLogin" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const onLogin = async () => {
  errorMessage.value = ''
  try {
    await authStore.login(username.value, password.value)
    $q.notify({ type: 'positive', message: `เข้าสู่ระบบสำเร็จ ${authStore.user.username}` })
    router.push({ name: 'main' })
  } catch {
    errorMessage.value = authStore.errorMessage
  }
}
</script>