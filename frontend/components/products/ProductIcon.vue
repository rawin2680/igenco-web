<script setup lang="ts">
// Product icon set shared by the homepage (slides, dock, all-products grid)
// and the /admin icon picker. Keys are stored in product.iconType.
defineProps<{ type?: string | null }>()
</script>

<script lang="ts">
export const PRODUCT_ICON_TYPES = [
  { key: 'document-pen', label: 'เอกสาร/ปากกา' },
  { key: 'users', label: 'คน/HR' },
  { key: 'pie-chart', label: 'กราฟ/บัญชี' },
  { key: 'target', label: 'เป้าหมาย/KPI' },
  { key: 'badge-id', label: 'บัตร/ลงทะเบียน' },
  { key: 'shield', label: 'โล่/ความปลอดภัย' },
  { key: 'graduation', label: 'การศึกษา' },
  { key: 'building', label: 'อาคาร' },
  { key: 'cash-register', label: 'POS/ขายหน้าร้าน' },
  { key: 'heart', label: 'หัวใจ/สุขภาพ' },
  { key: 'document-case', label: 'บล็อกเอกสาร' },
  { key: 'code', label: 'โค้ด/ซอฟต์แวร์' },
  { key: 'user-tech', label: 'ผู้เชี่ยวชาญ IT' }
]
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="type === 'document-pen'">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </template>
    <template v-else-if="type === 'users'">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    </template>
    <template v-else-if="type === 'pie-chart'">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
      <path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </template>
    <template v-else-if="type === 'target'">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </template>
    <template v-else-if="type === 'badge-id'">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <circle cx="12" cy="10" r="3"/>
      <path d="M7 17a5 5 0 0 1 10 0"/>
    </template>
    <template v-else-if="type === 'shield'">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </template>
    <template v-else-if="type === 'graduation'">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </template>
    <template v-else-if="type === 'building'">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>
      <path d="M10 22v-4h4v4"/>
    </template>
    <template v-else-if="type === 'cash-register'">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
      <path d="M7 15h.01M11 15h.01M15 15h.01M7 18h.01M11 18h.01M15 18h.01"/>
    </template>
    <template v-else-if="type === 'heart'">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </template>
    <template v-else-if="type === 'document-case'">
      <rect x="3" y="3" width="7" height="9"/>
      <rect x="14" y="3" width="7" height="5"/>
      <rect x="14" y="12" width="7" height="9"/>
      <rect x="3" y="16" width="7" height="5"/>
    </template>
    <template v-else-if="type === 'code'">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </template>
    <template v-else>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </template>
  </svg>
</template>
