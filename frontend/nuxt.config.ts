// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  typescript: {
    strict: true,
    typeCheck: false
  },

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'th',
        class: 'scroll-smooth'
      },
      title: 'IGENCO AI — Intelligence, Engineered for Tomorrow',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'สถาปัตยกรรม AI อัจฉริยะระดับองค์กร ผสานความแม่นยำของข้อมูล ความปลอดภัยสูงสุด และประสบการณ์ดิจิทัลที่ไร้รอยต่อ' },
        { name: 'theme-color', content: '#F7F9F8' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      // Defaults point at production so a deploy without env vars still works.
      // Override with NUXT_PUBLIC_* (e.g. in frontend/.env for local dev).
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://igenco-demo2.vercel.app',
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'https://backend-production-a51c3534.up.railway.app',
      useMock: process.env.NUXT_PUBLIC_USE_MOCK === 'true' // mock data only when explicitly enabled
    }
  }
})
