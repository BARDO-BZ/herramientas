import type {
  Presentation,
  Slide,
  SlideType,
  VariantsSlide,
} from '@/types/presentation'

const STORAGE_KEY = 'bardo-presentations'

function generateId(): string {
  return crypto.randomUUID()
}

export function loadPresentations(): Presentation[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function loadPresentation(id: string): Presentation | null {
  return loadPresentations().find((p) => p.id === id) ?? null
}

export function savePresentation(presentation: Presentation): void {
  const all = loadPresentations()
  const idx = all.findIndex((p) => p.id === presentation.id)
  const updated = { ...presentation, updatedAt: new Date().toISOString() }
  if (idx >= 0) all[idx] = updated
  else all.push(updated)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function deletePresentation(id: string): void {
  const all = loadPresentations().filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function createPresentation(): Presentation {
  return {
    id: generateId(),
    name: 'Nueva presentación',
    headerLeft: 'Bardo',
    headerRight: 'Propuesta de identidad visual',
    slides: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function sectionsForDivisions(n: number) {
  return Array.from({ length: n }, () => ({ backgroundColor: '#f5f5f5', image: '' }))
}

export function createDefaultSlide(type: SlideType): Slide {
  const base = {
    id: generateId(),
    backgroundColor: '#ffffff',
    textColor: '#000000',
    backgroundImage: undefined,
  }

  switch (type) {
    case 'cover':
      return { ...base, type, title: 'Título de la presentación' }

    case 'index':
      return {
        ...base,
        type,
        title: 'Contenido',
        versionText: 'v1',
        paragraphs: ['Item 1', 'Item 2', 'Item 3'],
      }

    case 'simple':
      return { ...base, type, image: '', imageSize: 60 }

    case 'simple2':
      return {
        ...base,
        type,
        logos: [
          { id: generateId(), image: '', caption: 'Principal' },
          { id: generateId(), image: '', caption: 'Alternativo' },
        ],
      }

    case 'variants': {
      const slide: VariantsSlide = {
        ...base,
        type,
        divisions: 2,
        sections: sectionsForDivisions(2),
      }
      return slide
    }

    case 'three-columns':
      return {
        ...base,
        type,
        columns: [{ items: [] }, { items: [] }, { items: [] }],
      }

    case 'background-image':
      return { ...base, type, title: '', subtitle: '' }
  }
}

export function addColumnItem(
  kind: 'image' | 'text'
): import('@/types/presentation').ColumnItem {
  return { id: generateId(), kind, content: '', imageSize: 60 }
}

export function addLogoItem(): import('@/types/presentation').LogoItem {
  return { id: generateId(), image: '', caption: '' }
}

export function sectionsForVariantDivisions(
  divisions: 2 | 3 | 6 | 9,
  existing: import('@/types/presentation').VariantSection[]
): import('@/types/presentation').VariantSection[] {
  const result = sectionsForDivisions(divisions)
  return result.map((s, i) => existing[i] ?? s)
}

export const SLIDE_TYPE_LABELS: Record<SlideType, string> = {
  cover: 'Portada',
  index: 'Índice',
  simple: 'Simple',
  simple2: 'Logos en fila',
  variants: 'Variantes de logo',
  'three-columns': 'Tres columnas',
  'background-image': 'Imagen de fondo',
}
