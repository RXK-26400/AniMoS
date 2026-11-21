<template>
  <q-page class="q-pa-lg text-white">
    <!-- แถบและปุ่มด้านบน -->
    <div class="toolbar">
      <q-btn no-caps unelevated class="tb-btn tb-grey" label="ADD" @click="onAdd" />

      <q-btn no-caps unelevated class="tb-btn" :class="mode === 'delete' ? 'tb-active' : 'tb-grey'"
        label="Delete" @click="toggleMode('delete')" />

      <!-- หมวดหมู่(เลือกได้อันเดียว) -->
      <q-btn-dropdown no-caps unelevated class="tb-btn tb-grey" :label="category || 'หมวดหมู่'">
        <q-list>
          <q-item v-for="c in categories" :key="c" clickable v-close-popup @click="selectCategory(c)">
            <q-item-section>{{ c }}</q-item-section>
            <q-item-section v-if="category === c" side><q-icon name="check" color="primary" /></q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- Loading / Error / Empty -->
    <div v-if="store.loading" class="row justify-center q-mt-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <q-banner v-else-if="store.errorMessage" class="bg-red-1 text-negative q-mt-md" rounded>
      {{ store.errorMessage }}
    </q-banner>
    <div v-else-if="filteredItems.length === 0" class="text-center q-pa-xl text-grey-5">
      <q-icon name="movie_filter" size="4rem" />
      <div class="text-h6 q-mt-sm">ยังไม่มีรายการ</div>
    </div>

    <!-- Grid ของโปสเตอร์ -->
    <div v-else class="poster-grid q-mt-lg">
      <div v-for="item in filteredItems" :key="item.id" class="poster-card"
        :class="{ clickable: true, 'hover-delete': mode === 'delete' }"
        @click="onCardClick(item)">
        <div class="poster-title ellipsis">{{ item.title }}</div>
        <div class="poster-img">
          <img v-if="item.image" :src="item.image" :alt="item.title" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useWatchlistStore } from '@/stores/watchlist-store'
import { normalizeLink } from '@/utils/link.js'

const router = useRouter()
const $q = useQuasar()
const store = useWatchlistStore()

const ALL = 'ทั้งหมด'
const categories = [ALL, 'ยังไม่ได้ดู', 'กำลังดู', 'ดูจบแล้ว']
const category = ref('') // แสดงทุกรายการ
const mode = ref('')     // delete

const filteredItems = computed(() =>
  category.value && category.value !== ALL
    ? store.items.filter(i => i.status === category.value)
    : store.items
)

// เลือกหมวดหมู่
const selectCategory = (c) => {
  category.value = c
}

// Delete
const toggleMode = (m) => {
  mode.value = mode.value === m ? '' : m
}

// ADD ไปหน้าฟอร์มเพิ่มรายการ(FormPage.vue)
const onAdd = () => {
  mode.value = ''
  router.push({ name: 'add' })
}

// ฟังค์ชั่นที่ คลิกโปสเตอร์แล้วจะเปิดลิงค์ที่แนบไว้ในแท็บใหม่
const openLink = (item) => {
  const url = normalizeLink(item.link)
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    $q.notify({ type: 'info', message: 'รายการนี้ยังไม่ได้แนบลิงค์' })
  }
}

const onCardClick = (item) => {
  if (mode.value === 'delete') {
    confirmDelete(item)
  } else {
    openLink(item)
  }
}

// ถามยืนยันก่อนลบ
const confirmDelete = (item) => {
  $q.dialog({
    message: `ต้องการลบ "${item.title}" ใช่หรือไม่`,
    cancel: { label: 'ยกเลิก', flat: true },
    ok: { label: 'ตกลง(ลบ)', color: 'negative' },
    persistent: true
  }).onOk(async () => {
    const ok = await store.deleteItem(item.id)
    if (ok) {
      $q.notify({ type: 'positive', message: 'ลบรายการแล้ว' })
      mode.value = ''
    } else {
      $q.notify({ type: 'negative', message: store.errorMessage })
    }
  })
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
.toolbar { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
.tb-btn { height: 64px; border-radius: 16px; font-size: 1.5rem; color: #fff; }
.tb-grey { background: #343b4d; }
.tb-active { background: #c0462d; }

.poster-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 28px; }
.poster-card { background: #343b4d; display: flex; flex-direction: column; }
.poster-title { padding: 8px 12px; text-align: center; font-size: 1.15rem; background: #343b4d; }
.poster-img { aspect-ratio: 347 / 427; background: #cbd2dc; }
.poster-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

.clickable { cursor: pointer; }
.hover-delete:hover { outline: 3px solid #e5533a; }

@media (max-width: 1200px) { .poster-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 800px) {
  .poster-grid { grid-template-columns: repeat(2, 1fr); }
  .toolbar { grid-template-columns: 1fr 1fr; }
}
</style>