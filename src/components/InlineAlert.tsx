import React from 'react'
import tokens from '../tokens/designTokens'

export const InlineAlert: React.FC<{ message?: string; onRetry?: () => void; autoFocus?: boolean }> = ({ message = 'Something went wrong starting onboarding.', onRetry, autoFocus = false }) => {
  const style: React.CSSProperties = {
    background: '#FFF4E5',
    color: '#6A3F00',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    boxShadow: tokens.shadow.elevation1
  }

  const buttonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: tokens.color.primary,
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '6px 8px'
  }

  const retryRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    if (autoFocus && retryRef.current) {
      retryRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div role="alert" aria-live="assertive" style={style}>
      <div style={{ flex: 1 }}>{message}</div>
      {onRetry && (
        <button ref={retryRef} onClick={onRetry} style={buttonStyle}>
          Retry
        </button>
      )}
    </div>
  )
}

export default InlineAlert
