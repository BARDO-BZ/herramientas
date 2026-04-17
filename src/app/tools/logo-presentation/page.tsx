'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createPresentation, savePresentation, createFolder } from '@/lib/presentation'
import type { Presentation, Folder } from '@/types/presentation'

interface PresentationSummary {
  id: string
  name: string
  slug: string
  updatedAt: string
  folderId?: string
}

export default function LogoPresentationListPage() {
  const router = useRouter()
  const [presentations, setPresentations] = useState<PresentationSummary[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)

  const reload = useCallback(async () => {
    const [presRes, foldersRes] = await Promise.all([
      fetch('/api/presentations'),
      fetch('/api/folders'),
    ])
    if (presRes.ok) setPresentations(await presRes.json())
    if (foldersRes.ok) setFolders(await foldersRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { reload() }, [reload])

  async function handleNew(folderId?: string) {
    const p = createPresentation()
    if (folderId) p.folderId = folderId
    savePresentation(p)
    router.push(`/tools/logo-presentation/${p.id}`)
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('¿Eliminar esta presentación?')) return
    await fetch(`/api/presentations/${id}`, { method: 'DELETE' })
    reload()
  }

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return
    const f = createFolder(newFolderName.trim())
    await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    })
    setNewFolderName('')
    setCreatingFolder(false)
    reload()
  }

  async function handleDeleteFolder(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('¿Eliminar esta carpeta? Las presentaciones quedarán sin carpeta.')) return
    await fetch(`/api/folders/${id}`, { method: 'DELETE' })
    reload()
  }

  async function handleMoveToFolder(presentationId: string, folderId: string | undefined) {
    const summary = presentations.find((p) => p.id === presentationId)
    if (!summary) return

    // Load full presentation, update folderId, re-save
    const res = await fetch(`/api/presentations/${presentationId}`)
    if (!res.ok) return
    const presentation: Presentation = await res.json()
    const updated = { ...presentation, folderId }

    await fetch('/api/presentations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentation: updated, previousSlug: updated.slug }),
    })
    savePresentation(updated)
    reload()
  }

  const ungrouped = presentations.filter((p) => !p.folderId)

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-sm text-zinc-400">Cargando...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition">← Inicio</Link>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Presentaciones de logo</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCreatingFolder(true)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition"
            >
              + Carpeta
            </button>
            <button
              type="button"
              onClick={() => handleNew()}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition"
            >
              + Nueva presentación
            </button>
          </div>
        </div>

        {creatingFolder && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4">
            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder()
                if (e.key === 'Escape') setCreatingFolder(false)
              }}
              placeholder="Nombre de la carpeta..."
              className="flex-1 text-sm outline-none"
            />
            <button onClick={handleCreateFolder} className="text-sm text-zinc-900 font-medium hover:text-zinc-600">Crear</button>
            <button onClick={() => setCreatingFolder(false)} className="text-sm text-zinc-400 hover:text-zinc-600">Cancelar</button>
          </div>
        )}

        {presentations.length === 0 && folders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-zinc-400">No hay presentaciones todavía.</p>
            <button type="button" onClick={() => handleNew()} className="text-sm text-zinc-600 underline hover:text-zinc-900">Crear la primera</button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {folders.map((folder) => {
              const folderPresentations = presentations.filter((p) => p.folderId === folder.id)
              return (
                <div key={folder.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-zinc-700">📁 {folder.name}</span>
                      <span className="text-xs text-zinc-400">{folderPresentations.length}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleNew(folder.id)} className="text-xs text-zinc-400 hover:text-zinc-700">+ Nueva</button>
                      <button onClick={(e) => handleDeleteFolder(folder.id, e)} className="text-xs text-zinc-300 hover:text-red-400">Eliminar carpeta</button>
                    </div>
                  </div>
                  <PresentationGrid presentations={folderPresentations} folders={folders} onDelete={handleDelete} onMove={handleMoveToFolder} />
                  {folderPresentations.length === 0 && (
                    <p className="text-sm text-zinc-400 pl-1">Sin presentaciones. <button onClick={() => handleNew(folder.id)} className="underline hover:text-zinc-700">Crear una</button></p>
                  )}
                </div>
              )
            })}

            {ungrouped.length > 0 && (
              <div>
                {folders.length > 0 && <p className="mb-3 text-sm font-medium text-zinc-500">Sin carpeta</p>}
                <PresentationGrid presentations={ungrouped} folders={folders} onDelete={handleDelete} onMove={handleMoveToFolder} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function PresentationGrid({
  presentations,
  folders,
  onDelete,
  onMove,
}: {
  presentations: PresentationSummary[]
  folders: Folder[]
  onDelete: (id: string, e: React.MouseEvent) => void
  onMove: (presentationId: string, folderId: string | undefined) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {presentations.map((p) => (
        <div key={p.id} className="group relative">
          <Link
            href={`/tools/logo-presentation/${p.id}`}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 hover:shadow-md transition block"
          >
            <span className="font-medium text-zinc-900 truncate">{p.name}</span>
            <span className="text-xs text-zinc-400">
              {new Date(p.updatedAt).toLocaleDateString('es-AR')}
            </span>
            <span className="text-xs text-zinc-300 font-mono truncate">/p/{p.slug}</span>
          </Link>
          <div className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1.5 bg-white rounded-lg border border-zinc-100 shadow-sm px-2 py-1">
            {folders.length > 0 && (
              <select
                className="text-xs text-zinc-400 bg-transparent outline-none cursor-pointer"
                value={p.folderId ?? ''}
                onChange={(e) => onMove(p.id, e.target.value || undefined)}
                onClick={(e) => e.preventDefault()}
              >
                <option value="">Sin carpeta</option>
                {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            )}
            <button type="button" onClick={(e) => onDelete(p.id, e)} className="text-xs text-zinc-300 hover:text-red-400 transition">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
