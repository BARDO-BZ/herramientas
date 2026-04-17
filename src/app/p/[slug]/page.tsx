'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { loadPresentation } from '@/lib/presentation'
import { ScaledSlide } from '@/components/logo-presentation/ScaledSlide'
import { SlideRenderer } from '@/components/logo-presentation/SlideRenderer'
import type { Presentation } from '@/types/presentation'

export default function PublicPresentationPage() {
  const { slug } = useParams<{ slug: string }>()
  const [presentation, setPresentation] = useState<Presentation | null | 'loading'>('loading')
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    setPresentation(loadPresentation(slug))
  }, [slug])

  const goNext = useCallback(() => {
    if (!presentation || presentation === 'loading') return
    setCurrentIdx((i) => Math.min(i + 1, presentation.slides.length - 1))
  }, [presentation])

  const goPrev = useCallback(() => {
    setCurrentIdx((i) => Math.max(i - 1, 0))
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  if (presentation === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-zinc-400">
        Cargando...
      </div>
    )
  }

  if (!presentation || presentation.slides.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-zinc-400">
        Presentación no encontrada.
      </div>
    )
  }

  const slide = presentation.slides[currentIdx]

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-900 select-none">
      {/* Slide */}
      <div className="w-full max-w-6xl px-4" onClick={goNext}>
        <ScaledSlide className="cursor-pointer shadow-2xl">
          <SlideRenderer slide={slide} presentation={presentation} />
        </ScaledSlide>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIdx === 0}
          className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70 hover:bg-white/20 disabled:opacity-30 transition"
        >
          ←
        </button>
        <span className="text-xs text-white/40">
          {currentIdx + 1} / {presentation.slides.length}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={currentIdx === presentation.slides.length - 1}
          className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70 hover:bg-white/20 disabled:opacity-30 transition"
        >
          →
        </button>
      </div>
    </div>
  )
}
