<script setup lang="ts">
import { useStrapiApi } from '~/composables/useStrapiApi'
import Navbar from '~/components/layout/Navbar.vue'
import HeroSection from '~/components/hero/HeroSection.vue'
import NewsSection from '~/components/news/NewsSection.vue'
import ProductsSection from '~/components/products/ProductsSection.vue'
import ClientsSection from '~/components/clients/ClientsSection.vue'
import ContactSection from '~/components/contact/ContactSection.vue'
import Footer from '~/components/layout/Footer.vue'

const { getHeroContent } = useStrapiApi()

const hero = await getHeroContent()
</script>

<template>
  <main class="relative">
    <Navbar />
    <HeroSection :hero="hero" />
    <NewsSection />
    <ProductsSection />
    <ClientsSection />
    <ContactSection />
    <Footer />
  </main>
</template>
