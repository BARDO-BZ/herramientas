'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  loadPresentations,
  createPresentation,
  savePresentation,
  deletePresentation,
} from '@/lib/presentation'
import type { Presentation } from '@/types/presentation'

export default function LogoPresentationListPage() {
  const router = useRouter()
  const [presentations, setPresentations] = useState<Presentation[]>([])

  useEffect(() => {
    setPresentations(loadPresentations())
  }, [])

  function handleNew() {
    const p = createPresentation()
    savePresentation(p)
    router.push(`/tools/logo-presentation/${p.id}`)
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('¿Eliminar esta presentación?')) return
    deletePresentation(id)
    setPresentations(loadPresentations())
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition">
              ← Inicio
            </Link>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Presentaciones de logo</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Armá y compartí presentaciones de logos con clientes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition"
          >
            + Nueva presentación
          </button>
        </div>

        {presentations.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-zinc-400">No hay presentaciones todavía.</p>
            <button
              type="button"
              onClick={handleNew}
              className="text-sm text-zinc-600 underline hover:text-zinc-900"
            >
              Crear la primera
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {presentations.map((p) => (
              <Link
                key={p.id}
                href={`/tools/logo-presentation/${p.id}`}
                className="group relative flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 hover:shadow-md transition"
              >
                <span className="font-medium text-zinc-900 truncate">{p.name}</span>
                <span className="text-xs text-zinc-400">
                  {p.slides.length} slide{p.slides.length !== 1 ? 's' : ''} ·{' '}
                  {new Date(p.updatedAt).toLocaleDateString('es-AR')}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDelete(p.id, e)}
                  className="absolute right-3 top-3 hidden group-hover:block text-xs text-zinc-300 hover:text-red-400 transition"
                >
                  ✕
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
