<template>
  <div class="award-view">
    <h1 class="award-top">25-4분기 베스트 어워드</h1>
    <div class="leaf-bg" :style="{ backgroundImage: `url(${leaf})` }" aria-hidden="true"></div>
    <div class="decor">
      <div class="title"> {{ titleText }} </div>
      <div class="subtitle">{{ subtitleText }}</div>
      <img :src="currentImage" alt="award" class="center-image" />
      <div class="grouptitle"><strong>{{ groupTitleText }}</strong></div>
    </div>
      <!-- side navigation buttons -->
      <button class="side-btn left" @click="prev" aria-label="previous award">‹</button>
      <button class="side-btn right" @click="next" aria-label="next award">›</button>
      <!-- fireworks -->
        <!-- canvas fireworks (script-driven) -->
        <canvas ref="fwCanvas" class="fw-canvas" aria-hidden="true"></canvas>
    <router-link to="/" class="back-button">메인으로</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import ssodam from '@/assets/ssodam.png'
import badakeeper from '@/assets/BadaKeeper.png'
import leaf from '@/assets/leaf.png'

const fwCanvas = ref(null)

let ctx = null
let particles = []
let rafId = null
let spawnTimer = null
let DPR = 1

const images = [ssodam, badakeeper]
const currentIdx = ref(0)
const currentImage = computed(() => images[currentIdx.value])

// per-award texts
const titles = ['누적 수거량 500kg', '누적활동수 187회']
const subtitles = ['아델리 펭귄이 가장 예뻐하는 단체', '카피바라가 가장 좋아하는 단체']
const groupTitles = ['속초 | 쓰담', '바다키퍼 | 명예']

const titleText = computed(() => titles[currentIdx.value] || titles[0])
const subtitleText = computed(() => subtitles[currentIdx.value] || subtitles[0])
const groupTitleText = computed(() => groupTitles[currentIdx.value] || groupTitles[0])

function prev() { currentIdx.value = (currentIdx.value - 1 + images.length) % images.length }
function next() { currentIdx.value = (currentIdx.value + 1) % images.length }

class Particle {
  constructor(x, y, vx, vy, size, color, life) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.size = size
    this.color = color
    this.life = life
    this.alpha = 1
    this.age = 0
  }
  update(dt) {
    this.age += dt
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.vy += 350 * dt * 0.5
    this.alpha = Math.max(0, 1 - this.age / this.life)
  }
  draw(ctx) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = this.alpha
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
    g.addColorStop(0, this.color)
    g.addColorStop(0.2, this.color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function resize() {
  const canvas = fwCanvas.value
  if (!canvas) return
  DPR = Math.max(1, window.devicePixelRatio || 1)
  canvas.width = Math.floor(canvas.clientWidth * DPR)
  canvas.height = Math.floor(canvas.clientHeight * DPR)
  ctx = canvas.getContext('2d')
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
}

function spawnBurst(side = 'left') {
  const baseY = window.innerHeight - (window.innerHeight * 0.08)
  const x = side === 'left' ? window.innerWidth * 0.06 : window.innerWidth * 0.94
  const y = baseY
  const colors = ['#ffd166', '#ff7b7b', '#9ad3bc', '#f0a6ff', '#ffd6a5']
  const count = 22
  for (let i = 0; i < count; i++) {
    const baseAngle = side === 'left' ? (Math.PI / 3) : (2 * Math.PI / 3)
    const offset = (Math.random() * (Math.PI / 6)) - (Math.PI / 12)
    const angle = baseAngle + offset
    const speed = 220 + Math.random() * 360
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed * -1
    const size = 5 + Math.random() * 9
    const color = colors[Math.floor(Math.random() * colors.length)]
    const life = 0.9 + Math.random() * 0.9
    particles.push(new Particle(x, y, vx, vy, size, color, life))
  }
}

let last = performance.now()
function loop(now) {
  const dt = Math.min(0.032, (now - last) / 1000)
  last = now
  if (!ctx) return
  // clear full device-pixel canvas without leaving trails
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, fwCanvas.value.width, fwCanvas.value.height)
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.update(dt)
    p.draw(ctx)
    if (p.age >= p.life) particles.splice(i, 1)
  }
  rafId = requestAnimationFrame(loop)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  spawnBurst('left')
  spawnBurst('right')
  spawnTimer = setInterval(() => {
    spawnBurst('left')
    setTimeout(() => spawnBurst('right'), 300)
  }, 1400)
  rafId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(rafId)
  clearInterval(spawnTimer)
  particles = []
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=BBH+Bogle&display=swap');
.award-view{
  width:100%;
  height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background: radial-gradient(ellipse at center, #f6e7c7 0%, #d4aa3a 12%, #9a6b2a 35%, #3b2414 100%);
  position:relative;
  overflow:hidden;
}

/* subtle overlay particles */
.award-view::before{
  content:"";
  position:absolute;
  inset:0;
  background-image: radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size:6px 6px, 30px 30px;
  opacity:0.28;
  pointer-events:none;
}

.award-view::after{
  content:"";
  position:absolute;
  inset:0;
  background: radial-gradient(ellipse at top, rgba(255,240,200,0.28), rgba(0,0,0,0) 30%), linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6));
  pointer-events:none;
}

