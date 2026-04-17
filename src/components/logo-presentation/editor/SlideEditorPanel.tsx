'use client'

import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ColorPicker } from './ColorPicker'
import { ImageUpload } from './ImageUpload'
import type {
  Slide,
  CoverSlide,
  IndexSlide,
  SimpleSlide,
  SimpleSlide2,
  VariantsSlide,
  ThreeColumnsSlide,
  BackgroundImageSlide,
} from '@/types/presentation'
import { addColumnItem, addLogoItem, sectionsForVariantDivisions } from '@/lib/presentation'

interface Props {
  slide: Slide
  onChange: (updated: Slide) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-zinc-500">{label}</Label>
      {children}
    </div>
  )
}

export function SlideEditorPanel({ slide, onChange }: Props) {
  function update(partial: Partial<Slide>) {
    onChange({ ...slide, ...partial } as Slide)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Common */}
      <ColorPicker
        label="Color de fondo"
        value={slide.backgroundColor}
        onChange={(v) => update({ backgroundColor: v })}
      />
      <ColorPicker
        label="Color de texto"
        value={slide.textColor}
        onChange={(v) => update({ textColor: v })}
      />
      <ImageUpload
        label="Imagen de fondo (opcional)"
        value={slide.backgroundImage ?? ''}
        onChange={(v) => update({ backgroundImage: v })}
        onClear={() => update({ backgroundImage: undefined })}
      />

      <Separator />

      {/* Type-specific */}
      {slide.type === 'cover' && (
        <CoverFields slide={slide} onChange={(s) => onChange(s)} />
      )}
      {slide.type === 'index' && (
        <IndexFields slide={slide} onChange={(s) => onChange(s)} />
      )}
      {slide.type === 'simple' && (
        <SimpleFields slide={slide} onChange={(s) => onChange(s)} />
      )}
      {slide.type === 'simple2' && (
        <Simple2Fields slide={slide} onChange={(s) => onChange(s)} />
      )}
      {slide.type === 'variants' && (
        <VariantsFields slide={slide} onChange={(s) => onChange(s)} />
      )}
      {slide.type === 'three-columns' && (
        <ThreeColumnsFields slide={slide} onChange={(s) => onChange(s)} />
      )}
      {slide.type === 'background-image' && (
        <BackgroundImageFields slide={slide} onChange={(s) => onChange(s)} />
      )}
    </div>
  )
}

// ── Cover ────────────────────────────────────────────────

function CoverFields({
  slide,
  onChange,
}: {
  slide: CoverSlide
  onChange: (s: CoverSlide) => void
}) {
  return (
    <Field label="Título">
      <Textarea
        value={slide.title}
        onChange={(e) => onChange({ ...slide, title: e.target.value })}
        rows={3}
        className="text-sm"
      />
    </Field>
  )
}

// ── Index ────────────────────────────────────────────────

function IndexFields({
  slide,
  onChange,
}: {
  slide: IndexSlide
  onChange: (s: IndexSlide) => void
}) {
  function updateParagraph(i: number, value: string) {
    const paragraphs = [...slide.paragraphs]
    paragraphs[i] = value
    onChange({ ...slide, paragraphs })
  }

  function addParagraph() {
    onChange({ ...slide, paragraphs: [...slide.paragraphs, ''] })
  }

  function removeParagraph(i: number) {
    onChange({ ...slide, paragraphs: slide.paragraphs.filter((_, idx) => idx !== i) })
  }

  return (
    <>
      <Field label="Título">
        <Input
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
          className="text-sm"
        />
      </Field>
      <Field label="Versión (superíndice)">
        <Input
          value={slide.versionText}
          onChange={(e) => onChange({ ...slide, versionText: e.target.value })}
          className="text-sm"
          placeholder="v1"
        />
      </Field>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-zinc-500">Ítems de contenido</Label>
        {slide.paragraphs.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Input
              value={p}
              onChange={(e) => updateParagraph(i, e.target.value)}
              className="text-sm"
            />
            <button
              type="button"
              onClick={() => removeParagraph(i)}
              className="text-zinc-300 hover:text-red-400 transition text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addParagraph}
          className="mt-1 text-xs text-zinc-400 hover:text-zinc-700 transition text-left"
        >
          + Agregar ítem
        </button>
      </div>
    </>
  )
}

// ── Simple ───────────────────────────────────────────────

function SimpleFields({
  slide,
  onChange,
}: {
  slide: SimpleSlide
  onChange: (s: SimpleSlide) => void
}) {
  return (
    <>
      <ImageUpload
        label="Imagen"
        value={slide.image}
        onChange={(v) => onChange({ ...slide, image: v })}
        onClear={() => onChange({ ...slide, image: '' })}
      />
      <Field label={`Tamaño de imagen: ${slide.imageSize}%`}>
        <Slider
          min={10}
          max={95}
          step={5}
          value={[slide.imageSize]}
          onValueChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v
            onChange({ ...slide, imageSize: val as number })
          }}
        />
      </Field>
    </>
  )
}

