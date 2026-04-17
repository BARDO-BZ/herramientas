import { put } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { blobProxyUrl } from '@/lib/blob'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'bin'
  const blob = await put(`images/${crypto.randomUUID()}.${ext}`, file, {
    access: 'private',
    addRandomSuffix: false,
  })

  return NextResponse.json({ url: blobProxyUrl(blob.url) })
}
