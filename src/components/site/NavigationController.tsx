'use client'

import { useEffect } from 'react'

export function NavigationController() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')!
    const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav a')]
    const sections = ['home', 'projects', 'writing', 'about']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const rootPage = location.pathname === '/'
    let frame = 0
    const update = () => {
      if (document.querySelector('dialog[open]')) return
      let active = rootPage
        ? 'home'
        : location.pathname.startsWith('/articles/')
          ? 'writing'
          : null
      const line = header.getBoundingClientRect().height + 64
      for (const section of sections)
        if (section.getBoundingClientRect().top <= line) active = section.id
      links.forEach((link) => {
        if (link.hash === `#${active}`)
          link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${header.getBoundingClientRect().height}px`,
      )
      schedule()
    })
    observer.observe(header)
    const targetFor = (hash: string) => document.getElementById(hash.slice(1))
    const scroll = (target: HTMLElement, smooth: boolean, focus: boolean) => {
      const behavior = smooth && !reduced.matches ? 'smooth' : 'instant'
      if (target.id === 'home') window.scrollTo({ top: 0, behavior })
      else target.scrollIntoView({ behavior, block: 'start' })
      if (focus) {
        const heading = target.matches('h1,h2,h3,h4')
          ? target
          : target.querySelector<HTMLElement>('h1,h2,h3,h4') || target
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      }
      schedule()
    }
    const click = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a')
      if (
        !rootPage ||
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const url = new URL(link.href)
      if (
        url.origin !== location.origin ||
        url.pathname !== '/' ||
        url.search ||
        !url.hash
      )
        return
      const target = targetFor(url.hash)
      if (!target) return
      event.preventDefault()
      if (url.href !== location.href) history.pushState(history.state, '', url)
      scroll(target, true, true)
    }
    const pop = () => {
      if (
        document.querySelector('dialog[open]') ||
        new URLSearchParams(location.search).has('project')
      )
        return
      const target = targetFor(location.hash || '#home')
      if (target) scroll(target, false, true)
    }
    if (rootPage) {
      const old: Record<string, string> = {
        article: 'writing',
        articles: 'writing',
        knowledge: 'writing',
        slide: 'slides-retired',
        slides: 'slides-retired',
      }
      const replacement = old[location.hash.slice(1)]
      if (replacement) {
        const url = new URL(location.href)
        url.hash = replacement
        history.replaceState(history.state, '', url)
      }
      if (!new URLSearchParams(location.search).has('project')) {
        const target = targetFor(location.hash)
        if (target) scroll(target, false, false)
      }
    }
    document.addEventListener('click', click)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('popstate', pop)
    window.addEventListener('hashchange', schedule)
    schedule()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      document.removeEventListener('click', click)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('popstate', pop)
      window.removeEventListener('hashchange', schedule)
    }
  }, [])
  return null
}
