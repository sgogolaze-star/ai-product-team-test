import { useState, useRef, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Final Preview Test state
  const [showPreview, setShowPreview] = useState(true)
  const [previewText, setPreviewText] = useState('This is a live preview')
  const [previewColor, setPreviewColor] = useState('light')

  const previewRef = useRef<HTMLDivElement | null>(null)
  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const [announcement, setAnnouncement] = useState('')

  // Manage focus and screen reader announcements when preview visibility changes
  useEffect(() => {
    if (showPreview) {
      setAnnouncement('Preview shown')
      // Move focus to the preview for keyboard users when it becomes visible
      previewRef.current?.focus()
    } else {
      setAnnouncement('Preview hidden')
      // Move focus back to the Show preview checkbox when preview is hidden
      checkboxRef.current?.focus()
    }
  }, [showPreview])

  const bgMap: Record<string, string> = {
    light: '#f7f7f7',
    yellow: '#fff9c4',
    cyan: '#e0f7fa',
    lavender: '#ede7f6',
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="Vite + React hero" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noopener noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noopener noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noopener noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>

      {/* Final Preview Test section - visible, accessible, interactive */}
      <section id="final-preview" aria-labelledby="final-preview-heading">
        <h2 id="final-preview-heading">Final Preview Test</h2>
        <p>
          Use the controls below to interact with the live preview. Changes are announced to assistive
          technologies and the preview receives focus when shown.
        </p>

        <div className="preview-controls" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <label htmlFor="show-preview" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <input
              id="show-preview"
              ref={checkboxRef}
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
            />
            Show preview
          </label>

          <label htmlFor="preview-text" style={{ display: 'inline-flex', flexDirection: 'column' }}>
            Preview text
            <input
              id="preview-text"
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Type preview text"
              aria-describedby="preview-text-help"
            />
            <small id="preview-text-help">Text shown inside the live preview region.</small>
          </label>

          <label htmlFor="preview-color" style={{ display: 'inline-flex', flexDirection: 'column' }}>
            Background
            <select
              id="preview-color"
              value={previewColor}
              onChange={(e) => setPreviewColor(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="yellow">Yellow</option>
              <option value="cyan">Cyan</option>
              <option value="lavender">Lavender</option>
            </select>
          </label>
        </div>

        {/* Offscreen live region for explicit show/hide announcements */}
        <div aria-live="polite" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
          {announcement}
        </div>

        {showPreview ? (
          <div
            ref={previewRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Live preview"
            style={{
              marginTop: '12px',
              padding: '16px',
              borderRadius: '6px',
              background: bgMap[previewColor] || bgMap.light,
              border: '1px solid rgba(0,0,0,0.08)',
              maxWidth: 'min(640px, 100%)',
            }}
          >
            <strong>Preview:</strong>
            <div style={{ marginTop: '8px' }}>{previewText || <em>No preview text</em>}</div>
          </div>
        ) : (
          <div style={{ marginTop: '12px' }} aria-hidden="true">
            <em>The preview is hidden.</em>
          </div>
        )}
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
