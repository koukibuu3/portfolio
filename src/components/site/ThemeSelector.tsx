'use client'

import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'
let preference: Theme | null | undefined
const valid = (value: string | null): Theme | null =>
  value === 'light' || value === 'dark' ? value : null
function storedTheme() {
  try {
    return valid(localStorage.getItem('portfolio-theme'))
  } catch {
    return null
  }
}
function applyTheme() {
  document.documentElement.dataset.theme =
    preference ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}
function subscribe(onChange: () => void) {
  if (preference === undefined) preference = storedTheme()
  applyTheme()
  const media = matchMedia('(prefers-color-scheme: dark)')
  const onMedia = () => {
    if (!preference) {
      applyTheme()
      onChange()
    }
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== 'portfolio-theme') return
    preference = valid(event.newValue)
    applyTheme()
    onChange()
  }
  media.addEventListener('change', onMedia)
  window.addEventListener('storage', onStorage)
  window.addEventListener('portfolio:theme', onChange)
  return () => {
    media.removeEventListener('change', onMedia)
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('portfolio:theme', onChange)
  }
}
const snapshot = () =>
  document.documentElement.dataset.theme ||
  (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
const serverSnapshot = () => null
function selectTheme(theme: Theme) {
  preference = theme
  try {
    localStorage.setItem('portfolio-theme', theme)
  } catch {
    /* The current page still changes theme. */
  }
  applyTheme()
  window.dispatchEvent(new Event('portfolio:theme'))
}

export function ThemeSelector() {
  const theme = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  return (
    <div
      className="theme-options"
      role="group"
      aria-label="表示テーマ"
      hidden={theme === null}
    >
      <button
        type="button"
        className="theme-button"
        aria-label="ライトモード"
        title="ライトモード"
        aria-pressed={theme === 'light'}
        onClick={() => selectTheme('light')}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M4.22 19.78l1.42-1.42m12.72-12.72 1.42-1.42" />
        </svg>
      </button>
      <button
        type="button"
        className="theme-button"
        aria-label="ダークモード"
        title="ダークモード"
        aria-pressed={theme === 'dark'}
        onClick={() => selectTheme('dark')}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        </svg>
      </button>
    </div>
  )
}
