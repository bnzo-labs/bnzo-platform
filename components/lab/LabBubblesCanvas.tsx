"use client"

import { useEffect, useRef } from 'react'

// Brand palette
const CHALK = { r: 245, g: 244, b: 239 }
const LIME = { r: 200, g: 255, b: 0 }
const SLATE = { r: 107, g: 104, b: 104 }

const MAX_BUBBLES = 64
const MAX_R = 38
const MIN_R = 5
const SPAWN_RATE = 1024

interface Bubble {
  noiseOffset: number
  opacity: number
  phase: number
  popAge: number
  popAtY: number
  popR: number
  popping: boolean
  r: number
  vx: number
  vy: number
  wobble: number
  wobbleSpeed: number
  x: number
  y: number
  lime: boolean
}

interface PopParticle {
  decay: number
  life: number
  lime: boolean
  r: number
  vx: number
  vy: number
  x: number
  y: number
}

function rgba(
  c: { b: number; g: number; r: number },
  a: number,
) {
  return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`
}

function spawnBubble(
  w: number,
  h: number,
): Bubble {
  const r =
    MIN_R + Math.random() * (MAX_R - MIN_R)

  const speed =
    (0.28 + Math.random() * 0.45) *
    (1 - (r / MAX_R) * 0.4)

  const lime = Math.random() < 0.12

  const popFrac =
    Math.random() < 0.35
      ? 0.02 + Math.random() * 0.14
      : 0.18 + Math.random() * 0.60

  return {
    lime,
    noiseOffset: Math.random() * 1000,
    opacity: 0.18 + Math.random() * 0.28,
    phase: Math.random() * Math.PI * 2,
    popAge: 0,
    popAtY: h * popFrac,
    popR: r,
    popping: false,
    r,
    vx: (Math.random() - 0.5) * 0.12,
    vy: speed,
    wobble: 0.08 + Math.random() * 0.14,
    wobbleSpeed:
      0.0008 + Math.random() * 0.0015,
    x: r + Math.random() * (w - r * 2),
    y: h + r,
  }
}

function createBlobPath(
  ctx: CanvasRenderingContext2D,
  bubble: Bubble,
  t: number,
  x: number,
  y: number,
  r: number,
) {
  const points = 28

  const pathPoints: {
    x: number
    y: number
  }[] = []

  for (let i = 0; i < points; i++) {
    const angle =
      (Math.PI * 2 * i) / points

    const wobble1 =
      Math.sin(
        angle * 3 +
        t * bubble.wobbleSpeed +
        bubble.noiseOffset,
      ) *
      r *
      bubble.wobble

    const wobble2 =
      Math.cos(
        angle * 5 +
        t * bubble.wobbleSpeed * 0.7 +
        bubble.noiseOffset * 0.5,
      ) *
      r *
      bubble.wobble *
      0.45

    const finalR = r + wobble1 + wobble2

    pathPoints.push({
      x: x + Math.cos(angle) * finalR,
      y: y + Math.sin(angle) * finalR,
    })
  }

  const first = pathPoints[0]

  ctx.moveTo(first.x, first.y)

  for (let i = 0; i < points; i++) {
    const current = pathPoints[i]
    const next =
      pathPoints[(i + 1) % points]

    const midX = (current.x + next.x) / 2
    const midY = (current.y + next.y) / 2

    ctx.quadraticCurveTo(
      current.x,
      current.y,
      midX,
      midY,
    )
  }

  ctx.closePath()
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  b: Bubble,
  t: number,
) {
  const {
    lime,
    opacity,
    phase,
    r,
    x,
    y,
  } = b

  const ox =
    x +
    Math.sin(t / 1800 + phase) *
    r *
    0.18

  const c = lime ? LIME : CHALK

  ctx.save()

  // Organic stretch deformation
  const stretch =
    Math.sin(t * 0.001 + phase) * 0.08

  ctx.translate(ox, y)

  ctx.scale(
    1 + stretch,
    1 - stretch,
  )

  ctx.translate(-ox, -y)

  // Main blob
  ctx.beginPath()

  createBlobPath(
    ctx,
    b,
    t,
    ox,
    y,
    r,
  )

  const fill = ctx.createRadialGradient(
    ox - r * 0.3,
    y - r * 0.35,
    r * 0.08,
    ox,
    y,
    r * 1.2,
  )

  fill.addColorStop(
    0,
    rgba(c, opacity * 0.30),
  )

  fill.addColorStop(
    0.45,
    rgba(c, opacity * 0.08),
  )

  fill.addColorStop(
    1,
    rgba(SLATE, opacity * 0.03),
  )

  ctx.fillStyle = fill
  ctx.fill()

  // Membrane edge
  ctx.strokeStyle = rgba(
    c,
    opacity * 0.42,
  )

  ctx.lineWidth = 1.1
  ctx.stroke()

  // Inner goo structure
  ctx.beginPath()

  createBlobPath(
    ctx,
    {
      ...b,
      wobble: b.wobble * 0.4,
    },
    t * 1.2,
    ox - r * 0.12,
    y - r * 0.16,
    r * 0.42,
  )

  ctx.fillStyle = rgba(
    { b: 255, g: 255, r: 255 },
    opacity * 0.10,
  )

  ctx.fill()

  // Edge glow
  ctx.beginPath()

  createBlobPath(
    ctx,
    {
      ...b,
      wobble: b.wobble * 1.2,
    },
    t,
    ox,
    y,
    r * 1.02,
  )

  ctx.strokeStyle = rgba(
    lime ? LIME : CHALK,
    opacity * 0.08,
  )

  ctx.lineWidth = 3.5
  ctx.stroke()

  ctx.restore()
}

function drawPop(
  ctx: CanvasRenderingContext2D,
  b: Bubble,
  particles: PopParticle[],
) {
  const POP_DURATION = 320

  const prog = Math.min(
    b.popAge / POP_DURATION,
    1,
  )

  const eased =
    1 - (1 - prog) * (1 - prog)

  const ringR =
    b.popR + eased * b.popR * 1.6

  const alpha =
    (1 - prog) * b.opacity * 0.85

  if (alpha > 0.004) {
    const c = b.lime ? LIME : CHALK

    ctx.beginPath()

    ctx.arc(
      b.x,
      b.y,
      ringR,
      0,
      Math.PI * 2,
    )

    ctx.strokeStyle = rgba(c, alpha)

    ctx.lineWidth =
      1.2 * (1 - prog)

    ctx.stroke()
  }

  for (const p of particles) {
    if (p.life >= 1) continue

    const a =
      (1 - p.life) *
      b.opacity *
      0.9

    ctx.beginPath()

    ctx.arc(
      p.x,
      p.y,
      p.r * (1 - p.life * 0.5),
      0,
      Math.PI * 2,
    )

    ctx.fillStyle = rgba(
      p.lime ? LIME : CHALK,
      a,
    )

    ctx.fill()
  }
}

function spawnPopParticles(
  b: Bubble,
): PopParticle[] {
  const count =
    4 + Math.floor(b.r / 8)

  return Array.from(
    { length: count },
    () => {
      const angle =
        Math.random() * Math.PI * 2

      const speed =
        0.4 + Math.random() * 0.9

      return {
        decay:
          0.018 +
          Math.random() * 0.016,
        life: 0,
        lime: b.lime,
        r:
          1.2 + Math.random() * 1.8,
        vx:
          Math.cos(angle) * speed,
        vy:
          Math.sin(angle) * speed -
          0.3,
        x: b.x,
        y: b.y,
      }
    },
  )
}

export default function LabBubblesCanvas() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx =
      canvas.getContext('2d')

    if (!ctx) return

    let bubbles: Bubble[] = []

    let h = 0

    let lastSpawn = 0

    const particles = new Map<
      Bubble,
      PopParticle[]
    >()

    let rafId: number

    let w = 0

    function resize() {
      w =
        canvas!.offsetWidth ||
        window.innerWidth

      h =
        canvas!.offsetHeight ||
        window.innerHeight

      canvas!.width = w
      canvas!.height = h
    }

    function triggerPop(b: Bubble) {
      if (b.popping) return

      b.popAge = 0
      b.popR = b.r
      b.popping = true

      particles.set(
        b,
        spawnPopParticles(b),
      )
    }

    function tick(t: number) {
      ctx!.clearRect(0, 0, w, h)

      // Spawn bubbles
      if (
        t - lastSpawn > SPAWN_RATE &&
        bubbles.length < MAX_BUBBLES
      ) {
        bubbles.push(
          spawnBubble(w, h),
        )

        lastSpawn = t
      }

      // Live bubbles
      for (const b of bubbles) {
        if (b.popping) continue

        b.y -= b.vy
        b.x += b.vx

        b.vx *= 0.998

        // Gentle side bounce
        if (b.x < b.r) {
          b.vx = Math.abs(b.vx)
          b.x = b.r
        }

        if (b.x > w - b.r) {
          b.vx = -Math.abs(b.vx)
          b.x = w - b.r
        }

        if (b.y <= b.popAtY) {
          triggerPop(b)
        }

        if (!b.popping) {
          drawBubble(ctx!, b, t)
        }
      }

      // Pop animation
      for (const b of bubbles) {
        if (!b.popping) continue

        b.popAge += 16

        const pts =
          particles.get(b) ?? []

        for (const p of pts) {
          p.x += p.vx
          p.y += p.vy

          p.vy += 0.012

          p.life += p.decay
        }

        drawPop(ctx!, b, pts)
      }

      // Cleanup
      bubbles = bubbles.filter(
        (b) => {
          if (!b.popping) {
            return true
          }

          if (b.popAge > 440) {
            particles.delete(b)

            return false
          }

          return true
        },
      )

      rafId =
        requestAnimationFrame(tick)
    }

    resize()

    rafId =
      requestAnimationFrame(tick)

    window.addEventListener(
      'resize',
      resize,
    )

    return () => {
      cancelAnimationFrame(rafId)

      window.removeEventListener(
        'resize',
        resize,
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        height: '100%',
        inset: 0,
        pointerEvents: 'none',
        position: 'absolute',
        width: '100%',
      }}
    />
  )
}