"use client"

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  z: number
  activateTimer: number
  glowAlpha: number
  phase: number
}

interface Pulse {
  fromNode: number
  toNode: number
  progress: number
  speed: number
}

const LIME = '#C8FF00'
const WHITE = '#F5F4EF'
const NODE_COUNT = 58
const EDGE_THRESHOLD = 230
const PULSE_INTERVAL = 650
const MOUSE_RADIUS = 250
const MAX_SPEED = 1

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let nodes: Node[] = []
    let pulses: Pulse[] = []
    let lastPulseTime = 0
    let w = 0
    let h = 0

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w
      canvas!.height = h
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => {
        const z = Math.random()
        const baseRadius = 1.5 + (1 - z) * 4.5
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22 * (1 - z * 0.6),
          vy: (Math.random() - 0.5) * 0.22 * (1 - z * 0.6),
          radius: baseRadius,
          baseRadius,
          z,
          activateTimer: 0,
          glowAlpha: 0,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    function dist(a: Node, b: Node) {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    function spawnPulse(timestamp: number) {
      if (timestamp - lastPulseTime < PULSE_INTERVAL) return
      lastPulseTime = timestamp

      const count = 1 + Math.floor(Math.random() * 2)
      for (let n = 0; n < count; n++) {
        for (let attempt = 0; attempt < 30; attempt++) {
          const i = Math.floor(Math.random() * nodes.length)
          const j = Math.floor(Math.random() * nodes.length)
          if (i !== j && dist(nodes[i], nodes[j]) < EDGE_THRESHOLD) {
            pulses.push({ fromNode: i, toNode: j, progress: 0, speed: 0.005 + Math.random() * 0.007 })
            nodes[j].activateTimer = 1400
            break
          }
        }
      }
    }

    function draw(timestamp: number) {
      ctx!.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const node of nodes) {
        // Mouse proximity attraction
        const mdx = mx - node.x
        const mdy = my - node.y
        const md = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < MOUSE_RADIUS && md > 0) {
          const factor = (1 - md / MOUSE_RADIUS) * 0.018
          node.vx += (mdx / md) * factor
          node.vy += (mdy / md) * factor
        }

        // Velocity damping + clamp
        node.vx *= 0.995
        node.vy *= 0.995
        const spd = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
        if (spd > MAX_SPEED) {
          node.vx = (node.vx / spd) * MAX_SPEED
          node.vy = (node.vy / spd) * MAX_SPEED
        }

        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
        node.x = Math.max(0, Math.min(w, node.x))
        node.y = Math.max(0, Math.min(h, node.y))

        const breathe = 0.5 + 0.5 * Math.sin(timestamp / 2200 + node.phase)
        if (node.activateTimer > 0) {
          node.activateTimer -= 16
          node.glowAlpha = Math.min(1, node.activateTimer / 600)
        } else {
          node.glowAlpha = breathe * 0.28 * (1 - node.z * 0.75)
        }
      }

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = dist(nodes[i], nodes[j])
          if (d < EDGE_THRESHOLD) {
            const proximity = 1 - d / EDGE_THRESHOLD
            const depthFactor = 1 - (nodes[i].z + nodes[j].z) / 2 * 0.55
            const alpha = proximity * proximity * 0.58 * depthFactor
            ctx!.beginPath()
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.strokeStyle = WHITE
            ctx!.globalAlpha = alpha
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      // Pulses
      spawnPulse(timestamp)
      pulses = pulses.filter(p => p.progress <= 1)
      for (const pulse of pulses) {
        pulse.progress += pulse.speed
        const from = nodes[pulse.fromNode]
        const to = nodes[pulse.toNode]
        if (!from || !to) continue
        const t = pulse.progress
        const px = from.x + (to.x - from.x) * t
        const py = from.y + (to.y - from.y) * t
        const fade = Math.max(0, 1 - Math.abs(t - 0.5) * 2.2)

        const gGrad = ctx!.createRadialGradient(px, py, 0, px, py, 8)
        gGrad.addColorStop(0, `rgba(200,255,0,${fade * 0.75})`)
        gGrad.addColorStop(1, 'rgba(200,255,0,0)')
        ctx!.beginPath()
        ctx!.arc(px, py, 8, 0, Math.PI * 2)
        ctx!.fillStyle = gGrad
        ctx!.globalAlpha = 1
        ctx!.fill()

        ctx!.beginPath()
        ctx!.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = LIME
        ctx!.globalAlpha = fade * 0.95
        ctx!.fill()
      }

      // Nodes
      for (const node of nodes) {
        const nearness = 1 - node.z
        const baseAlpha = 0.2 + nearness * 0.55

        if (node.glowAlpha > 0) {
          const glowR = node.baseRadius * 7 + nearness * 20
          const grad = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR)
          grad.addColorStop(0, `rgba(200,255,0,${node.glowAlpha * 0.10})`)
          grad.addColorStop(1, 'rgba(200,255,0,0)')
          ctx!.beginPath()
          ctx!.arc(node.x, node.y, glowR, 0, Math.PI * 2)
          ctx!.fillStyle = grad
          ctx!.globalAlpha = 1
          ctx!.fill()
        }

        ctx!.beginPath()
        ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx!.fillStyle = node.z < 0.45 ? LIME : WHITE
        ctx!.globalAlpha = baseAlpha + node.glowAlpha * 0.35
        ctx!.fill()
      }

      ctx!.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    resize()
    initNodes()
    rafId = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="agentCanvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.5
      }}
    />
  )
}
