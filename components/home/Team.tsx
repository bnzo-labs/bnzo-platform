'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

// ─── Data ──────────────────────────────────────────────────────────────────

interface AgentNode {
  id: string
  title: string
  role: string
  type: 'founder' | 'cos' | 'agent'
  bio: string
  prompt?: string
}

const NODES: AgentNode[] = [
  {
    id: 'founder',
    title: 'Erick Benzo',
    role: 'Human Founder',
    type: 'founder',
    bio: '14 years shipping software. The last two with AI agents in the build loop. I started bnzo because the market had two extremes: agencies that bill for months and deliver demos, and AI tools that produce prototypes nobody ships. Senior engineering plus parallel agents is the third path.',
  },
  {
    id: 'cos',
    title: 'Chief of Staff',
    role: 'Orchestration Agent',
    type: 'cos',
    bio: 'Routes incoming briefs to specialist agents, decomposes projects into task streams, synthesizes progress into coherent deliverables, and escalates only when human judgment is required.',
    prompt: `You are the Chief of Staff at bnzo studio. When given a project brief, decompose it into discrete tasks and assign each to the correct specialist agent. Track progress, synthesize all outputs into coherent deliverables. Escalate to Erick only when a decision exceeds agent scope. Output: task assignments and status reports.`,
  },
  {
    id: 'developer',
    title: 'Developer',
    role: 'Full-Stack Agent',
    type: 'agent',
    bio: 'Ships production-grade Next.js, TypeScript, and Python. End-to-end features: auth, APIs, databases, deployment pipelines. No TODOs, no scaffolding left behind.',
    prompt: `You are a senior full-stack developer at bnzo. Stack: Next.js 14 App Router, TypeScript strict mode, Supabase, Tailwind CSS. Follow CLAUDE.md exactly. Files under 400 lines. Immutable patterns. Proper error handling at every boundary. No console.log in production. No comments unless the WHY is non-obvious.`,
  },
  {
    id: 'designer',
    title: 'Designer',
    role: 'UI/UX Agent',
    type: 'agent',
    bio: 'Designs from brief to production-ready specs. Owns the bnzo visual system: ink, chalk, lime, Syne, DM Sans. Every surface must look intentional — no template aesthetics.',
    prompt: `You are a UI/UX designer at bnzo. Match VISUAL_BRIEF.md exactly: dark editorial meets developer tooling. Tokens: ink #0C0C0C, chalk #F5F4EF, lime #C8FF00, slate #6B6868. Syne for headlines, DM Sans for body. Anti-patterns are listed in the brief — violating them is a blocker.`,
  },
  {
    id: 'content',
    title: 'Content Creator',
    role: 'Content Agent',
    type: 'agent',
    bio: 'Writes copy, case studies, and docs in the bnzo voice: direct, technical, zero filler. Turns project specs into narratives that convert technical founders.',
    prompt: `You are the content agent at bnzo. Voice: direct, technical, no filler. Audience: technical founders. Output: landing copy, case studies, email sequences, MDX docs. No corporate jargon. No hedge words. Every sentence must earn its place.`,
  },
  {
    id: 'architect',
    title: 'Architect',
    role: 'Systems Agent',
    type: 'agent',
    bio: 'Evaluates technical decisions before code is written. Data models, API contracts, service boundaries, scalability traps — all resolved before development begins.',
    prompt: `You are software architect at bnzo. Before any implementation: define the system design, data models, API contracts, and service boundaries. Validate stack choices against load and growth profile. Flag complexity traps. Output architecture docs developers can implement without clarification.`,
  },
  {
    id: 'qa',
    title: 'QA / Tester',
    role: 'Quality Agent',
    type: 'agent',
    bio: 'Writes test plans, runs Playwright E2E tests, validates visual regressions at 320/768/1024/1440px. Nothing ships under 80% coverage.',
    prompt: `You are QA engineer at bnzo. For every feature: unit tests, integration tests, Playwright E2E at 320/768/1024/1440px. Validate all acceptance criteria. Report: pass/fail per criterion, coverage %, screenshot diffs. Gate: 80% coverage minimum before approval.`,
  },
  {
    id: 'growth',
    title: 'Growth Analyst',
    role: 'Growth Agent',
    type: 'agent',
    bio: 'Analyzes funnel data from Vercel Analytics and Supabase, finds conversion bottlenecks, generates ranked A/B experiment hypotheses with implementation briefs.',
    prompt: `You are growth analyst at bnzo. Analyze funnel metrics from Vercel Analytics and Supabase events. Find drop-off points, segment by acquisition source, rank A/B test hypotheses by expected lift. Output: executive summary, top 3 experiments with success metrics and implementation brief for the developer agent.`,
  },
]

