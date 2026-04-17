import { list } from '@vercel/blob'
import { notFound } from 'next/navigation'
import type { Presentation } from '@/types/presentation'
import { PrintView } from '@/components/logo-presentation/PrintView'
import { blobFetch } from '@/lib/blob'

async function fetchBySlug(slug: string): Promise<Presentation | null> {
  try {
    const { blobs: slugBlobs } = await list({ prefix: `slugs/${slug}.json` })
    if (!slugBlobs[0]) return null
    const { id } = await blobFetch(slugBlobs[0].url).then((r) => r.json())
    const { blobs } = await list({ prefix: `presentations/${id}.json` })
    if (!blobs[0]) return null
    return blobFetch(blobs[0].url).then((r) => r.json())
  } catch {
    return null
  }
}

export default async function PrintPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const presentation = await fetchBySlug(slug)
  if (!presentation) notFound()
  return <PrintView presentation={presentation} slug={slug} />
}
