'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScaledSlide } from '../ScaledSlide'
import { SlideRenderer } from '../SlideRenderer'
import { SlideEditorPanel } from './SlideEditorPanel'
import { savePresentation, createDefaultSlide, SLIDE_TYPE_LABELS } from '@/lib/presentation'
import type { Presentation, Slide, SlideType } from '@/types/presentation'

const SLIDE_TYPES = Object.entries(SLIDE_TYPE_LABELS) as [SlideType, string][]

interface Props {
  initial: Presentation
}

export function PresentationEditor({ initial }: Props) {
  const router = useRouter()
  const [presentation, setPresentation] = useState<Presentation>(initial)
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.slides[0]?.id ?? null
  )
  const [addingSlide, setAddingSlide] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedSlide = presentation.slides.find((s) => s.id === selectedId) ?? null

  function updatePresentation(partial: Partial<Presentation>) {
    setPresentation((p) => ({ ...p, ...partial }))
    setSaved(false)
  }

  function addSlide(type: SlideType) {
    const slide = createDefaultSlide(type)
    const slides = [...presentation.slides, slide]
    updatePresentation({ slides })
    setSelectedId(slide.id)
    setAddingSlide(false)
  }

  function updateSlide(updated: Slide) {
    updatePresentation({
      slides: presentation.slides.map((s) => (s.id === updated.id ? updated : s)),
    })
  }

  function deleteSlide(id: string) {
    const slides = presentation.slides.filter((s) => s.id !== id)
    updatePresentation({ slides })
    if (selectedId === id) {
      setSelectedId(slides[0]?.id ?? null)
    }
  }

  function moveSlide(id: string, dir: -1 | 1) {
    const idx = presentation.slides.findIndex((s) => s.id === id)
    if (idx < 0) return
    const next = idx + dir
    if (next < 0 || next >= presentation.slides.length) return
    const slides = [...presentation.slides]
    ;[slides[idx], slides[next]] = [slides[next], slides[idx]]
    updatePresentation({ slides })
  }

  const handleSave = useCallback(() => {
    savePresentation(presentation)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [presentation])

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/p/${presentation.id}`
      : `/p/${presentation.id}`

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.push('/tools/logo-presentation')}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition shrink-0"
          >
            ← Volver
          </button>
          <Input
            value={presentation.name}
            onChange={(e) => updatePresentation({ name: e.target.value })}
            className="h-8 text-sm font-medium border-0 shadow-none focus-visible:ring-0 px-1 min-w-0 w-56"
          />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-zinc-400 whitespace-nowrap">Header izq.</Label>
            <Input
              value={presentation.headerLeft}
              onChange={(e) => updatePresentation({ headerLeft: e.target.value })}
              className="h-7 w-28 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-zinc-400 whitespace-nowrap">Header der.</Label>
            <Input
              value={presentation.headerRight}
              onChange={(e) => updatePresentation({ headerRight: e.target.value })}
              className="h-7 w-40 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
            }}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition"
          >
            Copiar link
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 transition"
          >
            {saved ? 'Guardado ✓' : 'Guardar'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left: slide list */}
        <aside className="flex w-52 shrink-0 flex-col border-r border-zinc-200 bg-white overflow-y-auto">
          <div className="p-3 flex flex-col gap-2">
            {presentation.slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => setSelectedId(slide.id)}
                className={`group relative cursor-pointer rounded-md overflow-hidden border-2 transition ${
                  selectedId === slide.id
                    ? 'border-zinc-900'
                    : 'border-zinc-100 hover:border-zinc-300'
                }`}
              >
                <ScaledSlide>
                  <SlideRenderer slide={slide} presentation={presentation} />
                </ScaledSlide>
                <div className="absolute bottom-1 left-1.5 text-[9px] text-zinc-400 bg-white/80 rounded px-1">
                  {idx + 1}
                </div>
                <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-0.5 bg-white/90 rounded px-1 py-0.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveSlide(slide.id, -1) }}
                    className="text-[10px] text-zinc-400 hover:text-zinc-700"
                    title="Mover arriba"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveSlide(slide.id, 1) }}
                    className="text-[10px] text-zinc-400 hover:text-zinc-700"
                    title="Mover abajo"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteSlide(slide.id) }}
                    className="text-[10px] text-red-300 hover:text-red-500 ml-0.5"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Add slide */}
            {!addingSlide ? (
              <button
                type="button"
                onClick={() => setAddingSlide(true)}
                className="flex items-center justify-center rounded-md border-2 border-dashed border-zinc-200 py-4 text-xs text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition"
              >
                + Slide
              </button>
            ) : (
              <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                <span className="text-xs font-medium text-zinc-500 mb-1">Tipo de slide</span>
                {SLIDE_TYPES.map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addSlide(type)}
                    className="rounded px-2 py-1.5 text-left text-xs text-zinc-700 hover:bg-white hover:shadow-sm transition"
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAddingSlide(false)}
                  className="mt-1 text-xs text-zinc-400 hover:text-zinc-600 transition"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Center: preview */}
        <main className="flex flex-1 min-w-0 items-center justify-center bg-zinc-100 p-8">
          {selectedSlide ? (
            <div className="w-full max-w-4xl shadow-xl rounded-sm overflow-hidden">
              <ScaledSlide>
                <SlideRenderer slide={selectedSlide} presentation={presentation} />
              </ScaledSlide>
            </div>
          ) : (
            <div className="text-sm text-zinc-400">
              Agregá un slide para empezar
            </div>
          )}
        </main>

        {/* Right: editor */}
        {selectedSlide && (
          <aside className="flex w-72 shrink-0 flex-col border-l border-zinc-200 bg-white overflow-y-auto">
            <div className="border-b border-zinc-100 px-4 py-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                {SLIDE_TYPE_LABELS[selectedSlide.type]}
              </span>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <SlideEditorPanel slide={selectedSlide} onChange={updateSlide} />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
