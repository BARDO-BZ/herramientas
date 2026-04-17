import { SlideHeader } from '../SlideHeader'
import type { SimpleSlide2 as SimpleSlide2Type, Presentation } from '@/types/presentation'
import { SLIDE_W, SLIDE_H } from '../ScaledSlide'

interface Props {
  slide: SimpleSlide2Type
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

export function SimpleSlide2({ slide, presentation }: Props) {
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
          padding: '56px 80px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 80,
            width: '100%',
          }}
        >
          {slide.logos.map((logo) => (
            <div
              key={logo.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                flex: 1,
                maxWidth: 260,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 160,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {logo.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.image}
                    alt={logo.caption}
                    style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 160,
                      height: 80,
                      border: '2px dashed',
                      borderColor: slide.textColor,
                      opacity: 0.2,
                      borderRadius: 6,
                    }}
                  />
                )}
              </div>
              {logo.caption && (
                <span style={{ fontSize: 14, opacity: 0.6, textAlign: 'center' }}>
                  {logo.caption}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
