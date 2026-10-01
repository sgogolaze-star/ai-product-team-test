import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

type SampleKey = 'greeting' | 'instructions' | 'lorem'

function App() {
  const [count, setCount] = useState(0)

  // Accessible demo state
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<number>(16)
  const [sample, setSample] = useState<SampleKey>('greeting')
  const [liveMessage, setLiveMessage] = useState<string>('')

  const sampleTextMap: Record<
    SampleKey,
    { title: string; text: string }
  > = {
    greeting: {
      title: 'Friendly greeting',
      text: "Hello! This is a short accessible demo. Try the controls to change contrast, text size, and sample content.",
    },
    instructions: {
      title: 'Keyboard instructions',
      text: 'Use Tab to move focus. Buttons can be activated with Enter or Space. The range input can be adjusted with arrow keys.',
    },
    lorem: {
      title: 'Placeholder text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.',
    },
  }

  const toggleContrast = () => {
    setHighContrast((v) => {
      const next = !v
      setLiveMessage(`High contrast ${next ? 'enabled' : 'disabled'}`)
      return next
    })
  }

  const handleFontSizeChange = (value: number) => {
    setFontSize(value)
    setLiveMessage(`Font size set to ${value} pixels`)
  }

  const handleSampleChange = (value: SampleKey) => {
    setSample(value)
    setLiveMessage(`Sample changed to ${sampleTextMap[value].title}`)
  }

  const demoStyle: React.CSSProperties = {
    backgroundColor: highContrast ? '#000' : '#fff',
    color: highContrast ? '#fff' : '#111',
    padding: '1rem',
    borderRadius: 8,
    fontSize: `${fontSize}px`,
    transition: 'background-color 120ms ease, color 120ms ease, font-size 120ms ease',
    border: highContrast ? '2px solid #fff' : '1px solid #ddd',
  }

  const visuallyHiddenStyle: React.CSSProperties = {
    height: 1,
    width: 1,
    overflow: 'hidden',
    clip: 'rect(1px, 1px, 1px, 1px)',
    whiteSpace: 'nowrap',
    border: 0,
    padding: 0,
    position: 'absolute',
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

      {/* Accessible demo section */}
      <section
        id="demo"
        aria-labelledby="demo-heading"
        style={{ padding: '1.25rem', maxWidth: 720, margin: '0 auto' }}
      >
        <h2 id="demo-heading">Accessible demo</h2>
        <p>
          A small interactive demo that demonstrates an accessible contrast toggle,
          adjustable text size, and selectable sample content. Changes are announced
          to assistive technologies.
        </p>

        <div
          role="region"
          aria-labelledby="demo-controls-heading"
          style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}
        >
          <h3 id="demo-controls-heading" style={{ margin: 0 }}>
            Controls
          </h3>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={toggleContrast}
              aria-pressed={highContrast}
              aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast`}
            >
              {highContrast ? 'Disable high contrast' : 'Enable high contrast'}
            </button>

            <label htmlFor="font-size-range" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Text size</span>
              <input
                id="font-size-range"
                type="range"
                min={12}
                max={32}
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                aria-valuemin={12}
                aria-valuemax={32}
                aria-valuenow={fontSize}
                aria-label="Text size"
              />
              <span aria-hidden="true">{fontSize}px</span>
            </label>

            <label htmlFor="sample-select" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Sample</span>
              <select
                id="sample-select"
                value={sample}
                onChange={(e) => handleSampleChange(e.target.value as SampleKey)}
                aria-label="Select sample content"
              >
                <option value="greeting">Greeting</option>
                <option value="instructions">Instructions</option>
                <option value="lorem">Placeholder</option>
              </select>
            </label>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true" style={visuallyHiddenStyle}>
          {liveMessage}
        </div>

        <div
          className="demo-sample"
          role="article"
          aria-labelledby="demo-sample-title"
          style={demoStyle}
        >
          <h4 id="demo-sample-title" style={{ marginTop: 0 }}>
            {sampleTextMap[sample].title}
          </h4>
          <p style={{ margin: 0 }}>{sampleTextMap[sample].text}</p>
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