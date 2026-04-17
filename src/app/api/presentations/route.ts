import { put, list, del } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { blobFetch } from '@/lib/blob'
import { NextResponse } from 'next/server'
import type { Presentation } from '@/types/presentation'

interface PresentationSummary {
  id: string
  name: string
  slug: string
  updatedAt: string
  folderId?: string
}

async function loadIndex(): Promise<PresentationSummary[]> {
  const { blobs } = await list({ prefix: 'presentations/index.json' })
  if (!blobs[0]) return []
  const res = await blobFetch(blobs[0].url)
  return res.ok ? res.json() : []
}

async function saveIndex(items: PresentationSummary[]) {
  await put('presentations/index.json', JSON.stringify(items), {
    access: 'private',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const index = await loadIndex()
  return NextResponse.json(index)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presentation, previousSlug }: { presentation: Presentation; previousSlug?: string } =
    await req.json()

  // Handle slug change
  if (previousSlug && previousSlug !== presentation.slug) {
    const { blobs } = await list({ prefix: `slugs/${previousSlug}.json` })
    if (blobs[0]) await del(blobs[0].url)
  }

  // Check slug uniqueness
  if (!previousSlug || previousSlug !== presentation.slug) {
    const { blobs } = await list({ prefix: `slugs/${presentation.slug}.json` })
    if (blobs.length > 0) {
      const existing = await blobFetch(blobs[0].url).then((r) => r.json())
      if (existing.id !== presentation.id) {
        return NextResponse.json({ error: 'slug_taken' }, { status: 409 })
      }
    }
  }

  // Save slug mapping
  await put(
    `slugs/${presentation.slug}.json`,
    JSON.stringify({ id: presentation.id }),
    { access: 'private', addRandomSuffix: false, contentType: 'application/json' }
  )

  // Save full presentation
  await put(
    `presentations/${presentation.id}.json`,
    JSON.stringify(presentation),
    { access: 'private', addRandomSuffix: false, contentType: 'application/json' }
  )

  // Update index
  const index = await loadIndex()
  const summary: PresentationSummary = {
    id: presentation.id,
    name: presentation.name,
    slug: presentation.slug,
    updatedAt: presentation.updatedAt,
    folderId: presentation.folderId,
  }
  const idx = index.findIndex((p) => p.id === presentation.id)
  if (idx >= 0) index[idx] = summary
  else index.unshift(summary)
  await saveIndex(index)

  return NextResponse.json({ ok: true })
}

export { loadIndex, saveIndex }
export type { PresentationSummary }
