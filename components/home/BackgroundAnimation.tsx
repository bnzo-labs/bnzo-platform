"use client"

import { useEffect, useRef } from 'react'

interface Node {
  x: number; y: number
  hx: number; hy: number
  vx: number; vy: number
  depth: number
  violet: boolean
}

interface Pulse {
  fromIdx: number; toIdx: number
  t: number; speed: number
}

const EDGE_DIST = 130
const EDGE_DIST_SQ = EDGE_DIST * EDGE_DIST
const REPEL_RADIUS = 110
const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS
const REPEL_FORCE = 5.0
const SPRING_K = 0.038
const DAMPING = 0.84
const MAX_PULSES = 8

// Floating animation — long periods so motion feels like breathing, not jitter
const FLOAT_FREQ = 0.00028   // ~22s period
const FLOAT_AMP = 10         // ±10px vertical
const ROT_FREQ = 0.00019     // ~33s period
const ROT_AMP = 0.050        // ±2° rotation

function gauss2(): [number, number] {
  const u1 = Math.max(1e-9, Math.random())
  const theta = Math.random() * 2 * Math.PI
  const r = Math.sqrt(-2 * Math.log(u1))
  return [r * Math.cos(theta), r * Math.sin(theta)]
}

function makeNodes(w: number, h: number): { nodes: Node[], cx: number, cy: number } {
  const count = w < 768 ? 60 : 256
  const cx = w * 0.64
  const cy = h * 0.45
  const rx = Math.min(w, h) * 0.25
  const ry = Math.min(w, h) * 0.30

  const nodes = Array.from({ length: count }, () => {
    const [gx, gy] = gauss2()
    const nx = cx + gx * rx * 0.7 + (Math.random() - 0.5) * 14
    const ny = cy + gy * ry * 0.7 + (Math.random() - 0.5) * 14
    const hx = Math.max(30, Math.min(w - 30, nx))
    const hy = Math.max(30, Math.min(h - 30, ny))
    const depth = Math.random()
    // ~22% of nodes (lowest depth = furthest back) rendered in deep violet
    const violet = depth < 0.22
    return { x: hx, y: hy, hx, hy, vx: 0, vy: 0, depth, violet }
  })

  return { nodes, cx, cy }
}

function drawFogPre(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  cx: number, cy: number,
) {
  // Vignette: transparent center → dark edges, creates spotlight around brain
  const vg = ctx.createRadialGradient(cx, cy, h * 0.12, cx, cy, Math.max(w, h) * 0.78)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(12,12,12,0.80)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, w, h)
}

function drawFogPost(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  cx: number, cy: number,
  now: number,
) {
  // Breathing violet corona — opacity pulses slowly like a living atmosphere
  const breathe = 0.038 + Math.sin(now * 0.00035) * 0.02
  const radius = Math.min(w, h) * 0.46
  const mg = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  mg.addColorStop(0, `rgba(124,58,237,${breathe.toFixed(3)})`)
  mg.addColorStop(0.45, `rgba(124,58,237,${(breathe * 0.28).toFixed(3)})`)
  mg.addColorStop(1, 'rgba(124,58,237,0)')
  ctx.fillStyle = mg
  ctx.fillRect(0, 0, w, h)
}

