import React from 'react'
import styles from './EmptyStateCard.module.css'
import tokens from '../tokens/designTokens'
import PrimaryButton from './PrimaryButton'
import InlineAlert from './InlineAlert'
import hero from '../assets/hero.png'
import { postEventOnboardingStart } from '../api/analytics'

type Props = {
  userId?: string
  onNavigate?: () => void
  compact?: boolean
  showIllustration?: boolean
}

export const EmptyStateCard: React.FC<Props> = ({ userId, onNavigate, compact = false, showIllustration = true }) => {
  const [mounted, setMounted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<{ code?: string; message?: string } | null>(null)

  React.useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // avoid even brief translate for reduced motion
      setMounted(true)
      return
    }
    const t = setTimeout(() => setMounted(true), 10)
    return () => clearTimeout(t)
  }, [])

  const startOnboarding = React.useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      await postEventOnboardingStart({ userId })
      // navigate after analytics resolves
      if (typeof onNavigate === 'function') {
        onNavigate()
      } else {
        window.location.assign('/onboarding')
      }
    } catch (err: any) {
      setError({ code: err?.code, message: err?.message || 'Failed to start onboarding' })
    } finally {
      setLoading(false)
    }
  }, [userId, onNavigate])

  const retry = React.useCallback(() => {
    startOnboarding()
  }, [startOnboarding])

  // inline CSS vars from tokens to make them available in CSS module
  const cssVars: React.CSSProperties = {
    ['--color-surface' as any]: tokens.color.surface,
    ['--color-text' as any]: tokens.color.textPrimary,
    ['--color-text-secondary' as any]: tokens.color.textSecondary,
    ['--radius' as any]: tokens.radius.radius2,
    ['--shadow' as any]: tokens.shadow.elevation1
  }

  return (
    <div className={styles.container} style={cssVars} role="region" aria-label="Empty state: no items yet">
      <div className={`${styles.card} ${mounted ? styles.mounted : ''}`.trim()}>
        {showIllustration && (
          <div className={styles.illustrationWrap} aria-hidden="true">
            <img src={hero} alt="" loading="lazy" className={styles.illustration} width={220} height={160} />
          </div>
        )}
        <div className={styles.content}>
          <h2 className={styles.headline}>Welcome — let's get you started</h2>
          <p className={styles.helper}>Create your first item to begin exploring features. It only takes a minute and we'll guide you through initial setup.</p>
          <div className={styles.actions}>
            {error && <InlineAlert message={error.message} onRetry={retry} autoFocus />}
            <PrimaryButton loading={loading} onClick={() => startOnboarding()}>
              Get started
            </PrimaryButton>
            <a className={styles.tertiary} href="/learn-more" target="_blank" rel="noopener noreferrer">Learn more</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyStateCard
