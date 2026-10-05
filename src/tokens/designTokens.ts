const tokens = {
  color: {
    primary: '#0066FF',
    onPrimary: '#FFFFFF',
    surface: '#FFFFFF',
    textPrimary: '#0B1A2B',
    textSecondary: '#62727B',
    focus: '#FFB84D',
    shadow: 'rgba(3,15,40,0.08)'
  },
  shadow: {
    elevation1: '0 4px 12px rgba(3,15,40,0.08)'
  },
  radius: {
    radius2: '12px'
  },
  spacing: {
    'space-4': '8px',
    'space-6': '12px',
    'space-8': '16px',
    'space-12': '24px',
    'space-16': '32px'
  },
  sizes: {
    buttonHeight: '48px',
    buttonMinWidth: '160px',
    iconSmall: '16px'
  },
  type: {
    bodySize: '16px',
    headlineClamp: 'clamp(20px, 2.5vw, 24px)'
  }
} as const

export default tokens
