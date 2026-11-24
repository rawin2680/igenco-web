import { ref } from 'vue'
import type { BilingualText } from '~/types/cms'

export type SupportedLocale = 'th' | 'en'

const currentLocale = ref<SupportedLocale>('th')

export const useAppI18n = () => {
  const toggleLocale = () => {
    currentLocale.value = currentLocale.value === 'th' ? 'en' : 'th'
  }

  const setLocale = (locale: SupportedLocale) => {
    currentLocale.value = locale
  }

  const t = (textObj?: BilingualText | null): string => {
    if (!textObj) return ''
    return textObj[currentLocale.value] || textObj.th || textObj.en || ''
  }

  return {
    locale: currentLocale,
    toggleLocale,
    setLocale,
    t
  }
}