const AGENT_IDS = ['developer', 'designer', 'content', 'architect', 'qa', 'growth']

// ─── Icons ─────────────────────────────────────────────────────────────────

function RobotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="8.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9.25" cy="13" r="1.25" fill="currentColor" />
      <circle cx="14.75" cy="13" r="1.25" fill="currentColor" />
      <line x1="12" y1="8.5" x2="12" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="4.75" r="0.85" fill="currentColor" />
      <path d="M5 12.5H3M19 12.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 17.5V19.5M15.5 17.5V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type EntryDir = 'left' | 'right' | 'top' | 'bottom'

function getEdge(
  clientX: number,
  clientY: number,
  rect: DOMRect
): EntryDir {
  const x = clientX - (rect.left + rect.width / 2)
  const y = clientY - (rect.top + rect.height / 2)
  if (Math.abs(x) >= Math.abs(y)) return x >= 0 ? 'right' : 'left'
  return y >= 0 ? 'bottom' : 'top'
}

const FILL_OFFSET: Record<EntryDir, { x: string; y: string }> = {
  left:   { x: '-101%', y: '0%' },
  right:  { x: '101%',  y: '0%' },
  top:    { x: '0%',    y: '-101%' },
  bottom: { x: '0%',    y: '101%' },
}

// ─── NodeBubble ─────────────────────────────────────────────────────────────

interface NodeBubbleProps {
  data: AgentNode
  isActive: boolean
  onClick: (id: string) => void
  circleRef: (el: HTMLDivElement | null) => void
  revealed: boolean
  delay: number
}

type CursorNodeEnterDetail = { el: Element }

