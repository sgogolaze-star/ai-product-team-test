import { useState, useEffect, useRef, ChangeEvent } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Accessible demo state
  const [demoActive, setDemoActive] = useState(false)
  const [demoText, setDemoText] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Focus the input when the demo is activated
  useEffect(() => {
    if (demoActive) {
      inputRef.current?.focus()
    }
  }, [demoActive])

  // Keyboard shortcut: press "t" to toggle the demo, unless typing in a form control
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const active = document.activeElement as Element | null
      const activeTag = active?.tagName ?? ''
      const isFormElement =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        (active instanceof HTMLInputElement) ||
        (active instanceof HTMLTextAreaElement) ||
        (active instanceof HTMLSelectElement) ||
        (active as HTMLElement)?.isContentEditable

      if (isFormElement) return

      // Toggle demo with "t" or "T"
      if (e.key === 't' || e.key === 'T') {
        setDemoActive((v) => !v)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setDemoText(e.target.value)
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
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

      {/* Small accessible demo section */}
      <section
        id="accessible-demo"
        role="region"
        aria-labelledby="demo-title"
        className="demo-section"
      >
        <h2 id="demo-title">Accessible demo</h2>
        <p id="demo-desc">
          A small interactive demo. You can toggle this demo with the button below or press the
          "t" key (when not typing). When enabled, enter text to see it announced in a live region.
        </p>

        <div className="demo-controls">
          <button
            type="button"
            aria-pressed={demoActive}
            aria-expanded={demoActive}
            aria-controls="demo-panel"
            aria-describedby="demo-desc"
            onClick={() => setDemoActive((v) => !v)}
            className="demo-toggle"
          >
            {demoActive ? 'Disable demo' : 'Enable demo'}
          </button>

          <span className="demo-state" aria-live="polite" style={{ marginLeft: '0.5rem' }}>
            {demoActive ? 'Demo is active' : 'Demo is inactive'}
          </span>
        </div>

        {demoActive && (
          <div
            id="demo-panel"
            className="demo-panel"
            aria-labelledby="demo-panel-title"
            style={{ marginTop: '0.75rem' }}
          >
            <h3 id="demo-panel-title">Live preview</h3>

            <label htmlFor="demo-input">Type something to preview:</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 8 }}>
              <input
                id="demo-input"
                ref={inputRef}
                type="text"
                value={demoText}
                onChange={handleInputChange}
                placeholder="Say hello..."
                aria-describedby="demo-preview-desc"
              />
              <button
                type="button"
                onClick={() => {
                  setDemoText('')
                  inputRef.current?.focus()
                }}
              >
                Clear
              </button>
            </div>

            <p id="demo-preview-desc" style={{ marginTop: 8 }}>
              The text below is announced for screen reader users when it changes.
            </p>

            <div
              className="demo-preview"
              aria-live="polite"
              aria-atomic={true}
              style={{
                marginTop: 8,
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: 4,
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {demoText.trim() === '' ? <em>Nothing to preview</em> : demoText}
            </div>
          </div>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use xlinkHref="/icons.svg#documentation-icon" />
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
            <use xlinkHref="/icons.svg#social-icon" />
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
                  <use xlinkHref="/icons.svg#github-icon" />
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
                  <use xlinkHref="/icons.svg#discord-icon" />
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
                  <use xlinkHref="/icons.svg#x-icon" />
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
                  <use xlinkHref="/icons.svg#bluesky-icon" />
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App