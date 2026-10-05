export type OnboardingEventArgs = { userId?: string; source?: string }

export async function postEventOnboardingStart({ userId, source = 'empty_state' }: OnboardingEventArgs) {
  const payload = { event: 'onboarding_start', userId, source }
  const url = '/events'

  const attempt = async () => {
    try {
      const controller = new AbortController()
      const signal = controller.signal
      const timer = setTimeout(() => controller.abort(), 5000)
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal
        })
        clearTimeout(timer)
        if (!res.ok) {
          let bodyText = ''
          try { bodyText = await res.text() } catch {} // ignore
          throw { code: 'http_error', message: `HTTP ${res.status} ${res.statusText}: ${bodyText}` }
        }
        return await res.json().catch(() => ({}))
      } catch (err: any) {
        clearTimeout(timer)
        if (err && err.name === 'AbortError') {
          throw { code: 'timeout', message: 'Request timed out' }
        }
        // rethrow network errors as structured
        throw { code: 'network_error', message: err?.message ?? 'Network failure' }
      }
    } catch (err) {
      throw err
    }
  }

  try {
    return await attempt()
  } catch (firstErr) {
    // single retry on network error or timeout
    if (firstErr && (firstErr.code === 'network_error' || firstErr.code === 'timeout')) {
      try {
        return await attempt()
      } catch (secondErr) {
        throw secondErr
      }
    }
    throw firstErr
  }
}
