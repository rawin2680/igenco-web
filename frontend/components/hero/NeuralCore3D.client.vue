<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let coreMesh: THREE.Mesh
let outerWireframe: THREE.Mesh
let particleSystem: THREE.Points
let neuralGroup: THREE.Group
let animationFrameId: number
let observer: IntersectionObserver

let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0
let isVisible = true

const onMouseMove = (e: MouseEvent) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1
}

const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1
    mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
  }
}

const updateSize = () => {
  if (!containerRef.value || !camera || !renderer) return
  const w = containerRef.value.clientWidth || window.innerWidth
  const h = containerRef.value.clientHeight || window.innerHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

onMounted(async () => {
  await nextTick()
  if (!canvasRef.value || !containerRef.value) return

  const container = containerRef.value
  const canvas = canvasRef.value

  scene = new THREE.Scene()

  const width = container.clientWidth || window.innerWidth
  const height = container.clientHeight || window.innerHeight

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.z = 6.0

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  neuralGroup = new THREE.Group()
  // Positioned slightly higher so the headline rests gracefully in front of it
  neuralGroup.position.y = 0.35
  scene.add(neuralGroup)

  // --------------------------------------------------------------------------
  // 1. Faceted Futuristic Emerald-Mint Gem (Refined Size & Premium Shading)
  // --------------------------------------------------------------------------
  // Reduced radius from 1.68 down to 1.44 (~15% smaller) for optimal visual balance
  const coreGeo = new THREE.IcosahedronGeometry(1.44, 2)
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,          // Luminous Neo-Mint
    emissive: 0x065f46,       // Deep rich emerald underglow
    emissiveIntensity: 0.36,
    roughness: 0.14,          // Smooth gloss finish
    metalness: 0.18,          // High-tech subtle metallic sheen
    clearcoat: 1.0,           // Crystal clearcoat layer
    clearcoatRoughness: 0.04, // Ultra-sharp, premium highlights
    flatShading: true,        // Crisp, sophisticated geometric triangular facets
    transparent: true,
    opacity: 0.94
  })
  coreMesh = new THREE.Mesh(coreGeo, coreMat)
  neuralGroup.add(coreMesh)

  // --------------------------------------------------------------------------
  // 2. Outer Geodesic Tech Lattice (Elegant, Subtle Graphite & Emerald)
  // --------------------------------------------------------------------------
  const wireGeo = new THREE.IcosahedronGeometry(1.92, 2)
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x09140e,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  })
  outerWireframe = new THREE.Mesh(wireGeo, wireMat)
  neuralGroup.add(outerWireframe)

  // --------------------------------------------------------------------------
  // 3. Floating Ambient Stardust Particles
  // --------------------------------------------------------------------------
  const particlesCount = 200
  const posArray = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount * 3; i += 3) {
    const radius = 2.1 + Math.random() * 2.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    posArray[i] = radius * Math.sin(phi) * Math.cos(theta)
    posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
    posArray[i + 2] = radius * Math.cos(phi)
  }

  const particlesGeo = new THREE.BufferGeometry()
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  const particlesMat = new THREE.PointsMaterial({
    size: 0.032,
    color: 0x10b981,
    transparent: true,
    opacity: 0.65
  })
  particleSystem = new THREE.Points(particlesGeo, particlesMat)
  neuralGroup.add(particleSystem)

  // --------------------------------------------------------------------------
  // 4. Multi-Spectrum Studio Lighting (Crisp Highlights & Luxurious Depth)
  // --------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.15)
  scene.add(ambientLight)

  // Key Specular Highlight 1 (Upper-left crisp pure white specular eye)
  const specLight1 = new THREE.PointLight(0xffffff, 4.6, 12)
  specLight1.position.set(-1.1, 2.0, 3.6)
  scene.add(specLight1)

  // Key Specular Highlight 2 (Upper-right luminous cyan-mint secondary reflection)
  const specLight2 = new THREE.PointLight(0x34d399, 4.0, 12)
  specLight2.position.set(1.5, 1.7, 3.6)
  scene.add(specLight2)

  // Internal Core Glow (Gives the gem inner depth and dimensional vitality)
  const internalGlow = new THREE.PointLight(0x10b981, 2.0, 4.5)
  internalGlow.position.set(0, 0, 0)
  neuralGroup.add(internalGlow)

  // Soft Top Fill Light
  const topLight = new THREE.DirectionalLight(0xf0fdf4, 1.1)
  topLight.position.set(0, 4, 3)
  scene.add(topLight)

  // Bottom Rim Light
  const bottomRim = new THREE.DirectionalLight(0x059669, 0.8)
  bottomRim.position.set(0, -3, 2)
  scene.add(bottomRim)

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('resize', updateSize)

  // IntersectionObserver to pause rendering when scrolled past hero
  observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting
  }, { threshold: 0.05 })
  observer.observe(container)

  // Animation Loop
  const clock = new THREE.Clock()
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    if (!isVisible) return

    const elapsed = clock.getElapsedTime()

    // Fluid mouse parallax
    targetX += (mouseX - targetX) * 0.055
    targetY += (mouseY - targetY) * 0.055

    neuralGroup.rotation.y = elapsed * 0.16 + targetX * 0.58
    neuralGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.09 - targetY * 0.38

    outerWireframe.rotation.y = -elapsed * 0.10
    outerWireframe.rotation.z = elapsed * 0.07

    // Subtle rhythmic breath
    const pulse = 1 + Math.sin(elapsed * 1.4) * 0.018
    coreMesh.scale.set(pulse, pulse, pulse)

    renderer.render(scene, camera)
  }

  animate()
  updateSize()
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('resize', updateSize)
  if (observer) observer.disconnect()
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div ref="containerRef" class="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto overflow-hidden">
    <canvas ref="canvasRef" class="w-full h-full block"></canvas>
  </div>
</template>
