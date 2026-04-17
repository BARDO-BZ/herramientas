import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { loadFolderIndex, saveFolderIndex } from '../route'
import { loadIndex, saveIndex } from '../../presentations/route'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Remove folder
  const folders = await loadFolderIndex()
  await saveFolderIndex(folders.filter((f) => f.id !== id))

  // Unassign presentations from this folder
  const index = await loadIndex()
  await saveIndex(index.map((p) => (p.folderId === id ? { ...p, folderId: undefined } : p)))

  return NextResponse.json({ ok: true })
}
