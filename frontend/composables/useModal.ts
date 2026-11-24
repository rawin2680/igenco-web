import { ref } from 'vue'

const isCommandModalOpen = ref(false)
const isDemoModalOpen = ref(false)
const isChatDrawerOpen = ref(false)
const isAboutModalOpen = ref(false)
const isNewsModalOpen = ref(false)
const isUserGroupsModalOpen = ref(false)

export const useAppModal = () => {
  const openCommand = () => { isCommandModalOpen.value = true }
  const closeCommand = () => { isCommandModalOpen.value = false }
  const toggleCommand = () => { isCommandModalOpen.value = !isCommandModalOpen.value }

  const openDemo = () => { isDemoModalOpen.value = true }
  const closeDemo = () => { isDemoModalOpen.value = false }
  const toggleDemo = () => { isDemoModalOpen.value = !isDemoModalOpen.value }

  const openChat = () => { isChatDrawerOpen.value = true }
  const closeChat = () => { isChatDrawerOpen.value = false }
  const toggleChat = () => { isChatDrawerOpen.value = !isChatDrawerOpen.value }

  const openAbout = () => { isAboutModalOpen.value = true }
  const closeAbout = () => { isAboutModalOpen.value = false }
  const toggleAbout = () => { isAboutModalOpen.value = !isAboutModalOpen.value }

  const openNews = () => { isNewsModalOpen.value = true }
  const closeNews = () => { isNewsModalOpen.value = false }
  const toggleNews = () => { isNewsModalOpen.value = !isNewsModalOpen.value }

  const openUserGroups = () => { isUserGroupsModalOpen.value = true }
  const closeUserGroups = () => { isUserGroupsModalOpen.value = false }
  const toggleUserGroups = () => { isUserGroupsModalOpen.value = !isUserGroupsModalOpen.value }

  return {
    isCommandModalOpen,
    isDemoModalOpen,
    isChatDrawerOpen,
    isAboutModalOpen,
    isNewsModalOpen,
    isUserGroupsModalOpen,
    openCommand,
    closeCommand,
    toggleCommand,
    openDemo,
    closeDemo,
    toggleDemo,
    openChat,
    closeChat,
    toggleChat,
    openAbout,
    closeAbout,
    toggleAbout,
    openNews,
    closeNews,
    toggleNews,
    openUserGroups,
    closeUserGroups,
    toggleUserGroups
  }
}
