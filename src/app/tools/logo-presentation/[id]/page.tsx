'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { loadPresentation } from '@/lib/presentation'
import { PresentationEditor } from '@/components/logo-presentation/editor/PresentationEditor'
import type { Presentation } from '@/types/presentation'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const [presentation, setPresentation] = useState<Presentation | null | 'loading'>('loading')

  useEffect(() => {
    const p = loadPresentation(id)
    setPresentation(p)
  }, [id])

  if (presentation === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-zinc-400">
        Cargando...
      </div>
    )
  }

  if (!presentation) {
    notFound()
  }

  return <PresentationEditor initial={presentation} />
}
