'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { loadPresentation, savePresentation } from '@/lib/presentation'
import { PresentationEditor } from '@/components/logo-presentation/editor/PresentationEditor'
import type { Presentation } from '@/types/presentation'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const [presentation, setPresentation] = useState<Presentation | null | 'loading'>('loading')

  useEffect(() => {
    // Try localStorage first (fast), fallback to Blob API
    const local = loadPresentation(id)
    if (local) {
      setPresentation(local)
      return
    }

    fetch(`/api/presentations/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (p) savePresentation(p) // cache locally
        setPresentation(p)
      })
      .catch(() => setPresentation(null))
  }, [id])

  if (presentation === 'loading') {
    return <div className="flex h-screen items-center justify-center text-sm text-zinc-400">Cargando...</div>
  }

  if (!presentation) notFound()

  return <PresentationEditor initial={presentation} />
}
