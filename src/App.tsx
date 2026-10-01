import { useEffect, useRef, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Demo states
  const [highContrast, setHighContrast] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const nameInputRef = useRef<HTMLInputElement | null>(null)

  const options = ['Red', 'Green', 'Blue']
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // Announce changes to assistive technologies
  useEffect(() => {
    if (announcement) {
      const t = setTimeout(() => setAnnouncement(''), 4000)
      return () => clearTimeout(t)
    }
  }, [announcement])

  // When contrast toggles, announce it
  function toggleContrast() {
    setHighContrast((c) => {
      const next = !c
      setAnnouncement(next ? 'High contrast enabled' : 'High contrast disabled')
      return next
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Name is required')
      setAnnouncement('Please enter your name')
      // focus the invalid control
      nameInputRef.current?.focus()
      return
    }
    setNameError('')
    setAnnouncement(`Hello ${name}, form submitted`)
  }

  // Keyboard navigation for options (roving tabindex using role=listbox/option)
  function onOptionsKeyDown(e: React.KeyboardEvent) {
    const last = options.length - 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i === last ? 0 : i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i === 0 ? last : i - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIndex(last)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelectedIndex(activeIndex)
      setAnnouncement(`${options[activeIndex]} selected`) 
    }
  }

  // Keep focus on the active option when it changes
  useEffect(() => {
    const el = document.getElementById(`opt-${activeIndex}`) as HTMLElement | null
    if (el) el.focus()
  }, [activeIndex])

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

      {/* Accessible demo section */}
      <section id="demo" aria-labelledby="demo-heading">
        <h2 id="demo-heading">Accessible UI demo</h2>

        <div id="contrast-demo">
          <h3>Toggle contrast</h3>
          <p>
            A toggle that exposes its state to assistive technologies via
            aria-pressed and updates the demo surface.
          </p>
          <button
            id="contrast-toggle"
            type="button"
            aria-pressed={highContrast}
            aria-controls="demo-surface"
            onClick={toggleContrast}
          >
            {highContrast ? 'Disable high contrast' : 'Enable high contrast'}
          </button>

          <div
            id="demo-surface"
            style={{
              marginTop: 12,
              padding: 12,
              backgroundColor: highContrast ? '#000' : '#fff',
              color: highContrast ? '#fff' : '#000',
              border: '1px solid #ccc',
            }}
          >
            This surface reflects the current contrast setting.
          </div>
        </div>

        <div id="form-demo" style={{ marginTop: 20 }}>
          <h3>Simple accessible form</h3>
          <p>
            Form shows validation messages with proper role and id so screen readers
            can associate the message with the control.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
                style={{ display: 'block', marginTop: 6 }}
              />
            </div>

            {nameError && (
              <div id="name-error" role="alert" style={{ color: 'crimson', marginTop: 6 }}>
                {nameError}
              </div>
            )}

            <button type="submit" style={{ marginTop: 10 }}>
              Submit
            </button>
          </form>
        </div>

        <div id="options-demo" style={{ marginTop: 20 }}>
          <h3 id="options-heading">Selectable options (keyboard accessible)</h3>
          <p>Use Arrow keys to navigate, Enter/Space to choose.</p>

          <div
            role="listbox"
            aria-labelledby="options-heading"
            tabIndex={0}
            onKeyDown={onOptionsKeyDown}
            style={{ display: 'inline-block', border: '1px solid #ddd', padding: 6 }}
          >
            {options.map((opt, i) => (
              <div
                key={opt}
                id={`opt-${i}`}
                role="option"
                aria-selected={selectedIndex === i}
                tabIndex={activeIndex === i ? 0 : -1}
                onClick={() => {
                  setSelectedIndex(i)
                  setActiveIndex(i)
                  setAnnouncement(`${opt} selected`)
                }}
                onFocus={() => setActiveIndex(i)}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  background: selectedIndex === i ? '#eef' : 'transparent',
                  outline: activeIndex === i ? '2px solid #007acc' : 'none',
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        {/* Live region for announcements */}
        <div aria-live="polite" aria-atomic="true" style={{ marginTop: 12 }}>
          {announcement}
        </div>
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
      <section id="spacer"></section>
    </>
  )
}

export default App
