import { SlideHeader } from '../SlideHeader'
import type { SimpleSlide as SimpleSlideType, Presentation } from '@/types/presentation'
import { SLIDE_W, SLIDE_H } from '../ScaledSlide'

interface Props {
  slide: SimpleSlideType
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

export function SimpleSlide({ slide, presentation }: Props) {
  const imgPx = (SLIDE_W * slide.imageSize) / 100

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
      {slide.backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.backgroundImage}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      <SlideHeader
        left={presentation.headerLeft}
        right={presentation.headerRight}
        color={slide.textColor}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {slide.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.image}
            alt="Logo"
            style={{ width: imgPx, maxHeight: SLIDE_H * 0.7, objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: imgPx,
              height: imgPx * 0.5,
              border: '2px dashed',
              borderColor: slide.textColor,
              opacity: 0.2,
              borderRadius: 8,
            }}
          />
        )}
      </div>
    </div>
  )
}
