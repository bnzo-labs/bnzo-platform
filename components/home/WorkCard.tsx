'use client'

import { useRef, useState, useEffect } from 'react'
import type { WorkItem } from '@/lib/work'

interface WorkCardProps {
  item: WorkItem
  index: number
}

export function WorkCard({ item, index }: WorkCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoMountedRef = useRef<boolean>(false)
  const [videoMounted, setVideoMounted] = useState(false)

  useEffect(() => {
    const card = containerRef.current
    if (!card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !videoMountedRef.current) {
          observer.disconnect()
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            videoMountedRef.current = true
            setVideoMounted(true)
          }
        }
      },
      { rootMargin: '300px', threshold: 0 }
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!videoMounted) return
    if (window.matchMedia('(pointer: coarse)').matches) {
      videoRef.current?.play()
    }
  }, [videoMounted])

  const handleMouseEnter = () => {
    videoRef.current?.play()
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <article
      ref={containerRef}
      className="group relative overflow-hidden rounded-[8px] border border-slate/20 bg-white/[0.03] transition duration-normal ease-out-expo hover:border-[rgba(200,255,0,0.4)] hover:-translate-y-0.5 hover:shadow-lime-glow"
      data-reveal
      data-reveal-delay={String(index * 80)}
      onMouseEnter={videoMounted ? handleMouseEnter : undefined}
      onMouseLeave={videoMounted ? handleMouseLeave : undefined}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.posterPath}
          alt={item.client}
          width={800}
          height={600}
          className="w-full aspect-video object-cover"
        />
        {videoMounted && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
            aria-hidden
          >
            <source src={item.webmPath} type="video/webm" />
            <source src={item.mp4Path} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="p-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate">
          {item.client}
        </p>
        <h3 className="font-geist font-bold text-[length:var(--text-xl)] text-chalk leading-tight">
          {item.outcome}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs text-chalk/50">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <a
        href={item.href}
        className="absolute inset-0"
        aria-label={`View case study: ${item.client}`}
      />
    </article>
  )
}

export default WorkCard
