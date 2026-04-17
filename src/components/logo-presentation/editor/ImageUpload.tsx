'use client'

import { useRef } from 'react'
import { Label } from '@/components/ui/label'

interface ImageUploadProps {
  label: string
  value: string
  onChange: (base64: string) => void
  onClear?: () => void
}

export function ImageUpload({ label, value, onChange, onClear }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-zinc-500">{label}</Label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 transition text-left truncate"
        >
          {value ? 'Reemplazar imagen' : 'Subir imagen (SVG, PNG, JPG)'}
        </button>
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-zinc-400 hover:text-red-500 transition"
          >
            ✕
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          onChange={handleFile}
          className="hidden"
        />
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-1 h-14 w-full rounded border border-zinc-100 object-contain bg-zinc-50"
        />
      )}
    </div>
  )
}
