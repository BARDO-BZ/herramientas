import type { Slide, Presentation } from '@/types/presentation'
import { CoverSlide } from './slides/CoverSlide'
import { IndexSlide } from './slides/IndexSlide'
import { SimpleSlide } from './slides/SimpleSlide'
import { SimpleSlide2 } from './slides/SimpleSlide2'
import { VariantsSlide } from './slides/VariantsSlide'
import { ThreeColumnsSlide } from './slides/ThreeColumnsSlide'
import { BackgroundImageSlide } from './slides/BackgroundImageSlide'

interface Props {
  slide: Slide
  presentation: Pick<Presentation, 'headerLeft' | 'headerRight'>
}

export function SlideRenderer({ slide, presentation }: Props) {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide slide={slide} presentation={presentation} />
    case 'index':
      return <IndexSlide slide={slide} presentation={presentation} />
    case 'simple':
      return <SimpleSlide slide={slide} presentation={presentation} />
    case 'simple2':
      return <SimpleSlide2 slide={slide} presentation={presentation} />
    case 'variants':
      return <VariantsSlide slide={slide} presentation={presentation} />
    case 'three-columns':
      return <ThreeColumnsSlide slide={slide} presentation={presentation} />
    case 'background-image':
      return <BackgroundImageSlide slide={slide} presentation={presentation} />
  }
}
