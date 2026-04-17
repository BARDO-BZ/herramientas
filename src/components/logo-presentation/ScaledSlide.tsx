'use client'

import { useEffect, useRef, useState } from 'react'

export const SLIDE_W = 1280
export const SLIDE_H = 720

interface ScaledSlideProps {
  children: React.ReactNode
  className?: string
}

export function ScaledSlide({ children, className = '' }: ScaledSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / SLIDE_W)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}
    >
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
