<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useAppModal } from '~/composables/useModal'
import { useAiConcierge } from '~/composables/useAiConcierge'
import { useAppI18n } from '~/composables/useI18n'

const { isChatDrawerOpen, toggleChat, closeChat, openDemo } = useAppModal()
const { messages, isTyping, presetQuestions, sendMessage } = useAiConcierge()
const { locale } = useAppI18n()

const inputText = ref('')
const messagesContainer = ref<HTMLDivElement | null>(null)
const showTooltip = ref(true)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const onSubmit = async () => {
  if (!inputText.value.trim()) return
  const text = inputText.value
  inputText.value = ''
  await sendMessage(text)
  await scrollToBottom()
}

const sendPreset = async (prompt: string) => {
  inputText.value = prompt
  await onSubmit()
}

const handleOpenDemoFromChat = () => {
  closeChat()
  openDemo()
}

onMounted(() => {
  // Automatically hide the greeting tooltip after 10 seconds if not clicked
  setTimeout(() => {
    showTooltip.value = false
  }, 10000)
})
</script>

<template>
  <div class="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-[9999] flex flex-col items-end pointer-events-auto">
    
    <!-- AI GENCO Interactive Chat Drawer (กล่องข้อความสนทนา) -->
    <div
      v-if="isChatDrawerOpen"
      class="mb-3 w-[92vw] sm:w-[410px] max-w-[430px] bg-white dark:bg-[#0D1D16] rounded-3xl shadow-[0_24px_60px_rgba(9,20,14,0.35)] border border-forestBlack/15 dark:border-[#00C978]/35 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <!-- Drawer Header -->
      <div class="px-5 py-4 bg-forestBlack dark:bg-[#07120D] text-white flex items-center justify-between border-b border-forestBlack/10 dark:border-white/10">
        <div class="flex items-center gap-3">
          <!-- Glowing Avatar -->
          <div class="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#059669] to-[#00C978] flex items-center justify-center text-forestBlack font-bold text-xs shadow-md">
            <span class="text-white font-extrabold text-[13px] tracking-wider">AI</span>
            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00C978] border-2 border-forestBlack"></span>
          </div>
          <div>
            <div class="text-sm font-bold text-white flex items-center gap-1.5">
              <span>AI GENCO</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#00C978]/20 text-[#00C978] font-semibold">Assistant</span>
            </div>
            <div class="text-[11px] text-mintGlow flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-[#00C978] animate-pulse"></span>
              <span>{{ locale === 'th' ? 'ผู้ช่วยสอบถามผลิตภัณฑ์ • ออนไลน์' : 'AI Product Specialist • Online' }}</span>
            </div>
          </div>
        </div>
        
        <button
          @click="closeChat"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          :title="locale === 'th' ? 'ปิดหน้าต่างแชท' : 'Close Chat'"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <!-- Messages Area -->
      <div
        ref="messagesContainer"
        class="p-4 sm:p-5 h-[340px] overflow-y-auto space-y-3.5 text-xs sm:text-sm bg-[#F8FAF9] dark:bg-[#07120D]"
      >
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="leading-relaxed transition-all"
          :class="msg.sender === 'user'
            ? 'ml-auto max-w-[85%] bg-forestBlack dark:bg-[#00C978] text-white dark:text-forestBlack font-medium p-3 rounded-2xl rounded-tr-sm shadow-sm'
            : 'bg-white dark:bg-[#12261C] border border-forestBlack/[0.08] dark:border-[#00C978]/25 rounded-2xl rounded-tl-sm p-3.5 text-forestBlack dark:text-neutral-100 max-w-[92%] shadow-xs'"
        >
          <!-- Assistant Avatar tag -->
          <div v-if="msg.sender === 'assistant'" class="text-[11px] font-bold text-[#059669] dark:text-[#00E588] mb-1 flex items-center gap-1">
            <span>✨ AI GENCO</span>
          </div>
          
          <div class="whitespace-pre-line text-xs sm:text-[13px]">
            {{ msg.content }}
          </div>

          <!-- Quick Action CTA inside Chat when mentioning Demo/Consult -->
          <div v-if="msg.sender === 'assistant' && (msg.content.includes('นัดหมาย') || msg.content.includes('Request Demo') || msg.content.includes('Demo') || msg.content.includes('สาธิต'))" class="mt-3 pt-2 border-t border-forestBlack/5 dark:border-white/10">
            <button
              @click="handleOpenDemoFromChat"
              class="w-full py-2 px-3 rounded-xl bg-[#00C978] hover:bg-[#00B36B] text-forestBlack font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{{ locale === 'th' ? '📅 นัดหมายพูดคุยกับทีมสถาปนิก AI' : '📅 Book a Consultation with Specialists' }}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Typing indicator -->
        <div
          v-if="isTyping"
          class="bg-white dark:bg-[#12261C] border border-forestBlack/[0.08] dark:border-[#00C978]/25 rounded-2xl rounded-tl-sm p-3 text-xs text-mutedSlate dark:text-neutral-400 flex items-center gap-2 w-28 shadow-xs"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00C978] animate-bounce"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00C978] animate-bounce [animation-delay:0.2s]"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#00C978] animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>

      <!-- Quick Preset Product Prompts -->
      <div class="px-3 py-2 bg-white dark:bg-[#0D1D16] border-t border-forestBlack/[0.06] dark:border-white/10 flex gap-1.5 overflow-x-auto scrollbar-none">
        <button
          v-for="(preset, i) in presetQuestions"
          :key="i"
          @click="sendPreset(preset)"
          class="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#F7F9F8] dark:bg-[#142B20] hover:bg-emerald-50 dark:hover:bg-[#1E3E2F] border border-forestBlack/10 dark:border-[#00C978]/25 text-forestBlack dark:text-neutral-200 transition-colors cursor-pointer active:scale-95 whitespace-nowrap"
        >
          {{ preset }}
        </button>
      </div>

      <!-- Input Box -->
      <form
        @submit.prevent="onSubmit"
        class="p-2.5 sm:p-3 border-t border-forestBlack/[0.08] dark:border-white/10 flex items-center gap-2 bg-white dark:bg-[#0D1D16]"
      >
        <input
          v-model="inputText"
          type="text"
          :placeholder="locale === 'th' ? 'ถามข้อมูลผลิตภัณฑ์ AI กับ AI GENCO...' : 'Ask AI GENCO about enterprise solutions...'"
          class="flex-1 bg-[#F8FAF9] dark:bg-[#07120D] text-xs sm:text-sm text-forestBlack dark:text-white placeholder-mutedSlate dark:placeholder-neutral-500 px-3.5 py-2.5 rounded-xl border border-forestBlack/10 dark:border-[#00C978]/30 focus:outline-none focus:border-[#00C978]"
        />
        <button
          type="submit"
          class="p-2.5 rounded-xl bg-forestBlack dark:bg-[#00C978] text-[#00C978] dark:text-forestBlack hover:bg-[#059669] dark:hover:bg-[#00B36B] hover:text-white transition-all cursor-pointer flex-shrink-0 active:scale-95"
          :title="locale === 'th' ? 'ส่งคำถาม' : 'Send message'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
    </div>

    <!-- Floating Tooltip Notification Bubble (Before click) -->
    <div
      v-if="!isChatDrawerOpen && showTooltip"
      class="mb-2 bg-white dark:bg-[#0D1D16] rounded-2xl px-3.5 py-2 shadow-lg border border-forestBlack/10 dark:border-[#00C978]/30 text-xs text-forestBlack dark:text-white flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <span class="w-2 h-2 rounded-full bg-[#00C978] animate-ping"></span>
      <span class="font-medium">
        {{ locale === 'th' ? 'มีข้อสงสัยเกี่ยวกับผลิตภัณฑ์? สอบถาม AI GENCO ได้เลยครับ!' : 'Have questions about our solutions? Ask AI GENCO!' }}
      </span>
      <button @click.stop="showTooltip = false" class="text-mutedSlate dark:text-neutral-400 hover:text-forestBlack dark:hover:text-white text-xs p-0.5">✕</button>
    </div>

    <!-- Floating Trigger Pill Button at Bottom Right (AI GENCO) -->
    <button
      @click="toggleChat(); showTooltip = false"
      class="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#09140E] via-[#0D241A] to-[#09140E] dark:from-[#08120D] dark:via-[#0F261C] dark:to-[#08120D] text-white border border-[#00C978]/50 hover:border-[#00C978] shadow-[0_10px_35px_rgba(0,201,120,0.25)] hover:shadow-[0_15px_45px_rgba(0,201,120,0.4)] transition-all group active:scale-95 cursor-pointer backdrop-blur-md"
      :title="locale === 'th' ? 'สอบถามข้อมูลผลิตภัณฑ์กับ AI GENCO' : 'Inquire about products with AI GENCO'"
    >
      <!-- Glowing Animated Avatar -->
      <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#059669] to-[#00C978] text-forestBlack font-black text-xs shadow-inner">
        <span class="text-white font-extrabold text-[11px]">AI</span>
        <span class="animate-ping absolute inset-0 rounded-full bg-[#00C978] opacity-40"></span>
      </div>
      
      <div class="text-left">
        <div class="text-xs sm:text-sm font-bold text-white group-hover:text-[#00C978] transition-colors leading-tight">
          AI GENCO
        </div>
        <div class="text-[10px] text-neutral-300 dark:text-neutral-400 font-normal leading-tight">
          {{ locale === 'th' ? 'สอบถามผลิตภัณฑ์ AI' : 'AI Product Specialist' }}
        </div>
      </div>

      <svg class="w-4 h-4 text-[#00C978] ml-0.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    </button>

  </div>
</template>
