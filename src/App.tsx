import { useEffect, useRef, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [noteVisible, setNoteVisible] = useState(true)
  const noteRef = useRef<HTMLButtonElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && noteVisible) {
        setNoteVisible(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [noteVisible])

  // Manage focus: when the note appears, focus the dismiss button;
  // when it is dismissed, restore focus to the main heading.
  useEffect(() => {
    if (noteVisible) {
      // Focus the dismiss button so keyboard and screen reader users can act immediately
      noteRef.current?.focus()
    } else {
      // Restore focus to the main heading to preserve context for keyboard users
      headingRef.current?.focus()
    }
  }, [noteVisible])

  return (
    <>
      {/* Small accessible note: live region, dismissible via button or Escape key */}
      {noteVisible && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Important note"
          style={{
            border: '1px solid rgba(0,0,0,0.12)',
            padding: '10px 12px',
            margin: '12px',
            borderRadius: 8,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(250,250,250,0.9)'
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Note:</strong> This small accessible notice is announced to assistive technologies. You can dismiss it with the button or by pressing Escape.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              ref={noteRef}
              type="button"
              onClick={() => setNoteVisible(false)}
              aria-label="Dismiss note"
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1 tabIndex={-1} ref={headingRef}>Get started</h1>
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
      <section id="spacer"></section>
    </>
  )
}

export default App
