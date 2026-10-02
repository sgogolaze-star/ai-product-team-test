import React, { useEffect, useRef, useState } from 'react'
import './App.css'

type SSOProvider = { id: string; name: string; icon?: string; redirectUrl: string; type?: string }

// Lightweight mock API layer for demo purposes
async function api<T = any>(path: string, opts?: RequestInit): Promise<{ status: number; body: T }> {
  await new Promise((r) => setTimeout(r, 700)) // simulate latency
  if (path === '/auth/sso/providers' && (!opts || opts.method === 'GET')) {
    const providers: SSOProvider[] = [
      { id: 'google', name: 'Google', icon: '', redirectUrl: '/sso/redirect?provider=Google', type: 'oauth' },
      { id: 'okta', name: 'Okta', icon: '', redirectUrl: '/sso/redirect?provider=Okta', type: 'saml' },
      { id: 'samlcorp', name: 'Acme SAML', icon: '', redirectUrl: '/sso/redirect?provider=Acme', type: 'saml' }
    ]
    return { status: 200, body: providers as any }
  }

  if (path === '/auth/login' && opts?.method === 'POST') {
    // Robustly handle different body types: prefer string, fall back to JSON serialization
    let bodyText = '{}'
    try {
      if (typeof opts.body === 'string') {
        bodyText = opts.body
      } else if (opts.body instanceof URLSearchParams) {
        bodyText = opts.body.toString()
      } else if (opts.body instanceof Blob) {
        // Blob can't be synchronously read easily in this mock; attempt toString
        bodyText = (opts.body as any).toString() || '{}'
      } else if (opts.body) {
        try {
          bodyText = JSON.stringify(opts.body)
        } catch {
          bodyText = (opts.body as any).toString() || '{}'
        }
      }
    } catch {
      bodyText = '{}'
    }

    let parsed: any = {}
    try {
      parsed = JSON.parse(bodyText)
    } catch {
      parsed = {}
    }
    const { email, password } = parsed
    // simple validation
    const fieldErrors: Record<string, string> = {}
    if (!email) fieldErrors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = 'Enter a valid email.'
    if (!password) fieldErrors.password = 'Password is required.'
    if (Object.keys(fieldErrors).length) {
      return { status: 400, body: { fieldErrors, formErrors: ['Please fix the errors below.'] } as any }
    }

    // success only for a known test account
    if (email === 'user@example.com' && password === 'password') {
      // server would set cookie; here we just return redirect
      return { status: 200, body: { redirect: '/dashboard' } as any }
    }

    return {
      status: 401,
      body: { formErrors: ['Invalid email or password.'], fieldErrors: {} } as any
    }
  }

  if (path === '/auth/password-reset' && opts?.method === 'POST') {
    // Always return 200 to avoid account enumeration
    return { status: 200, body: { message: 'If an account exists, password reset instructions have been sent.' } as any }
  }

  return { status: 404, body: {} as any }
}

function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="visually-hidden">{children}</span>
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    handler()
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler)
    }
  }, [])
  return reduced
}

