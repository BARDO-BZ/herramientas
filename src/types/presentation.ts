export type SlideType =
  | 'cover'
  | 'index'
  | 'simple'
  | 'simple2'
  | 'variants'
  | 'three-columns'
  | 'background-image'

export interface BaseSlide {
  id: string
  type: SlideType
  backgroundColor: string
  textColor: string
  backgroundImage?: string
}

export interface CoverSlide extends BaseSlide {
  type: 'cover'
  title: string
}

export interface IndexSlide extends BaseSlide {
  type: 'index'
  title: string
  versionText: string
  paragraphs: string[]
}

export interface SimpleSlide extends BaseSlide {
  type: 'simple'
  image: string
  imageSize: number
}

export interface LogoItem {
  id: string
  image: string
  caption: string
}

export interface SimpleSlide2 extends BaseSlide {
  type: 'simple2'
  logos: LogoItem[]
}

export interface VariantSection {
  backgroundColor: string
  image: string
}

export interface VariantsSlide extends BaseSlide {
  type: 'variants'
  divisions: 2 | 3 | 4 | 6 | 9
  sections: VariantSection[]
}

export interface ColumnItem {
  id: string
  kind: 'image' | 'text'
  content: string
  imageSize: number
}

export interface ThreeColumnsSlide extends BaseSlide {
  type: 'three-columns'
  columns: [{ items: ColumnItem[] }, { items: ColumnItem[] }, { items: ColumnItem[] }]
}

export interface BackgroundImageSlide extends BaseSlide {
  type: 'background-image'
  title: string
  subtitle: string
}

export type Slide =
  | CoverSlide
  | IndexSlide
  | SimpleSlide
  | SimpleSlide2
  | VariantsSlide
  | ThreeColumnsSlide
  | BackgroundImageSlide

export interface Presentation {
  id: string
  slug: string
  name: string
  headerLeft: string
  headerRight: string
  folderId?: string
  slides: Slide[]
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: string
  name: string
  createdAt: string
}

export interface Comment {
  id: string
  slideId: string
  author: string
  text: string
  x: number
  y: number
  createdAt: string
}
