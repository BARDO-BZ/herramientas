import { SlideHeader } from '../SlideHeader'
import type { IndexSlide as IndexSlideType, Presentation } from '@/types/presentation'
import { SLIDE_W, SLIDE_H } from '../ScaledSlide'

interface Props {
  slide: IndexSlideType
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

export function IndexSlide({ slide, presentation }: Props) {
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
          top: 56,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          padding: '64px 56px 72px',
          gap: 48,
        }}
      >
        {/* Left column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {slide.versionText && (
              <span
                style={{
                  position: 'absolute',
                  top: -20,
                  left: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  opacity: 0.5,
                  letterSpacing: '0.05em',
                }}
              >
                {slide.versionText}
              </span>
            )}
            <h2
              style={{
                fontSize: 72,
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              {slide.title}
            </h2>
          </div>
        </div>

        {/* Right column */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: 12,
            paddingBottom: 8,
          }}
        >
          {slide.paragraphs.map((p, i) => (
            <p key={i} style={{ margin: 0, fontSize: 20, lineHeight: 1.6, opacity: 0.8 }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
