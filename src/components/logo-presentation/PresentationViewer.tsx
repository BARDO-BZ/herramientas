'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ScaledSlide, SLIDE_W, SLIDE_H } from './ScaledSlide'
import { SlideRenderer } from './SlideRenderer'
import type { Presentation, Comment } from '@/types/presentation'

interface Props {
  presentation: Presentation
}

export function PresentationViewer({ presentation }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [showComments, setShowComments] = useState(true)
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null)
  const [authorInput, setAuthorInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const slideContainerRef = useRef<HTMLDivElement>(null)

  const slide = presentation.slides[currentIdx]

  useEffect(() => {
    fetch(`/api/comments/${presentation.id}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {})
  }, [presentation.id])

  const goNext = useCallback(() => {
    setCurrentIdx((i) => Math.min(i + 1, presentation.slides.length - 1))
    setPendingPos(null)
  }, [presentation.slides.length])

  const goPrev = useCallback(() => {
    setCurrentIdx((i) => Math.max(i - 1, 0))
    setPendingPos(null)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (pendingPos) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, pendingPos])

  function handleSlideClick(e: React.MouseEvent<HTMLDivElement>) {
    if (pendingPos) { setPendingPos(null); return }
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPendingPos({ x, y })
  }

  async function submitComment() {
    if (!pendingPos || !authorInput.trim() || !textInput.trim()) return
    const comment: Comment = {
      id: crypto.randomUUID(),
      slideId: slide.id,
      author: authorInput.trim(),
      text: textInput.trim(),
      x: pendingPos.x,
      y: pendingPos.y,
      createdAt: new Date().toISOString(),
    }
    await fetch(`/api/comments/${presentation.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    })
    setComments((prev) => [...prev, comment])
    setPendingPos(null)
    setAuthorInput('')
    setTextInput('')
  }

  async function deleteComment(commentId: string) {
    await fetch(`/api/comments/${presentation.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId }),
    })
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  const slideComments = comments.filter((c) => c.slideId === slide?.id)

  if (presentation.slides.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-zinc-400">
        Esta presentación no tiene slides todavía.
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-900 select-none">
      {/* Slide */}
      <div
        ref={slideContainerRef}
        className="relative w-full max-w-6xl px-4"
      >
        <div className="relative cursor-crosshair" onClick={handleSlideClick}>
          <ScaledSlide className="shadow-2xl">
            <SlideRenderer slide={slide} presentation={presentation} />
          </ScaledSlide>

          {/* Comment bubbles */}
          {showComments && slideComments.map((comment) => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              onDelete={() => deleteComment(comment.id)}
            />
          ))}

          {/* Pending comment pin */}
          {pendingPos && (
            <div
              className="absolute z-50 w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shadow-lg -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pendingPos.x}%`, top: `${pendingPos.y}%` }}
            />
          )}
        </div>

        {/* Comment form */}
        {pendingPos && (
          <div
            className="absolute z-50 bg-white rounded-xl shadow-xl border border-zinc-100 p-4 w-72"
            style={{
              left: `${Math.min(pendingPos.x, 65)}%`,
              top: `${Math.min(pendingPos.y + 5, 80)}%`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-zinc-600 mb-3">Dejar un comentario</p>
            <input
              autoFocus
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              placeholder="Tu nombre"
              className="w-full text-sm border border-zinc-200 rounded-md px-3 py-1.5 mb-2 outline-none focus:border-zinc-400"
            />
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment() }}}
              placeholder="Escribí tu comentario..."
              rows={3}
              className="w-full text-sm border border-zinc-200 rounded-md px-3 py-1.5 mb-3 outline-none focus:border-zinc-400 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setPendingPos(null)} className="text-xs text-zinc-400 hover:text-zinc-600">Cancelar</button>
              <button
                onClick={submitComment}
                disabled={!authorInput.trim() || !textInput.trim()}
                className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-700 disabled:opacity-40 transition"
              >
                Comentar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
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
          onClick={(e) => { e.stopPropagation(); goNext() }}
          disabled={currentIdx === presentation.slides.length - 1}
          className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70 hover:bg-white/20 disabled:opacity-30 transition"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className={`rounded-full px-4 py-1.5 text-xs transition ${showComments ? 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}
        >
          {showComments ? `💬 ${slideComments.length}` : 'Mostrar comentarios'}
        </button>
        <a
          href={`/p/${presentation.slug}/print`}
          target="_blank"
          className="rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/40 hover:bg-white/20 transition"
        >
          PDF
        </a>
      </div>
      <p className="mt-3 text-xs text-white/20">Hacé click en el slide para comentar</p>
    </div>
  )
}

function CommentBubble({ comment, onDelete }: { comment: Comment; onDelete: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${comment.x}%`, top: `${comment.y}%` }}
      onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
    >
      <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
        <span className="text-[10px]">💬</span>
      </div>

      {open && (
        <div className="absolute left-7 top-0 z-50 bg-white rounded-xl shadow-xl border border-zinc-100 p-3 w-56 cursor-default">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-zinc-800">{comment.author}</span>
            <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="text-[10px] text-zinc-300 hover:text-red-400 transition shrink-0">✕</button>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">{comment.text}</p>
          <p className="mt-1.5 text-[10px] text-zinc-300">{new Date(comment.createdAt).toLocaleDateString('es-AR')}</p>
        </div>
      )}
    </div>
  )
}