export default function App(): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [providers, setProviders] = useState<SSOProvider[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotState, setForgotState] = useState<'idle' | 'loading' | 'success'>('idle')
  const errorSummaryRef = useRef<HTMLDivElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const forgotTriggerRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const hasMounted = useRef(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    let mounted = true
    api<SSOProvider[]>('/auth/sso/providers')
      .then((r) => {
        if (mounted && r.status === 200) setProviders(r.body)
      })
      .catch(() => {})
    hasMounted.current = true
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => {
        // redirect to dashboard in 1.5s
        window.location.assign('/dashboard')
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [successToast])

  useEffect(() => {
    if (formErrors.length && errorSummaryRef.current) {
      errorSummaryRef.current.focus()
    }
  }, [formErrors])

  function resetErrors() {
    setFormErrors([])
    setFieldErrors({})
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (loading) return
    resetErrors()
    // client-side validation
    const clientFieldErrors: Record<string, string> = {}
    if (!email) clientFieldErrors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) clientFieldErrors.email = 'Enter a valid email.'
    if (!password) clientFieldErrors.password = 'Password is required.'
    if (Object.keys(clientFieldErrors).length) {
      setFieldErrors(clientFieldErrors)
      setFormErrors(['Please fix the errors below.'])
      return
    }

    setLoading(true)
    try {
      const body = JSON.stringify({ email, password, remember })
      const res = await api('/auth/login', { method: 'POST', body })
      if (res.status === 200) {
        setSuccessToast('Signed in successfully. Redirecting…')
        // clear sensitive state
        setPassword('')
        // server is expected to set HttpOnly cookie
        return
      }
      const bodyJson: any = res.body
      if (res.status === 400 || res.status === 401) {
        setFieldErrors(bodyJson.fieldErrors || {})
        setFormErrors(bodyJson.formErrors || ['Sign in failed.'])
      } else {
        setFormErrors(['Unexpected server error. Please try again.'])
      }
    } catch (err) {
      setFormErrors(['Network error. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  function handleSSO(provider: SSOProvider) {
    if (loading) return
    setToast(`Redirecting to ${provider.name}…`)
    // slight delay to show toast then navigate
    setTimeout(() => {
      // simulate redirect
      try {
        window.location.assign(provider.redirectUrl)
      } catch {
        setToast(null)
        setFormErrors([`Failed to redirect to ${provider.name}.`])
      }
    }, reducedMotion ? 10 : 600)
  }

  // close forgot modal and restore focus
  function closeForgot() {
    setForgotOpen(false)
    // restore focus to trigger
    setTimeout(() => {
      forgotTriggerRef.current?.focus()
    }, 0)
  }

  // Forgot password modal focus trap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!forgotOpen) return
      if (e.key === 'Escape') {
        closeForgot()
        return
      }
      if (e.key !== 'Tab') return
      const container = modalRef.current
      if (!container) return
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!document.activeElement) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [forgotOpen])

  useEffect(() => {
    if (forgotOpen) {
      setTimeout(() => {
        const h = document.getElementById('forgot-heading')
        h?.focus()
      }, 0)
    }
  }, [forgotOpen])

  async function submitForgot(e?: React.FormEvent) {
    e?.preventDefault()
    setForgotState('loading')
    try {
      await api('/auth/password-reset', { method: 'POST', body: JSON.stringify({ email: forgotEmail }) })
      setForgotState('success')
      // focus confirmation
      setTimeout(() => {
        const el = document.getElementById('forgot-confirm')
        el?.focus()
      }, 0)
    } catch {
      setForgotState('idle')
    }
  }

  return (
    <div className="page-root" style={{ padding: 'env(safe-area-inset-top) 16px env(safe-area-inset-bottom)' }}>
      <main className="center-wrap" aria-labelledby="product-heading">
        <header className="brand">
          <img src="/logo192.png" alt="" aria-hidden="true" className="brand-logo" />
          <h1 id="product-heading" className="brand-title">
            Acme Platform
          </h1>
          <span className="brand-sub">Secure B2B SaaS</span>
        </header>

        <div className="auth-card" role="form" aria-labelledby="signin-heading">
          <h2 id="signin-heading" className="card-heading">
            Sign in to your account
          </h2>

          {formErrors.length > 0 && (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              role="alert"
              aria-live="assertive"
              aria-labelledby="error-summary-heading"
              className="error-summary"
            >
              <strong id="error-summary-heading">There was a problem</strong>
              <ul>
                {formErrors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="input-row">
                <input
                  id="email"
                  name="email"
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <span className="field-icon" aria-hidden>
                  @
                </span>
              </div>
              {fieldErrors.email && (
                <div id="email-error" className="field-error">
                  {fieldErrors.email}
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="input-row">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  className={`input ${fieldErrors.password ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((s) => !s)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.password && (
                <div id="password-error" className="field-error">
                  {fieldErrors.password}
                </div>
              )}
            </div>

            <div className="row between">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="link-button"
                onClick={() => setForgotOpen(true)}
                disabled={loading}
                ref={forgotTriggerRef}
              >
                Forgot password?
              </button>
            </div>

            <div className="field">
              <button
                type="submit"
                className="primary"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden></span>
                    <span>Signing in…</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="alt">
            <div className="divider">or continue with</div>
            <div className="sso-list" role="list">
              {providers.map((p) => (
                <button
                  key={p.id}
                  className="sso-btn"
                  onClick={() => handleSSO(p)}
                  disabled={loading}
                  aria-label={`Sign in with ${p.name}`}
                  role="listitem"
                >
                  <span className="sso-icon" aria-hidden>
                    {p.name[0]}
                  </span>
                  <span className="sso-label">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <footer className="card-foot">
            <small>
              By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </small>
            <div>
              <a href="#" className="enterprise">Enterprise SSO</a>
            </div>
          </footer>
        </div>

        {/* Toasts */}
        <div aria-live="polite" className="toast-region">
          {toast && <div className="toast" role="status">{toast}</div>}
          {successToast && <div className="toast success" role="status">{successToast}</div>}
        </div>

        {/* Forgot Password Modal */}
        {forgotOpen && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="forgot-heading">
            <div className="modal" ref={modalRef}>
              <h3 id="forgot-heading" tabIndex={-1} className="modal-heading">
                Forgot your password
              </h3>
              {forgotState !== 'success' ? (
                <form onSubmit={submitForgot}>
                  <p className="modal-desc">Enter your account email and we'll send reset instructions.</p>
                  <label className="label" htmlFor="forgot-email">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="input"
                    disabled={forgotState === 'loading'}
                  />
                  <div className="row">
                    <button type="submit" className="primary" disabled={forgotState === 'loading'}>
                      {forgotState === 'loading' ? 'Sending…' : 'Send reset email'}
                    </button>
                    <button type="button" className="secondary" onClick={closeForgot}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div id="forgot-confirm" tabIndex={-1} className="modal-confirm">
                  If an account exists, we have sent password reset instructions. Check your email.
                  <div className="row" style={{ marginTop: 12 }}>
                    <button className="primary" onClick={closeForgot}>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