// ── Simple 2 ─────────────────────────────────────────────

function Simple2Fields({
  slide,
  onChange,
}: {
  slide: SimpleSlide2
  onChange: (s: SimpleSlide2) => void
}) {
  function updateLogo(id: string, partial: Partial<SimpleSlide2['logos'][number]>) {
    onChange({
      ...slide,
      logos: slide.logos.map((l) => (l.id === id ? { ...l, ...partial } : l)),
    })
  }

  function removeLogo(id: string) {
    onChange({ ...slide, logos: slide.logos.filter((l) => l.id !== id) })
  }

  return (
    <div className="flex flex-col gap-4">
      {slide.logos.map((logo, i) => (
        <div key={logo.id} className="flex flex-col gap-2 rounded-lg border border-zinc-100 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Logo {i + 1}</span>
            <button
              type="button"
              onClick={() => removeLogo(logo.id)}
              className="text-zinc-300 hover:text-red-400 transition text-xs"
            >
              Eliminar
            </button>
          </div>
          <ImageUpload
            label="Imagen"
            value={logo.image}
            onChange={(v) => updateLogo(logo.id, { image: v })}
            onClear={() => updateLogo(logo.id, { image: '' })}
          />
          <Field label="Texto debajo">
            <Input
              value={logo.caption}
              onChange={(e) => updateLogo(logo.id, { caption: e.target.value })}
              className="text-sm"
              placeholder="ej: Color"
            />
          </Field>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...slide, logos: [...slide.logos, addLogoItem()] })}
        className="text-xs text-zinc-400 hover:text-zinc-700 transition text-left"
      >
        + Agregar logo
      </button>
    </div>
  )
}

// ── Variants ─────────────────────────────────────────────

