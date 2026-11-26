<script setup lang="ts">
const { usersList, createUser, changeUserRole, currentUser } = useAdminApi()
const form = ref({ username: '', email: '', password: '', roleType: 'editor' })
const submit = async () => {
  if (await createUser(form.value)) form.value = { username: '', email: '', password: '', roleType: 'editor' }
}
const inputCls = 'w-full px-3 py-2 rounded-lg bg-white ring-1 ring-black/[0.12] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#00C978]'
</script>

<template>
  <div class="space-y-4 max-w-4xl">
    <section class="bg-white rounded-2xl ring-1 ring-black/[0.06] overflow-hidden">
      <header class="px-5 py-4 border-b border-black/[0.06] text-sm font-semibold">ทีมงาน ({{ usersList.length }})</header>
      <div v-for="u in usersList" :key="u.id" class="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-black/[0.04] last:border-0">
        <div class="w-8 h-8 rounded-full bg-[#E8F8F2] text-[#00875A] text-xs font-bold flex items-center justify-center">{{ (u.username || '?')[0].toUpperCase() }}</div>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold">{{ u.username }} <span v-if="u.id === currentUser?.id" class="text-xs text-mutedSlate font-normal">(คุณ)</span></div>
          <div class="text-xs text-mutedSlate truncate">{{ u.email }}</div>
        </div>
        <div class="inline-flex rounded-lg bg-[#F4F7F5] p-0.5">
          <button
            v-for="r in [{ k: 'editor', l: 'Editor' }, { k: 'sysadmin', l: 'Sysadmin' }]" :key="r.k"
            class="px-3 py-1 rounded-md text-xs font-medium"
            :class="u.role?.type === r.k ? 'bg-white shadow-sm text-forestBlack' : 'text-mutedSlate'"
            @click="u.role?.type !== r.k && changeUserRole(u, r.k)"
          >{{ r.l }}</button>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-2xl ring-1 ring-black/[0.06] p-5">
      <h3 class="text-sm font-semibold mb-1">เพิ่มทีมงาน</h3>
      <p class="text-xs text-mutedSlate mb-4">Editor แก้ข่าวและข้อมูลบริษัทได้ ดูงานและผลิตภัณฑ์ได้อย่างเดียว · Sysadmin จัดการได้ทุกอย่าง</p>
      <form class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_1fr_140px_auto] gap-3 items-end" @submit.prevent="submit">
        <label><span class="block text-xs font-semibold mb-1">ชื่อผู้ใช้</span><input v-model="form.username" required :class="inputCls" /></label>
        <label><span class="block text-xs font-semibold mb-1">อีเมล</span><input v-model="form.email" required type="email" :class="inputCls" /></label>
        <label><span class="block text-xs font-semibold mb-1">รหัสผ่าน</span><input v-model="form.password" required minlength="6" type="password" :class="inputCls" /></label>
        <label><span class="block text-xs font-semibold mb-1">สิทธิ์</span>
          <select v-model="form.roleType" :class="inputCls"><option value="editor">Editor</option><option value="sysadmin">Sysadmin</option></select>
        </label>
        <button type="submit" class="px-4 py-2 rounded-lg bg-forestBlack hover:bg-[#13241A] text-white text-[13px] font-semibold">สร้างบัญชี</button>
      </form>
    </section>
  </div>
</template>
