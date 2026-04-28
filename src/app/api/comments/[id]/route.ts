import { put, list } from '@vercel/blob'
import { blobFetch } from '@/lib/blob'
import { NextResponse } from 'next/server'
import type { Comment } from '@/types/presentation'

async function loadComments(presentationId: string): Promise<Comment[]> {
  const { blobs } = await list({ prefix: `comments/${presentationId}.json` })
  if (!blobs[0]) return []
  const res = await blobFetch(blobs[0].url)
  return res.ok ? res.json() : []
}

async function saveComments(presentationId: string, comments: Comment[]) {
  await put(
    `comments/${presentationId}.json`,
    JSON.stringify(comments),
    { access: 'private', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json' }
  )
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const comments = await loadComments(id)
  return NextResponse.json(comments)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const comment: Comment = await req.json()
  const comments = await loadComments(id)
  comments.push(comment)
  await saveComments(id, comments)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { commentId }: { commentId: string } = await req.json()
  const comments = (await loadComments(id)).filter((c) => c.id !== commentId)
  await saveComments(id, comments)
  return NextResponse.json({ ok: true })
}
