interface SlideHeaderProps {
  left: string
  right: string
  color: string
}

export function SlideHeader({ left, right, color }: SlideHeaderProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 56px',
        color,
        fontSize: 13,
        letterSpacing: '0.04em',
        fontWeight: 500,
        zIndex: 10,
      }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  )
}
