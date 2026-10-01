import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const addFocus = (e: any) => {
    const el = e.currentTarget as HTMLElement
    el.style.outline = '3px solid #2684FF'
    el.style.outlineOffset = '2px'
  }

  const removeFocus = (e: any) => {
    const el = e.currentTarget as HTMLElement
    el.style.outline = ''
    el.style.outlineOffset = ''
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" aria-hidden="true" />
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
          onFocus={addFocus}
          onBlur={removeFocus}
        >
          Count is {count}
        </button>
      </section>

      {/* AI Team Preview Test section: visible, accessible, and simple */}
      <section
        id="ai-preview"
        aria-labelledby="ai-preview-heading"
        className="ai-preview"
        role="region"
      >
        <h2 id="ai-preview-heading">AI Team Preview Test</h2>
        <p>This section is a preview for the AI team.</p>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer" onFocus={addFocus} onBlur={removeFocus}>
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" onFocus={addFocus} onBlur={removeFocus}>
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer" onFocus={addFocus} onBlur={removeFocus}>
                <svg
                  className="button-icon"
                  aria-hidden="true"
                >
                  <use xlinkHref="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noopener noreferrer" onFocus={addFocus} onBlur={removeFocus}>
                <svg
                  className="button-icon"
                  aria-hidden="true"
                >
                  <use xlinkHref="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noopener noreferrer" onFocus={addFocus} onBlur={removeFocus}>
                <svg
                  className="button-icon"
                  aria-hidden="true"
                >
                  <use xlinkHref="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noopener noreferrer" onFocus={addFocus} onBlur={removeFocus}>
                <svg
                  className="button-icon"
                  aria-hidden="true"
                >
                  <use xlinkHref="/icons.svg#bluesky-icon"></use>
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
