import { SlideHeader } from '../SlideHeader'
import type { BackgroundImageSlide as BackgroundImageSlideType, Presentation } from '@/types/presentation'
import { SLIDE_W, SLIDE_H } from '../ScaledSlide'

interface Props {
  slide: BackgroundImageSlideType
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

export function BackgroundImageSlide({ slide, presentation }: Props) {
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
      {slide.backgroundImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.backgroundImage}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              border: '2px dashed rgba(128,128,128,0.3)',
              borderRadius: 12,
              padding: '32px 64px',
              color: 'rgba(128,128,128,0.5)',
              fontSize: 18,
            }}
          >
            Subí una imagen de fondo
          </div>
        </div>
      )}

      <SlideHeader
        left={presentation.headerLeft}
        right={presentation.headerRight}
        color={slide.textColor}
      />

      {(slide.title || slide.subtitle) && (
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            left: 56,
            right: 56,
          }}
        >
          {slide.title && (
            <h2
              style={{
                fontSize: 72,
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {slide.title}
            </h2>
          )}
          {slide.subtitle && (
            <p style={{ margin: '12px 0 0', fontSize: 22, opacity: 0.8 }}>{slide.subtitle}</p>
          )}
        </div>
      )}
    </div>
  )
}
