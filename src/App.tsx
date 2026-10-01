import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

type TaskRequest = {
  prTitle?: string
  prBody?: string
  repoOwner?: string
  repoName?: string
  previewBranch?: string
}

type ApiResponseSuccess = {
  ok: true
  prUrl?: string
  previewUrl?: string
}

type ApiResponseError = {
  ok: false
  status?: number
  message: string
}

type ApiResponse = ApiResponseSuccess | ApiResponseError

function App() {
  const [prTitle, setPrTitle] = useState('')
  const [prBody, setPrBody] = useState('')
  const [repoOwner, setRepoOwner] = useState('')
  const [repoName, setRepoName] = useState('')
  const [previewBranch, setPreviewBranch] = useState('preview-branch')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPrUrl(null)
    setPreviewUrl(null)

    const payload: TaskRequest = {
      prTitle: prTitle || undefined,
      prBody: prBody || undefined,
      repoOwner: repoOwner || undefined,
      repoName: repoName || undefined,
      previewBranch: previewBranch || undefined,
    }

    setLoading(true)
    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let parsed: ApiResponse
      try {
        parsed = (await res.json()) as ApiResponse
      } catch (e) {
        setError('Server returned an unexpected non-JSON response')
        return
      }

      if (!parsed.ok) {
        setError(parsed.message || 'An unknown error occurred')
        return
      }

      // Success
      if (parsed.prUrl) setPrUrl(parsed.prUrl)
      if (parsed.previewUrl) setPreviewUrl(parsed.previewUrl)
    } catch (e) {
      setError('Network error: failed to reach the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="hero" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>AI Team Console</h1>
          <p>Send a task to your n8n workflow to create a preview and PR.</p>
        </div>
      </section>

      <div className="ticks"></div>

      <main id="console" aria-labelledby="console-heading">
        <h2 id="console-heading">Create preview & PR</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Repository owner
            <input
              type="text"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              placeholder="org-or-user"
              required
            />
          </label>

          <label>
            Repository name
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="repo-name"
              required
            />
          </label>

          <label>
            Preview branch
            <input
              type="text"
              value={previewBranch}
              onChange={(e) => setPreviewBranch(e.target.value)}
              placeholder="preview-branch"
              required
            />
          </label>

          <label>
            PR title
            <input
              type="text"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              placeholder="Add preview for feature X"
              required
            />
          </label>

          <label>
            PR body (optional)
            <textarea
              value={prBody}
              onChange={(e) => setPrBody(e.target.value)}
              placeholder="Describe the changes..."
              rows={4}
            />
          </label>

          <div className="actions">
            <button type="submit" disabled={loading} aria-disabled={loading}>
              {loading ? 'Creating…' : 'Create preview & PR'}
            </button>
          </div>
        </form>

        <div aria-live="polite" className="result">
          {error && (
            <div role="alert" className="error">
              Error: {error}
            </div>
          )}

          {prUrl && (
            <div className="success">
              <strong>Pull Request:</strong>{' '}
              <a href={prUrl} target="_blank" rel="noopener noreferrer">
                {prUrl}
              </a>
            </div>
          )}

          {previewUrl && (
            <div className="success">
              <strong>Preview:</strong>{' '}
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                {previewUrl}
              </a>
            </div>
          )}
        </div>
      </main>

      <div className="ticks"></div>
      <section id="spacer" />
    </>
  )
}

export default App
