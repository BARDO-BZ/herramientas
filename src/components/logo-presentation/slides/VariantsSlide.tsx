import { SlideHeader } from '../SlideHeader'
import type { VariantsSlide as VariantsSlideType, Presentation } from '@/types/presentation'
import { SLIDE_W, SLIDE_H } from '../ScaledSlide'

interface Props {
  slide: VariantsSlideType
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

function getGridStyle(divisions: 2 | 3 | 4 | 6 | 9): { cols: number; rows: number } {
  if (divisions === 2) return { cols: 2, rows: 1 }
  if (divisions === 3) return { cols: 3, rows: 1 }
  if (divisions === 4) return { cols: 2, rows: 2 }
  if (divisions === 6) return { cols: 3, rows: 2 }
  return { cols: 3, rows: 3 }
}

export function VariantsSlide({ slide, presentation }: Props) {
  const { cols, rows } = getGridStyle(slide.divisions)
  const headerH = 56
  const cellW = SLIDE_W / cols
  const cellH = (SLIDE_H - headerH) / rows

  return (
    <div
      style={{
        width: SLIDE_W,
        height: SLIDE_H,
        backgroundColor: slide.backgroundColor,
        color: slide.textColor,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      <SlideHeader
        left={presentation.headerLeft}
        right={presentation.headerRight}
        color={slide.textColor}
      />

      <div
        style={{
          position: 'absolute',
          top: headerH,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {slide.sections.map((section, i) => (
          <div
            key={i}
            style={{
              width: cellW,
              height: cellH,
              backgroundColor: section.backgroundColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {section.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={section.image}
                alt=""
                style={{ maxWidth: '65%', maxHeight: '65%', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  width: '40%',
                  height: '40%',
                  border: '2px dashed rgba(128,128,128,0.3)',
                  borderRadius: 6,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
