import { NavigationController } from './NavigationController'
import { ThemeSelector } from './ThemeSelector'

export function SiteHeader() {
  return (
    <>
      <a className="skip" href="#main">
        本文へ移動
      </a>
      <div className="site-header">
        <header className="wrap header">
          <a className="brand" href="/#home">
            koukibuu3.dev
          </a>
          <nav className="nav" aria-label="メインナビゲーション">
            {['Home', 'Projects', 'Writing', 'About'].map((label) => (
              <a key={label} href={`/#${label.toLowerCase()}`}>
                {label}
              </a>
            ))}
          </nav>
          <ThemeSelector />
        </header>
      </div>
      <NavigationController />
    </>
  )
}
