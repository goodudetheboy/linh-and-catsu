interface WashiTapeProps {
  color?: string
  width?: number | string
  angle?: number
  style?: React.CSSProperties
  className?: string
}

export function WashiTape({
  color = '#f9c6d0',
  width = 80,
  angle = -3,
  style,
  className = '',
}: WashiTapeProps) {
  return (
    <div
      className={`washi ${className}`}
      style={{
        backgroundColor: color,
        width: typeof width === 'number' ? `${width}px` : width,
        transform: `rotate(${angle}deg)`,
        ...style,
      }}
    />
  )
}
