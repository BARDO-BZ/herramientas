'use client'

import { SlideRenderer } from './SlideRenderer'
import { SLIDE_W, SLIDE_H } from './ScaledSlide'
import type { Presentation } from '@/types/presentation'

interface Props {
  presentation: Presentation
  slug: string
}

export function PrintView({ presentation, slug }: Props) {
  return (
    <>
      <style>{`
        @page { size: ${SLIDE_W}px ${SLIDE_H}px; margin: 0; }
        body { margin: 0; background: white; }
        .slide-page { width: ${SLIDE_W}px; height: ${SLIDE_H}px; overflow: hidden; page-break-after: always; break-after: page; }
        .slide-page:last-child { page-break-after: avoid; break-after: avoid; }
        @media screen {
          body { background: #18181b; display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 24px; }
          .slide-page { box-shadow: 0 8px 32px rgba(0,0,0,0.4); border-radius: 4px; }
          .print-bar { position: fixed; bottom: 24px; right: 24px; display: flex; gap: 8px; z-index: 100; }
        }
        @media print {
          .print-bar { display: none !important; }
          body { background: white !important; padding: 0 !important; gap: 0 !important; }
        }
      `}</style>

      {presentation.slides.map((slide) => (
        <div key={slide.id} className="slide-page">
          <SlideRenderer slide={slide} presentation={presentation} />
        </div>
      ))}

      <div className="print-bar" style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => window.print()}
          style={{ background: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Descargar PDF
        </button>
        <a
          href={`/p/${slug}`}
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 8, padding: '10px 20px', fontSize: 14, textDecoration: 'none' }}
        >
          ← Volver
        </a>
      </div>
    </>
  )
}
