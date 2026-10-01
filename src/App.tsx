import { useState, useRef } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // States for the Final Preview Test section
  const [previewText, setPreviewText] = useState('Hello, preview!')
  const [bgColor, setBgColor] = useState('#ffffff')
  const previewRef = useRef<HTMLDivElement | null>(null)

  function resetPreview() {
    setPreviewText('Hello, preview!')
    setBgColor('#ffffff')
    // return focus to the preview for keyboard users after reset
    previewRef.current?.focus()
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
                <img className="logo" src={viteLogo} alt="Vite logo" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="React logo" />
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

      {/* Final Preview Test section added per task */}
      <section id="final-preview-test" aria-labelledby="final-preview-heading">
        <h2 id="final-preview-heading">Final Preview Test</h2>
        <p>
          This section lets you type a short message and pick a background color to preview. Changes are reflected immediately and announced to assistive
          technologies.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          aria-describedby="final-preview-desc"
        >
          <div id="final-preview-desc" className="sr-only">
            Type text into the input and choose a color; the preview updates live.
          </div>

          <label htmlFor="preview-input">Preview text</label>
          <input
            id="preview-input"
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            aria-label="Preview text input"
            placeholder="Type something to preview"
          />

          <label htmlFor="preview-color">Background color</label>
          <input
            id="preview-color"
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            aria-label="Preview background color"
          />

          <button type="button" onClick={resetPreview} aria-label="Reset preview">
            Reset
          </button>
        </form>

        <div
          ref={previewRef}
          tabIndex={0}
          role="region"
          aria-live="polite"
          aria-label="Live preview"
          className="final-preview-box"
          style={{
            marginTop: '12px',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            backgroundColor: bgColor,
          }}
        >
          {previewText || 'Preview is empty'}
        </div>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
