export function blobFetch(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      ...init?.headers,
    },
    next: { revalidate: 0 },
  })
}

export function blobProxyUrl(blobUrl: string) {
  return `/api/blob?url=${encodeURIComponent(blobUrl)}`
}
