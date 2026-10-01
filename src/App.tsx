import { useEffect, useRef, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Demo: accessible disclosure + live region + keyboard radiogroup
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const radioRefs = useRef<Array<HTMLButtonElement | null>>([])

  const detailsId = 'demo-details'
  const countId = 'char-count'

  useEffect(() => {
    // Ensure the selected radio is focusable
    // If the component mounts, focus the selected option for keyboard users convenience
    const el = radioRefs.current[selectedIndex]
    if (el) el.setAttribute('tabindex', '0')
    radioRefs.current.forEach((btn, i) => {
      if (!btn) return
      if (i !== selectedIndex) btn.setAttribute('tabindex', '-1')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // keep tabindex in sync when selectedIndex changes
    radioRefs.current.forEach((btn, i) => {
      if (!btn) return
      btn.tabIndex = i === selectedIndex ? 0 : -1
    })
  }, [selectedIndex])

  function handleRadioKeyDown(e: React.KeyboardEvent, index: number) {
    const len = radioRefs.current.length
    let nextIndex = index
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % len
        radioRefs.current[nextIndex]?.focus()
        setSelectedIndex(nextIndex)
        e.preventDefault()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + len) % len
        radioRefs.current[nextIndex]?.focus()
        setSelectedIndex(nextIndex)
        e.preventDefault()
        break
      case 'Home':
        radioRefs.current[0]?.focus()
        setSelectedIndex(0)
        e.preventDefault()
        break
      case 'End':
        radioRefs.current[len - 1]?.focus()
        setSelectedIndex(len - 1)
        e.preventDefault()
        break
      case ' ':
      case 'Enter':
        setSelectedIndex(index)
        e.preventDefault()
        break
      default:
        break
    }
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

      {/* Accessible demo section */}
      <section id="demo" aria-labelledby="demo-heading">
        <h2 id="demo-heading">Accessible demo</h2>

        {/* Disclosure / details */}
        <div>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={detailsId}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? 'Hide details' : 'Show details'}
          </button>

          <div
            id={detailsId}
            role="region"
            aria-live="polite"
            style={{
              marginTop: '0.5rem',
              border: '1px solid #ddd',
              padding: '0.5rem',
              display: isOpen ? 'block' : 'none',
            }}
          >
            <p>
              This is an example of an accessible disclosure. Use the button to
              toggle visibility. The region uses aria-live so assistive
              technologies are informed when it appears.
            </p>
          </div>
        </div>

        {/* Live character count for a text input */}
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="demo-input">Type a short message</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              id="demo-input"
              aria-describedby={countId}
              maxLength={140}
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ padding: '0.25rem' }}
            />
            <div id={countId} aria-live="polite">
              {text.length} / 140
            </div>
          </div>
        </div>

        {/* Keyboard navigable radiogroup */}
        <div style={{ marginTop: '1rem' }}>
          <span id="rg-label">Choose an option (arrow keys to navigate)</span>
          <div
            role="radiogroup"
            aria-labelledby="rg-label"
            style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            {['Option A', 'Option B', 'Option C'].map((label, i) => (
              <button
                key={label}
                ref={(el) => (radioRefs.current[i] = el)}
                role="radio"
                aria-checked={selectedIndex === i}
                tabIndex={selectedIndex === i ? 0 : -1}
                onKeyDown={(e) => handleRadioKeyDown(e, i)}
                onClick={() => setSelectedIndex(i)}
                aria-label={label}
                style={{
                  padding: '0.4rem 0.6rem',
                  border: selectedIndex === i ? '2px solid #0b66ff' : '1px solid #ccc',
                  background: selectedIndex === i ? '#e6f0ff' : 'white',
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '0.5rem' }} aria-live="polite">
            Selected: {['Option A', 'Option B', 'Option C'][selectedIndex]}
          </div>
        </div>
      </section>

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
      <section id="spacer"></section>
    </>
  )
}

export default App
