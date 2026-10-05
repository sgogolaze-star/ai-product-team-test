import React from 'react'

type IconWrapperProps = {
  size?: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ children, size = 16, className, style }) => {
  const dimension = typeof size === 'number' ? `${size}px` : size
  const mergedStyle: React.CSSProperties = {
    display: 'inline-flex',
    width: dimension,
    height: dimension,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0,
    ...style
  }
  // ensure decorative icons remain aria-hidden
  return (
    <span aria-hidden="true" className={className} style={mergedStyle}>
      {children}
    </span>
  )
}

export const ChevronRight: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default ChevronRight
