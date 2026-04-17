'use client'

import { Label } from '@/components/ui/label'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-xs text-zinc-500">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400 font-mono">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border border-zinc-200 p-0.5"
        />
      </div>
    </div>
  )
}
