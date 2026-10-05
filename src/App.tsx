import React from 'react'
import './App.css'
import EmptyStateCard from './components/EmptyStateCard'

function App() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F8FA' }}>
      <EmptyStateCard showIllustration={true} />
    </main>
  )
}

export default App
