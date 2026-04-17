import { put, list } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { blobFetch } from '@/lib/blob'
import { NextResponse } from 'next/server'
import type { Folder } from '@/types/presentation'

async function loadFolderIndex(): Promise<Folder[]> {
  const { blobs } = await list({ prefix: 'folders/index.json' })
  if (!blobs[0]) return []
  const res = await blobFetch(blobs[0].url)
  return res.ok ? res.json() : []
}

async function saveFolderIndex(folders: Folder[]) {
  await put('folders/index.json', JSON.stringify(folders), {
    access: 'private',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json(await loadFolderIndex())
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const folder: Folder = await req.json()
  const folders = await loadFolderIndex()
  const idx = folders.findIndex((f) => f.id === folder.id)
  if (idx >= 0) folders[idx] = folder
  else folders.push(folder)
  await saveFolderIndex(folders)
  return NextResponse.json({ ok: true })
}

export { loadFolderIndex, saveFolderIndex }