function VariantsFields({
  slide,
  onChange,
}: {
  slide: VariantsSlide
  onChange: (s: VariantsSlide) => void
}) {
  const divOptions: Array<2 | 3 | 4 | 6 | 9> = [2, 3, 4, 6, 9]

  function changeDivisions(val: string | null) {
    if (!val) return
    const divisions = Number(val) as 2 | 3 | 6 | 9
    onChange({
      ...slide,
      divisions,
      sections: sectionsForVariantDivisions(divisions, slide.sections),
    })
  }

  function updateSection(
    i: number,
    partial: Partial<VariantsSlide['sections'][number]>
  ) {
    const sections = [...slide.sections]
    sections[i] = { ...sections[i], ...partial }
    onChange({ ...slide, sections })
  }

  return (
    <>
      <Field label="Divisiones">
        <Select
          value={String(slide.divisions)}
          onValueChange={changeDivisions}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {divOptions.map((d) => (
              <SelectItem key={d} value={String(d)}>
                {d} {d === 4 ? '(2×2)' : d === 6 ? '(2×3)' : d === 9 ? '(3×3)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex flex-col gap-3">
        {slide.sections.map((section, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border border-zinc-100 p-3">
            <span className="text-xs font-medium text-zinc-500">Sección {i + 1}</span>
            <ColorPicker
              label="Color de fondo"
              value={section.backgroundColor}
              onChange={(v) => updateSection(i, { backgroundColor: v })}
            />
            <ImageUpload
              label="Logo / Imagen"
              value={section.image}
              onChange={(v) => updateSection(i, { image: v })}
              onClear={() => updateSection(i, { image: '' })}
            />
          </div>
        ))}
      </div>
    </>
  )
}

// ── Three columns ────────────────────────────────────────

function ThreeColumnsFields({
  slide,
  onChange,
}: {
  slide: ThreeColumnsSlide
  onChange: (s: ThreeColumnsSlide) => void
}) {
  function updateItem(
    colIdx: number,
    itemId: string,
    partial: Partial<ThreeColumnsSlide['columns'][number]['items'][number]>
  ) {
    const columns = slide.columns.map((col, ci) =>
      ci === colIdx
        ? { items: col.items.map((it) => (it.id === itemId ? { ...it, ...partial } : it)) }
        : col
    ) as ThreeColumnsSlide['columns']
    onChange({ ...slide, columns })
  }

  function removeItem(colIdx: number, itemId: string) {
    const columns = slide.columns.map((col, ci) =>
      ci === colIdx ? { items: col.items.filter((it) => it.id !== itemId) } : col
    ) as ThreeColumnsSlide['columns']
    onChange({ ...slide, columns })
  }

  function addItem(colIdx: number, kind: 'image' | 'text') {
    const columns = slide.columns.map((col, ci) =>
      ci === colIdx ? { items: [...col.items, addColumnItem(kind)] } : col
    ) as ThreeColumnsSlide['columns']
    onChange({ ...slide, columns })
  }

  return (
    <div className="flex flex-col gap-4">
      {slide.columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-2 rounded-lg border border-zinc-100 p-3">
          <span className="text-xs font-medium text-zinc-500">Columna {ci + 1}</span>

          {col.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 border-l-2 border-zinc-100 pl-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 capitalize">{item.kind === 'image' ? 'Imagen' : 'Texto'}</span>
                <button
                  type="button"
                  onClick={() => removeItem(ci, item.id)}
                  className="text-xs text-zinc-300 hover:text-red-400 transition"
                >
                  ✕
                </button>
              </div>
              {item.kind === 'image' ? (
                <>
                  <ImageUpload
                    label="Imagen"
                    value={item.content}
                    onChange={(v) => updateItem(ci, item.id, { content: v })}
                    onClear={() => updateItem(ci, item.id, { content: '' })}
                  />
                  <Field label={`Tamaño: ${item.imageSize}%`}>
                    <Slider
                      min={10}
                      max={100}
                      step={5}
                      value={[item.imageSize]}
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v
                        updateItem(ci, item.id, { imageSize: val as number })
                      }}
                    />
                  </Field>
                </>
              ) : (
                <Textarea
                  value={item.content}
                  onChange={(e) => updateItem(ci, item.id, { content: e.target.value })}
                  rows={2}
                  className="text-sm"
                />
              )}
            </div>
          ))}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => addItem(ci, 'image')}
              className="text-xs text-zinc-400 hover:text-zinc-700 transition"
            >
              + Imagen
            </button>
            <button
              type="button"
              onClick={() => addItem(ci, 'text')}
              className="text-xs text-zinc-400 hover:text-zinc-700 transition"
            >
              + Texto
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Background image ─────────────────────────────────────

function BackgroundImageFields({
  slide,
  onChange,
}: {
  slide: BackgroundImageSlide
  onChange: (s: BackgroundImageSlide) => void
}) {
  return (
    <>
      <Field label="Título (opcional)">
        <Input
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
          className="text-sm"
        />
      </Field>
      <Field label="Subtítulo (opcional)">
        <Input
          value={slide.subtitle}
          onChange={(e) => onChange({ ...slide, subtitle: e.target.value })}
          className="text-sm"
        />
      </Field>
    </>
  )
}