.decor{
  position:relative;
  z-index:2;
  text-align:center;
  color:#fff7df;
  padding:40px 24px;
  width:100%;
  max-width:900px;
  animation:floatY 3s ease-in-out infinite;
}

.title{
  font-size:48px;
  font-weight:800;
  letter-spacing:6px;
  color:#ffd57a;
  text-shadow:0 6px 18px rgba(0,0,0,0.6);
  margin-bottom:6px;
}

.subtitle{ font-size:20px; color:rgba(255,230,180,0.95); margin-bottom:22px; letter-spacing:2px }
.grouptitle{ font-size:25px; color:rgba(255,230,180,0.95); margin-bottom:22px; letter-spacing:2px }
.center-image{ max-width:38%; height:auto; object-fit:contain; filter:drop-shadow(0 12px 36px rgba(0,0,0,0.6)); border-radius:8px; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06)); padding:8px }

@media (max-width:768px){ .title{ font-size:28px } .center-image{ max-width:68% } }

.back-button{ position:fixed; left:50%; transform:translateX(-50%); bottom:6vh; z-index:1400; background:rgba(255,255,255,0.12); color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:700; box-shadow:0 8px 26px rgba(0,0,0,0.5) }
.back-button:hover{ opacity:0.95 }

.award-top{ position:fixed; top:64px; left:50%; transform:translateX(-50%); z-index:1600; font-size:50px; font-weight:800; color:#ffd57a; text-shadow:0 6px 18px rgba(0,0,0,0.6); letter-spacing:4px; font-family: 'BBH Bogle', sans-serif }

/* side navigation buttons */
.side-btn{ position:fixed; top:50%; transform:translateY(-50%); z-index:1400; width:56px; height:56px; border-radius:50%; border:0; display:flex; align-items:center; justify-content:center; font-size:34px; color:#fff; background:linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.18)); box-shadow:0 8px 26px rgba(0,0,0,0.45); cursor:pointer; backdrop-filter: blur(4px); }
.side-btn.left{ left:18px }
.side-btn.right{ right:18px }
.side-btn:active{ transform:translateY(-50%) scale(0.96) }

@keyframes floatY{ 0%{ transform:translateY(0) } 25%{ transform:translateY(-6px) } 50%{ transform:translateY(0) } 75%{ transform:translateY(6px) } 100%{ transform:translateY(0) } }

/* Canvas fireworks styles */
.fw-canvas{ position:absolute; inset:0; width:100%; height:100%; z-index:1250; pointer-events:none }

/* leaf background */
.leaf-bg{ position:absolute; z-index:1; pointer-events:none; inset:0; background-repeat:no-repeat; background-position:center 62%; background-size:42%; opacity:0.40; transform:translateZ(0) }

</style>