function NodeBubble({ data, isActive, onClick, circleRef, revealed, delay }: NodeBubbleProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const innerCircleRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  // Init fill off-screen
  useEffect(() => {
    if (fillRef.current) gsap.set(fillRef.current, { x: '-101%' })
  }, [])

  // Magnetic pull + cursor-ball steal
  useEffect(() => {
    const btn = btnRef.current
    if (!btn || reducedMotion.current) return
    const safeBtn = btn

    const qx = gsap.quickTo(btn, 'x', { duration: 0.65, ease: 'power3.out' })
    const qy = gsap.quickTo(btn, 'y', { duration: 0.65, ease: 'power3.out' })
    const PROXIMITY = 60
    const STRENGTH = 0.28
    let inProximity = false

    function onMove(e: MouseEvent) {
      const rect = safeBtn.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < PROXIMITY) {
        qx(dx * STRENGTH)
        qy(dy * STRENGTH)
        if (!inProximity) {
          inProximity = true
          const detail: CursorNodeEnterDetail = { el: innerCircleRef.current ?? safeBtn }
          window.dispatchEvent(new CustomEvent('cursor-node-enter', { detail }))
        }
      } else {
        qx(0)
        qy(0)
        if (inProximity) {
          inProximity = false
          window.dispatchEvent(new CustomEvent('cursor-node-leave'))
        }
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (inProximity) {
        window.dispatchEvent(new CustomEvent('cursor-node-leave'))
        inProximity = false
      }
      gsap.killTweensOf(safeBtn)
      gsap.set(safeBtn, { x: 0, y: 0 })
    }
  }, [])

  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    if (reducedMotion.current || !fillRef.current) return
    const dir = getEdge(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())
    const from = FILL_OFFSET[dir]
    gsap.fromTo(
      fillRef.current,
      { x: from.x, y: from.y },
      { x: '0%', y: '0%', duration: 0.38, ease: 'power2.out' }
    )
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
    if (reducedMotion.current || !fillRef.current) return
    const dir = getEdge(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())
    const to = FILL_OFFSET[dir]
    gsap.to(fillRef.current, { x: to.x, y: to.y, duration: 0.3, ease: 'power2.in' })
  }

  return (
    <div
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
      }}
    >
      <button
        ref={btnRef}
        data-node-bubble
        onClick={() => onClick(data.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col items-center gap-2.5 select-none group bg-transparent border-0 p-0 cursor-pointer"
      >
        <div
          ref={(el) => {
            innerCircleRef.current = el
            circleRef(el)
          }}
          className={`relative w-[56px] h-[56px] rounded-full flex items-center justify-center border-2 overflow-hidden transition-all duration-300 ${
            isActive
              ? 'border-lime shadow-lime-glow'
              : 'border-slate/25 group-hover:border-lime/40'
          }`}
          style={{
            background: isActive ? 'rgba(200,255,0,0.07)' : 'rgba(255,255,255,0.035)',
          }}
        >
          {/* Directional fill layer */}
          <div
            ref={fillRef}
            className="absolute inset-0 bg-lime/[0.13] pointer-events-none"
          />

          {data.type === 'founder' ? (
            <img
              src="/images/team/erick.webp"
              alt="Erick Benzo"
              width={56}
              height={56}
              className="relative z-10 w-full h-full rounded-full object-cover"
            />
          ) : (
            <RobotIcon
              className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
                isActive ? 'text-lime' : 'text-slate/70 group-hover:text-chalk/60'
              }`}
            />
          )}

          {isActive && (
            <span
              className="absolute inset-[-3px] rounded-full border border-lime/20 pointer-events-none z-20"
              style={{ animation: 'node-pulse 2s ease-out infinite' }}
            />
          )}
        </div>

        <div className="text-center" style={{ width: 88 }}>
          <p
            className={`font-geist text-[11px] font-bold leading-snug tracking-tighter transition-colors duration-200 ${
              isActive ? 'text-chalk' : 'text-chalk/45 group-hover:text-chalk/70'
            }`}
          >
            {data.title}
          </p>
          <p
            className={`font-mono text-[9px] uppercase tracking-[0.14em] mt-0.5 transition-colors duration-200 ${
              isActive ? 'text-lime' : 'text-slate/55'
            }`}
          >
            {data.role}
          </p>
        </div>
      </button>
    </div>
  )
}

// ─── InlinePanel ────────────────────────────────────────────────────────────

interface InlinePanelProps {
  node: AgentNode | null
  onClose: () => void
  onCopy: (prompt: string) => void
  copied: boolean
}

function InlinePanel({ node, onClose, onCopy, copied }: InlinePanelProps) {
  const isOpen = node !== null
  const lastNodeRef = useRef<AgentNode | null>(node)
  if (node !== null) lastNodeRef.current = node
  const displayNode = lastNodeRef.current
  const cardRef = useRef<HTMLDivElement>(null)
  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // GSAP bounce-in when panel opens or active node changes within same zone
  useEffect(() => {
    const card = cardRef.current
    if (!card || !isOpen) return

    gsap.killTweensOf(card)
    if (reducedMotion) {
      gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'none' })
    } else {
      gsap.fromTo(
        card,
        { opacity: 0, y: 18, scale: 0.93 },
        { opacity: 1, y: 0, scale: 1, ease: 'back.out(1.7)', duration: 0.55 }
      )
    }
  }, [isOpen, displayNode?.id, reducedMotion])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: isOpen
          ? 'grid-template-rows 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{ overflow: 'hidden', minHeight: 0 }}>
        {displayNode && (
          <div className="pt-3 pb-8">
            {/* Stem connector */}
            <div className="flex justify-center mb-3" aria-hidden="true">
              <div className="w-px h-5 bg-lime/20" />
            </div>

            {/* Panel card */}
            <div
              ref={cardRef}
              data-tree-card
              className="mx-auto bg-[#111111] border border-slate/20 rounded-xl overflow-hidden"
              role="region"
              aria-label={`${displayNode.title} — ${displayNode.role}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Lime accent bar */}
              <div
                className="h-[1.5px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(200,255,0,0.45) 35%, rgba(200,255,0,0.45) 65%, transparent 100%)',
                }}
              />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-[10px] text-lime/70 uppercase tracking-[0.2em] mb-0.5">
                      {displayNode.role}
                    </p>
                    <h3 className="font-geist text-[17px] font-bold tracking-tighter text-chalk leading-tight">
                      {displayNode.title}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-3 mt-0.5 text-slate/40 hover:text-chalk/60 transition-colors flex-shrink-0"
                    aria-label="Close"
                  >
                    <XIcon />
                  </button>
                </div>

                {/* Bio */}
                <p className="font-sans text-[13px] text-chalk/50 leading-relaxed mb-4">
                  {displayNode.bio}
                </p>

                {/* Prompt snippet */}
                {displayNode.prompt && (
                  <div className="rounded-lg border border-slate/10 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-white/[0.025] border-b border-slate/10">
                      <span className="font-mono text-[9px] text-slate/50 uppercase tracking-[0.2em]">
                        System prompt
                      </span>
                      <button
                        onClick={() => onCopy(displayNode.prompt!)}
                        className="flex items-center gap-1.5 font-mono text-[10px] text-slate/50 hover:text-lime transition-colors"
                      >
                        {copied ? (
                          <>
                            <CheckIcon />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="font-mono text-[10px] text-slate/60 p-3 whitespace-pre-wrap leading-relaxed max-h-[120px] overflow-y-auto">
                      {displayNode.prompt}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Team ──────────────────────────────────────────────────────────────────

export function Team() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [lines, setLines] = useState<
    Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>
  >([])
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 })
  const [revealed, setRevealed] = useState(false)

  const activeNode = activeId ? (NODES.find(n => n.id === activeId) ?? null) : null
  const panelZone: 'founder' | 'cos' | 'agents' | null = activeNode
    ? activeNode.type === 'founder'
      ? 'founder'
      : activeNode.type === 'cos'
      ? 'cos'
      : 'agents'
    : null

  // ── SVG line calculation ────────────────────────────────────────────────

  const calcLines = useCallback(() => {
    const cont = containerRef.current
    if (!cont) return
    const cr = cont.getBoundingClientRect()

    const info = (id: string) => {
      const el = circleRefs.current[id]
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        cx: r.left + r.width / 2 - cr.left,
        top: r.top - cr.top,
        bottom: r.bottom - cr.top,
      }
    }

    const result: typeof lines = []
    const f = info('founder')
    const c = info('cos')

    if (f && c) {
      result.push({ id: 'fc', x1: f.cx, y1: f.bottom, x2: c.cx, y2: c.top })
    }

    if (c) {
      const acs = AGENT_IDS.map(id => info(id)).filter(
        Boolean
      ) as NonNullable<ReturnType<typeof info>>[]
      if (acs.length > 0) {
        const midY = c.bottom + (acs[0].top - c.bottom) * 0.5
        result.push({ id: 'cv', x1: c.cx, y1: c.bottom, x2: c.cx, y2: midY })
        result.push({
          id: 'hb',
          x1: acs[0].cx,
          y1: midY,
          x2: acs[acs.length - 1].cx,
          y2: midY,
        })
        AGENT_IDS.forEach((id, i) => {
          const a = acs[i]
          if (a) result.push({ id: `d${i}`, x1: a.cx, y1: midY, x2: a.cx, y2: a.top })
        })
      }
    }

    setLines(result)
    setSvgSize({ w: cr.width, h: cr.height })
  }, [])

  useEffect(() => {
    const t = setTimeout(calcLines, 80)
    const ro = new ResizeObserver(calcLines)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [calcLines])

  // Recalculate after panel animation settles
  useEffect(() => {
    const t = setTimeout(calcLines, 650)
    return () => clearTimeout(t)
  }, [activeId, calcLines])

  // ── Scroll reveal ───────────────────────────────────────────────────────

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    if (containerRef.current) io.observe(containerRef.current)
    return () => io.disconnect()
  }, [])

  // ── Outside-click dismissal ─────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Element
      if (!t.closest('[data-node-bubble]') && !t.closest('[data-tree-card]')) {
        setActiveId(null)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // ── Actions ─────────────────────────────────────────────────────────────

  const handleClick = useCallback((id: string) => {
    setActiveId(prev => (prev === id ? null : id))
  }, [])

  const handleClose = useCallback(() => setActiveId(null), [])

  const handleCopy = useCallback(async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }, [])

  const renderNode = (id: string, delay: number) => {
    const data = NODES.find(n => n.id === id)!
    return (
      <NodeBubble
        key={id}
        data={data}
        isActive={activeId === id}
        onClick={handleClick}
        circleRef={el => {
          circleRefs.current[id] = el
        }}
        revealed={revealed}
        delay={delay}
      />
    )
  }

  const panelShared = { onClose: handleClose, onCopy: handleCopy, copied }

  return (
    <section
      aria-labelledby="team-heading"
      className="section-team relative border-t border-slate/20"
    >
      <div className="glass-section-layer" aria-hidden />
      <div className="mx-auto max-w-content px-gutter py-section relative" style={{ zIndex: 1 }}>
        {/* Two-column on md+: text left, tree right. Single column on mobile. */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-x-12 lg:gap-x-16 items-start">

        {/* Left: heading + copy */}
        <div className="mb-16 md:mb-0 md:sticky md:top-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
            — THE TEAM
          </p>
          <h2
            id="team-heading"
            className="font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05] text-chalk"
          >
            Built by humans<span className="text-lime">.</span>
            <br />
            Scaled by agents<span className="text-lime">.</span>
          </h2>
          <p className="mt-5 font-sans text-[length:var(--text-base)] text-chalk/40 max-w-md leading-relaxed">
            One founder. One orchestration layer. Six specialist agents. Click any node to see the
            role and system prompt.
          </p>
        </div>

        {/* Right: org tree */}
        <div ref={containerRef} className="relative">
          {/* SVG connecting lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={svgSize.w}
            height={svgSize.h}
            style={{ overflow: 'visible' }}
            aria-hidden="true"
          >
            {lines.map((l, i) => (
              <line
                key={l.id}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="rgba(107,104,104,0.22)"
                strokeWidth="1"
                strokeDasharray="3 7"
                style={{
                  opacity: revealed ? 1 : 0,
                  transition: `opacity 0.65s ease ${350 + i * 90}ms`,
                }}
              />
            ))}
          </svg>

          {/* Zone 1: Founder */}
          <div>
            <div className="flex justify-center">{renderNode('founder', 0)}</div>
            <InlinePanel node={panelZone === 'founder' ? activeNode : null} {...panelShared} />
          </div>

          {/* Zone 2: Chief of Staff */}
          <div className="mt-12">
            <div className="flex justify-center">{renderNode('cos', 130)}</div>
            <InlinePanel node={panelZone === 'cos' ? activeNode : null} {...panelShared} />
          </div>

          {/* Zone 3: Specialist agents */}
          <div className="mt-12">
            <div className="grid grid-cols-3 gap-y-8 xl:grid-cols-6 gap-x-2 justify-items-center">
              {AGENT_IDS.map((id, i) => renderNode(id, 270 + i * 55))}
            </div>
            <InlinePanel node={panelZone === 'agents' ? activeNode : null} {...panelShared} />
          </div>
        </div>

        </div>{/* end two-column grid */}
      </div>
    </section>
  )
}

export default Team
