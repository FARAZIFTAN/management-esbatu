// Toast configuration constants
export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#fff',
    color: '#333',
    fontWeight: '500',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
} as const;

export const TOAST_STYLES = {
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
  loading: {
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#fff',
    },
  },
} as const;
