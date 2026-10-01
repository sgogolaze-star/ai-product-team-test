import { useState, useRef } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Final Preview Test states
  const [previewText, setPreviewText] = useState('Type to preview')
  const [fontSize, setFontSize] = useState(20)
  const [isBold, setIsBold] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const resetPreview = () => {
    setPreviewText('Type to preview')
    setFontSize(20)
    setIsBold(false)
    setAnnouncement('Preview reset')
    // return focus to the text input for quick keyboard access
    inputRef.current?.focus()
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="Decorative hero" />
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
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
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
              <a href="https://github.com/vitejs/vite" target="_blank">
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
              <a href="https://chat.vite.dev/" target="_blank">
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
              <a href="https://x.com/vite_js" target="_blank">
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
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
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

      {/* Final Preview Test: visible, interactive, and accessible */}
      <section id="final-preview" aria-labelledby="final-preview-heading">
        <h2 id="final-preview-heading">Final Preview Test</h2>

        <form
          onSubmit={(e) => {
            // prevent form submission so pressing Enter doesn't reload
            e.preventDefault()
            setAnnouncement('Preview updated')
          }}
          aria-describedby="final-preview-desc"
        >
          <p id="final-preview-desc">Use the controls below to change the preview. Changes are announced.</p>

          <div>
            <label htmlFor="preview-input">Preview text</label>
            <input
              id="preview-input"
              ref={inputRef}
              type="text"
              value={previewText}
              onChange={(e) => {
                setPreviewText(e.target.value)
                setAnnouncement(`Preview text set to ${e.target.value || 'empty'}`)
              }}
            />
          </div>

          <div>
            <label htmlFor="font-size">Font size: {fontSize}px</label>
            <input
              id="font-size"
              type="range"
              min={12}
              max={48}
              value={fontSize}
              aria-valuemin={12}
              aria-valuemax={48}
              aria-valuenow={fontSize}
              onChange={(e) => {
                const val = Number(e.target.value)
                setFontSize(val)
                setAnnouncement(`Font size ${val} pixels`)
              }}
            />
          </div>

          <div>
            <label htmlFor="bold-toggle">
              <input
                id="bold-toggle"
                type="checkbox"
                checked={isBold}
                onChange={(e) => {
                  setIsBold(e.target.checked)
                  setAnnouncement(e.target.checked ? 'Bold enabled' : 'Bold disabled')
                }}
              />
              Bold
            </label>
          </div>

          <div>
            <button type="button" onClick={resetPreview} aria-label="Reset preview">
              Reset
            </button>
          </div>
        </form>

        <div
          role="region"
          aria-atomic="true"
          style={{
            border: '1px solid #ccc',
            padding: '12px',
            marginTop: '12px',
            minHeight: '48px',
          }}
        >
          <p
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: isBold ? '700' : '400',
              margin: 0,
            }}
          >
            {previewText}
          </p>
        </div>

        {/* Single live region for announcements (screen reader friendly) */}
        <div id="final-preview-announcement" aria-live="polite" aria-atomic="true" style={{marginTop: '8px'}}>
          {announcement}
        </div>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
