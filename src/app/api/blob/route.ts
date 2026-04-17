import { blobFetch } from '@/lib/blob'

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get('url')
  if (!url) return new Response(null, { status: 400 })

  const res = await blobFetch(url)
  if (!res.ok) return new Response(null, { status: 404 })

  return new Response(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
