<!-- src/pages/FormPage.vue -->
<!-- หน้าเพิ่มเรื่องใหม่ (/add) -->
<template>
  <q-page padding class="text-white">
    <q-card dark flat class="form-card q-pa-lg">
      <div class="text-h5 q-mb-lg">เพิ่มเรื่องใหม่</div>

      <q-form ref="myForm">
        <q-input v-model="title" dark outlined dense label="ชื่อเรื่อง" color="cyan-3"
          :rules="[val => !!val || 'กรุณากรอกชื่อเรื่อง']" />

        <!-- ปุ่มเพิ่มสถานะ -->
        <q-select v-model="status" dark outlined dense :options="statusOptions" label="สถานะ"
          color="cyan-3" popup-content-class="bg-blue-grey-10 text-white" class="q-mt-sm" />

        <!-- ปุ่มเพิ่มรูปภาพ / แนบลิงค์ -->
        <div class="row q-gutter-md q-mt-md">
          <q-btn no-caps unelevated class="act-btn" :class="{ 'act-on': !!image }" icon="image"
            label="เพิ่มรูปภาพ" @click="pickImage" />
          <q-btn no-caps unelevated class="act-btn" :class="{ 'act-on': !!link }" icon="link"
            label="แนบลิงค์" @click="onAttachLink" />
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

        <!-- รูปภาพ / ลิงค์ที่แนบไว้ -->
        <div v-if="image || link" class="q-mt-md column items-start">
          <q-chip v-if="image" removable dark color="blue-grey-9" icon="image" @remove="image = ''">
            แนบรูปภาพแล้ว
          </q-chip>
          <q-chip v-if="link" removable dark color="blue-grey-9" icon="link" class="link-chip" @remove="link = ''">
            <span class="ellipsis">{{ link }}</span>
          </q-chip>
        </div>

        <div class="q-mt-lg row q-gutter-md">
          <q-btn no-caps unelevated class="act-btn act-on" label="เพิ่ม"
            :loading="saving" @click="onSave" />
          <q-btn no-caps unelevated class="act-btn" label="ยกเลิก"
            @click="router.push({ name: 'main' })" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useWatchlistStore } from '@/stores/watchlist-store'
import { normalizeLink } from '@/utils/link.js'

const router = useRouter()
const $q = useQuasar()
const store = useWatchlistStore()

const statusOptions = ['ยังไม่ได้ดู', 'กำลังดู', 'ดูจบแล้ว']

const myForm = ref(null)
const fileInput = ref(null)
const title = ref('')
const status = ref('ยังไม่ได้ดู')
const image = ref('')   // Convet เป็น URL
const link = ref('')
const saving = ref(false)

const pickImage = () => fileInput.value.click()

// fix รูปให้ยาวได้จำกัด แล้วแปลงเป็น JPEG
const resizeToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onerror = reject
  reader.onload = () => {
    const img = new Image()
    img.onerror = reject
    img.onload = () => {
      const max = 480
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
})

const onFileChange = async (e) => {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    $q.notify({ type: 'negative', message: 'กรุณาเลือกไฟล์รูปภาพ' })
    return
  }
  try {
    image.value = await resizeToDataUrl(file)
  } catch {
    $q.notify({ type: 'negative', message: 'อ่านรูปภาพไม่สำเร็จ' })
  }
}

// ลิงค์
const onAttachLink = () => {
  $q.dialog({
    title: 'แนบลิงค์',
    message: 'วางลิงค์หน้าเว็บที่ดูเรื่องนี้',
    prompt: {
      model: link.value,
      type: 'text',
      outlined: true,
      isValid: (v) => normalizeLink(v) !== null
    },
    cancel: { label: 'ยกเลิก', flat: true },
    ok: { label: 'ตกลง' },
    persistent: true
  }).onOk((v) => {
    link.value = normalizeLink(v) || ''
  })
}

// Save
const onSave = async () => {
  const valid = await myForm.value.validate()
  if (!valid) return

  saving.value = true
  const data = {
    title: title.value,
    status: status.value,
    image: image.value,
    link: link.value
  }

  const ok = await store.addItem(data)
  saving.value = false

  if (ok) {
    $q.notify({ type: 'positive', message: 'เพิ่มรายการแล้ว' })
    router.push({ name: 'main' })
  } else {
    $q.notify({ type: 'negative', message: store.errorMessage })
  }
}
</script>

<style scoped>
.form-card { max-width: 520px; margin: 0 auto; background: #1e2538; border-radius: 16px; }
.act-btn { background: #343b4d; color: #ffffff; border-radius: 12px; padding: 6px 22px; font-size: 1.05rem; }
.act-on { background: #c0462d; }
.link-chip { max-width: 100%; }

</style>