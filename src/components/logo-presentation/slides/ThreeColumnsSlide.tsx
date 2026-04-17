import { SlideHeader } from '../SlideHeader'
import type { ThreeColumnsSlide as ThreeColumnsSlideType, Presentation } from '@/types/presentation'
import { SLIDE_W, SLIDE_H } from '../ScaledSlide'

interface Props {
  slide: ThreeColumnsSlideType
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

export function ThreeColumnsSlide({ slide, presentation }: Props) {
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
          padding: '48px 56px 64px',
          gap: 40,
        }}
      >
        {slide.columns.map((col, ci) => (
          <div
            key={ci}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            {col.items.length === 0 && (
              <div
                style={{
                  width: '80%',
                  height: 120,
                  border: '2px dashed',
                  borderColor: slide.textColor,
                  opacity: 0.15,
                  borderRadius: 6,
                }}
              />
            )}
            {col.items.map((item) =>
              item.kind === 'image' ? (
                item.content ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={item.id}
                    src={item.content}
                    alt=""
                    style={{
                      maxWidth: `${item.imageSize}%`,
                      maxHeight: 200,
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <div
                    key={item.id}
                    style={{
                      width: `${item.imageSize}%`,
                      height: 100,
                      border: '2px dashed',
                      borderColor: slide.textColor,
                      opacity: 0.2,
                      borderRadius: 6,
                    }}
                  />
                )
              ) : (
                <p
                  key={item.id}
                  style={{ margin: 0, fontSize: 18, lineHeight: 1.6, textAlign: 'center', opacity: 0.85 }}
                >
                  {item.content}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
