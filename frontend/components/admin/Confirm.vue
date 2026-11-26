<script setup lang="ts">
defineProps<{ open: boolean; title: string; message?: string; confirmLabel?: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[120] bg-[#09140E]/50 flex items-center justify-center p-4 font-thai" @click.self="emit('cancel')">
      <div class="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
        <div class="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4"><AdminIcon name="trash" /></div>
        <h3 class="text-base font-semibold text-forestBlack">{{ title }}</h3>
        <p v-if="message" class="mt-1 text-[13px] text-mutedSlate">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-2">
          <button class="px-4 py-2 rounded-lg text-[13px] font-medium text-mutedSlate hover:bg-[#F4F7F5]" @click="emit('cancel')">ยกเลิก</button>
          <button class="px-4 py-2 rounded-lg text-[13px] font-semibold bg-red-600 hover:bg-red-700 text-white" @click="emit('confirm')">{{ confirmLabel || 'ยืนยัน' }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
