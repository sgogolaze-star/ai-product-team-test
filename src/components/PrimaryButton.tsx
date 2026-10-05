import React from 'react'
import tokens from '../tokens/designTokens'
import { IconWrapper, ChevronRight } from './IconWrapper'

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  children: React.ReactNode
}

function darkenHex(hex: string, percent: number) {
  // expects #rrggbb
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const amt = Math.round(255 * (percent / 100))
  const nr = Math.max(0, Math.min(255, r - amt))
  const ng = Math.max(0, Math.min(255, g - amt))
  const nb = Math.max(0, Math.min(255, b - amt))
  return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ loading = false, children, disabled, style, ...rest }) => {
  const isDisabled = disabled || loading
  const [isFocused, setFocused] = React.useState(false)
  const [isHover, setHover] = React.useState(false)
  const [isPressed, setPressed] = React.useState(false)
  const [rippleKey, setRippleKey] = React.useState<number | null>(null)
  const prefersReducedMotion = React.useRef(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  const baseShadow = tokens.shadow.elevation1
  const hoverShadow = '0 10px 26px rgba(3,15,40,0.12)'

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: tokens.sizes.buttonMinWidth,
    height: tokens.sizes.buttonHeight,
    padding: '0 20px',
    borderRadius: '8px',
    background: tokens.color.primary,
    color: tokens.color.onPrimary,
    border: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    boxShadow: baseShadow,
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: 1,
    outline: 'none',
    overflow: 'visible',
    WebkitTapHighlightColor: 'transparent',
    transition: prefersReducedMotion.current ? 'none' : 'transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease'
  }

  const focusRing = `0 0 0 3px ${tokens.color.focus}`

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...(isHover && !isDisabled ? { boxShadow: hoverShadow } : {}),
    ...(isFocused ? { boxShadow: `${isHover && !isDisabled ? hoverShadow : baseShadow}, ${focusRing}` } : {}),
    transform: isPressed && !prefersReducedMotion.current ? 'scale(0.98)' : 'none',
    ...(isHover && !isDisabled ? { background: darkenHex(tokens.color.primary, 6) } : {})
  }

  // aria-label handling: when loading, reflect visible text
  const ariaLabel = loading ? 'Starting…' : (rest['aria-label'] as string | undefined)

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isDisabled) return
    setPressed(true)
    // ripple effect: quick fade in and out
    if (!prefersReducedMotion.current) {
      setRippleKey(Date.now())
      window.setTimeout(() => setRippleKey(null), 260)
    }
    (e.currentTarget as HTMLButtonElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isDisabled) return
    setPressed(false)
    try { (e.currentTarget as HTMLButtonElement).releasePointerCapture?.(e.pointerId) } catch {}
  }

  const ripple = rippleKey !== null ? (
    <span
      key={rippleKey}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.12)',
        opacity: 1,
        pointerEvents: 'none',
        transform: prefersReducedMotion.current ? 'none' : 'scale(1.02)',
        transition: prefersReducedMotion.current ? 'opacity 50ms linear' : 'opacity 200ms ease, transform 200ms ease'
      }}
    />
  ) : null

  return (
    <button
      {...rest}
      type={(rest as any).type || 'button'}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={ariaLabel}
      style={{ ...combinedStyle, ...style }}
      onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e) }}
      onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e) }}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter && rest.onMouseEnter(e) }}
      onMouseLeave={(e) => { setHover(false); setPressed(false); rest.onMouseLeave && rest.onMouseLeave(e) }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setPressed(false)}
      onKeyDown={(e) => {
        // support keyboard press visual on Space/Enter
        if ((e.key === ' ' || e.key === 'Enter') && !isDisabled) setPressed(true)
        rest.onKeyDown && rest.onKeyDown(e)
      }}
      onKeyUp={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !isDisabled) setPressed(false)
        rest.onKeyUp && rest.onKeyUp(e)
      }}
    >
      {ripple}
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span aria-hidden="true" style={{ display: 'inline-block' }}>
            <svg width="16" height="16" viewBox="0 0 50 50" aria-hidden="true" focusable="false">
              <circle cx="25" cy="25" r="20" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="none" />
              <path d="M45 25a20 20 0 0 0-20-20" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
              </path>
            </svg>
          </span>
          <span aria-live="polite">Starting…</span>
        </span>
      ) : (
        <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
          <span>{children}</span>
          <IconWrapper size={16}>
            <ChevronRight size={16} />
          </IconWrapper>
        </span>
      )}
    </button>
  )
}

export default PrimaryButton
