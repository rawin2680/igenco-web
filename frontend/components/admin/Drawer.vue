<script setup lang="ts">
const props = defineProps<{ open: boolean; title?: string; subtitle?: string; wide?: boolean }>()
const emit = defineEmits<{ close: [] }>()

const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && props.open) emit('close') }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200" enter-from-class="opacity-0"
      leave-active-class="transition duration-150" leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[80] bg-[#09140E]/40 backdrop-blur-[2px]" @click="emit('close')"></div>
    </Transition>
    <Transition
      enter-active-class="transition duration-300 ease-out" enter-from-class="translate-x-full"
      leave-active-class="transition duration-200 ease-in" leave-to-class="translate-x-full"
    >
      <aside
        v-if="open"
        class="fixed inset-y-0 right-0 z-[90] w-full bg-white shadow-2xl flex flex-col font-thai text-forestBlack"
        :class="wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'"
        role="dialog" aria-modal="true"
      >
        <header class="flex items-start gap-3 px-6 py-5 border-b border-black/[0.06]">
          <div class="min-w-0 flex-1">
            <h2 class="text-lg font-semibold truncate">{{ title }}</h2>
            <p v-if="subtitle" class="text-[13px] text-mutedSlate truncate">{{ subtitle }}</p>
          </div>
          <button class="p-2 -m-1 rounded-lg text-mutedSlate hover:bg-[#F4F7F5] hover:text-forestBlack" aria-label="ปิด" @click="emit('close')">
            <AdminIcon name="x" />
          </button>
        </header>
        <div class="flex-1 overflow-y-auto px-6 py-5"><slot /></div>
        <footer v-if="$slots.footer" class="px-6 py-4 border-t border-black/[0.06] bg-[#FAFBFA]"><slot name="footer" /></footer>
      </aside>
    </Transition>
  </Teleport>
</template>
