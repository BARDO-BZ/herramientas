import { put, list, del } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { blobFetch } from '@/lib/blob'
import { NextResponse } from 'next/server'
import type { Presentation } from '@/types/presentation'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { presentation, previousSlug }: { presentation: Presentation; previousSlug?: string } =
    await req.json()

  if (previousSlug && previousSlug !== presentation.slug) {
    const { blobs } = await list({ prefix: `slugs/${previousSlug}.json` })
    if (blobs[0]) await del(blobs[0].url)
  }

  if (!previousSlug || previousSlug !== presentation.slug) {
    const { blobs } = await list({ prefix: `slugs/${presentation.slug}.json` })
    if (blobs.length > 0) {
      const existing = await blobFetch(blobs[0].url).then((r) => r.json())
      if (existing.id !== presentation.id) {
        return NextResponse.json({ error: 'slug_taken' }, { status: 409 })
      }
    }
  }

  await put(
    `slugs/${presentation.slug}.json`,
    JSON.stringify({ id: presentation.id }),
    { access: 'private', addRandomSuffix: false, contentType: 'application/json' }
  )

  await put(
    `presentations/${presentation.id}.json`,
    JSON.stringify(presentation),
    { access: 'private', addRandomSuffix: false, contentType: 'application/json' }
  )

  return NextResponse.json({ ok: true })
}