function render(
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  pulses: Pulse[],
  w: number,
  h: number,
  cx: number,
  cy: number,
  now: number,
) {
  drawFogPre(ctx, w, h, cx, cy)

  const edgeBoost = new Map<number, number>()
  for (const p of pulses) {
    const key = p.fromIdx * 10000 + p.toIdx
    const b = Math.sin(p.t * Math.PI) * 0.65
    edgeBoost.set(key, Math.max(edgeBoost.get(key) ?? 0, b))
  }

  // Edges
  for (let i = 0; i < nodes.length; i++) {
    const ni = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) {
      const nj = nodes[j]
      const dx = ni.x - nj.x
      const dy = ni.y - nj.y
      if (dx * dx + dy * dy >= EDGE_DIST_SQ) continue

      const depthAvg = (ni.depth + nj.depth) * 0.5
      const dist = Math.sqrt(dx * dx + dy * dy)
      const proximity = 1 - dist / EDGE_DIST
      const b = edgeBoost.get(i * 10000 + j) ?? 0

      const baseAlpha = proximity * 0.13 * (0.2 + depthAvg * 0.8)
      const alpha = Math.min(0.5, baseAlpha + b * 0.22)

      ctx.beginPath()
      ctx.moveTo(ni.x, ni.y)
      ctx.lineTo(nj.x, nj.y)
      ctx.lineWidth = 0.25 + depthAvg * 0.65 + b * 0.35

      if (b > 0.08) {
        ctx.strokeStyle = `rgba(200,255,0,${alpha.toFixed(3)})`
      } else if (ni.violet && nj.violet) {
        ctx.strokeStyle = `rgba(124,58,237,${(alpha * 0.75).toFixed(3)})`
      } else {
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
      }
      ctx.stroke()
    }
  }

  // Nodes
  for (const node of nodes) {
    const r = 0.6 + node.depth * 2.0
    const opacity = 0.22 + node.depth * 0.55

    // Deep violet nodes (furthest back) get a soft glow halo
    if (node.violet && node.depth < 0.12) {
      const glowR = r * 5
      const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR)
      glow.addColorStop(0, `rgba(124,58,237,${(opacity * 0.5).toFixed(3)})`)
      glow.addColorStop(1, 'rgba(124,58,237,0)')
      ctx.beginPath()
      ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()
    }

    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
    ctx.fillStyle = node.violet
      ? `rgba(124,58,237,${Math.min(0.9, opacity + 0.18).toFixed(3)})`
      : `rgba(255,255,255,${opacity.toFixed(3)})`
    ctx.fill()
  }

  // Pulses — traveling lime sparks
  for (const p of pulses) {
    const fn = nodes[p.fromIdx]
    const tn = nodes[p.toIdx]
    const px = fn.x + (tn.x - fn.x) * p.t
    const py = fn.y + (tn.y - fn.y) * p.t
    const po = Math.sin(p.t * Math.PI) * 0.65

    const grad = ctx.createRadialGradient(px, py, 0, px, py, 5)
    grad.addColorStop(0, `rgba(200,255,0,${po.toFixed(3)})`)
    grad.addColorStop(0.6, `rgba(200,255,0,${(po * 0.25).toFixed(3)})`)
    grad.addColorStop(1, 'rgba(200,255,0,0)')
    ctx.beginPath()
    ctx.arc(px, py, 5, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    ctx.beginPath()
    ctx.arc(px, py, 1.3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${Math.min(0.95, po + 0.25).toFixed(3)})`
    ctx.fill()
  }

  drawFogPost(ctx, w, h, cx, cy, now)
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let rafId = 0
    let nodes: Node[] = []
    let pulses: Pulse[] = []
    let nextPulseMs = 0
    let lastMs = 0
    let w = 0, h = 0
    let clusterCx = 0, clusterCy = 0

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w
      canvas!.height = h
    }

    function init() {
      resize()
      const result = makeNodes(w, h)
      nodes = result.nodes
      clusterCx = result.cx
      clusterCy = result.cy
      pulses = []
      nextPulseMs = 0
    }

    function maybeFire(now: number) {
      if (pulses.length >= MAX_PULSES || now < nextPulseMs) return
      const pairs: [number, number][] = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          if (dx * dx + dy * dy < EDGE_DIST_SQ) pairs.push([i, j])
        }
      }
      if (!pairs.length) return
      const [fi, ti] = pairs[Math.floor(Math.random() * pairs.length)]
      pulses.push({ fromIdx: fi, toIdx: ti, t: 0, speed: 1 / (500 + Math.random() * 1000) })
      nextPulseMs = now + 500 + Math.random() * 1200
    }

    function tick(now: number) {
      const dt = lastMs === 0 ? 16 : Math.min(now - lastMs, 50)
      lastMs = now

      ctx!.clearRect(0, 0, w, h)

      // Levitation: slow Y oscillation + gentle rotation around cluster center
      const floatY = Math.sin(now * FLOAT_FREQ) * FLOAT_AMP
      const floatAngle = Math.sin(now * ROT_FREQ) * ROT_AMP
      const cosA = Math.cos(floatAngle)
      const sinA = Math.sin(floatAngle)

      const mx = pointerRef.current.x
      const my = pointerRef.current.y

      for (const node of nodes) {
        const sk = SPRING_K * (0.35 + node.depth * 0.65)

        // Spring toward rotated + floated home position
        const dhx = node.hx - clusterCx
        const dhy = node.hy - clusterCy
        const targetX = clusterCx + dhx * cosA - dhy * sinA
        const targetY = clusterCy + dhx * sinA + dhy * cosA + floatY

        node.vx += (targetX - node.x) * sk
        node.vy += (targetY - node.y) * sk

        const mdx = node.x - mx
        const mdy = node.y - my
        const mdSq = mdx * mdx + mdy * mdy
        if (mdSq < REPEL_RADIUS_SQ && mdSq > 0.01) {
          const md = Math.sqrt(mdSq)
          const f = (1 - md / REPEL_RADIUS) * REPEL_FORCE * (0.3 + node.depth * 0.7)
          node.vx += (mdx / md) * f
          node.vy += (mdy / md) * f
        }

        node.vx *= DAMPING
        node.vy *= DAMPING
        node.x += node.vx
        node.y += node.vy
      }

      pulses = pulses.filter(p => p.t < 1)
      for (const p of pulses) p.t = Math.min(1, p.t + p.speed * dt)

      maybeFire(now)

      render(ctx!, nodes, pulses, w, h, clusterCx, clusterCy, now)

      rafId = requestAnimationFrame(tick)
    }

    init()

    if (prefersReduced) {
      render(ctx, nodes, [], w, h, clusterCx, clusterCy, 0)
    } else {
      rafId = requestAnimationFrame(tick)
    }

    const onPointerMove = (e: MouseEvent) => { pointerRef.current = { x: e.clientX, y: e.clientY } }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) pointerRef.current = { x: t.clientX, y: t.clientY }
    }
    const onResize = () => init()

    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.8 }}
      />
    </div>
  )
}
