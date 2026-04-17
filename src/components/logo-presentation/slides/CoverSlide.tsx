import { SlideHeader } from '../SlideHeader'
import type { CoverSlide as CoverSlideType, Presentation } from '@/types/presentation'
import { SLIDE_W, SLIDE_H } from '../ScaledSlide'

interface Props {
  slide: CoverSlideType
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

export function CoverSlide({ slide, presentation }: Props) {
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
          bottom: 72,
          left: 56,
          right: 56,
        }}
      >
        <h1
          style={{
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: '-0.02em',
            maxWidth: '70%',
          }}
        >
          {slide.title}
        </h1>
      </div>
    </div>
  )
}
