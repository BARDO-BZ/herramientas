import { list, del } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { blobFetch } from '@/lib/blob'
import { NextResponse } from 'next/server'
import { loadIndex, saveIndex } from '../route'

async function findPresentationBlob(id: string) {
  const { blobs } = await list({ prefix: `presentations/${id}.json` })
  return blobs[0] ?? null
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blob = await findPresentationBlob(id)
  if (!blob) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const res = await blobFetch(blob.url)
  return NextResponse.json(await res.json())
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const blob = await findPresentationBlob(id)
  if (blob) {
    const presentation = await blobFetch(blob.url).then((r) => r.json())

    const { blobs: slugBlobs } = await list({ prefix: `slugs/${presentation.slug}.json` })
    if (slugBlobs[0]) await del(slugBlobs[0].url)

    const { blobs: commentBlobs } = await list({ prefix: `comments/${id}.json` })
    if (commentBlobs[0]) await del(commentBlobs[0].url)

    await del(blob.url)

    // Remove from index
    const index = await loadIndex()
    await saveIndex(index.filter((p) => p.id !== id))
  }

  return NextResponse.json({ ok: true })
}
