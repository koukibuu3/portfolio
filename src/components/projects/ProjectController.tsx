'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { projects } from '~/content/projects'
import { ProjectDetails } from './ProjectDetails'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener('portfolio:project', onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener('portfolio:project', onChange)
  }
}
const snapshot = () => location.search
const serverSnapshot = () => ''
const changed = () => window.dispatchEvent(new Event('portfolio:project'))

export function ProjectController() {
  const search = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const values = new URLSearchParams(search).getAll('project')
  const selected =
    values.length === 1
      ? projects.find((project) => project.slug === values[0])
      : undefined
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLAnchorElement | null>(null)
  const originY = useRef(0)
  const session = useRef('')
  const closing = useRef(false)
  const backgroundDown = useRef(false)
  const priorOverflow = useRef('')

  useEffect(() => {
    session.current = crypto.randomUUID()
    document.documentElement.dataset.projectsEnhanced = 'true'
    const click = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[data-project]',
      )
      if (
        !link ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.defaultPrevented
      )
        return
      event.preventDefault()
      opener.current = link
      const url = new URL(location.href)
      url.searchParams.set('project', link.dataset.project!)
      history.pushState(
        { ...history.state, portfolioProject: session.current },
        '',
        url,
      )
      changed()
    }
    document.addEventListener('click', click)
    const element = dialog.current
    return () => {
      document.removeEventListener('click', click)
      delete document.documentElement.dataset.projectsEnhanced
      if (element?.open) {
        element.close()
        document.body.style.overflow = priorOverflow.current
      }
    }
  }, [])

  useEffect(() => {
    const element = dialog.current!
    closing.current = false
    const params = new URLSearchParams(search)
    if (params.has('project') && !selected) {
      const url = new URL(location.href)
      url.searchParams.delete('project')
      history.replaceState(history.state, '', url)
      document.getElementById(url.hash.slice(1))?.scrollIntoView({
        behavior: 'instant',
        block: 'start',
      })
      changed()
    }
    if (selected && !element.open) {
      if (!opener.current)
        document
          .getElementById('projects')
          ?.scrollIntoView({ behavior: 'instant', block: 'start' })
      // Stop an in-flight anchor animation before locking the background.
      window.scrollTo({ top: scrollY, behavior: 'instant' })
      originY.current = scrollY
      priorOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      element.showModal()
      closeButton.current?.focus()
    } else if (!selected && element.open) {
      element.close()
      document.body.style.overflow = priorOverflow.current
      const target = opener.current?.isConnected
        ? opener.current
        : document.getElementById('projects-title')
      target?.focus({ preventScroll: true })
      window.scrollTo({ top: originY.current, behavior: 'instant' })
    }
  }, [selected, search])

  function closeProject() {
    if (closing.current) return
    closing.current = true
    if (history.state?.portfolioProject === session.current) history.back()
    else {
      const url = new URL(location.href)
      url.searchParams.delete('project')
      if (!document.getElementById(url.hash.slice(1))) url.hash = 'projects'
      history.replaceState(history.state, '', url)
      changed()
    }
  }
  function outside(event: React.PointerEvent<HTMLDialogElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
  }
  return (
    <dialog
      ref={dialog}
      id="project-dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        closeProject()
      }}
      onPointerDown={(event) => {
        backgroundDown.current = outside(event)
      }}
      onPointerUp={(event) => {
        if (backgroundDown.current && outside(event)) closeProject()
        backgroundDown.current = false
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button,a[href],[tabindex="0"]',
          ),
        ].filter((element) => element.getClientRects().length)
        const first = controls[0],
          last = controls.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
    >
      <div className="dialog-top">
        <span className="eyebrow">PROJECT</span>
        <button
          ref={closeButton}
          type="button"
          className="close"
          onClick={closeProject}
        >
          閉じる <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="dialog-body">
        {selected ? (
          <ProjectDetails project={selected} titleId="dialog-title" />
        ) : null}
      </div>
    </dialog>
  )
}
