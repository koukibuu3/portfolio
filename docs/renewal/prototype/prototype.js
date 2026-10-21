;(() => {
  'use strict'
  const root = document.documentElement
  const media = matchMedia('(prefers-color-scheme: dark)')
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const themeOptions = document.querySelector('.theme-options')
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')]
  let preference = root.dataset.theme || null
  const currentTheme = () => preference || (media.matches ? 'dark' : 'light')
  function applyTheme() {
    root.dataset.theme = currentTheme()
    themeButtons.forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.themeChoice === currentTheme()),
      ),
    )
  }
  applyTheme()
  themeOptions.hidden = false
  themeButtons.forEach((button) =>
    button.addEventListener('click', () => {
      preference = button.dataset.themeChoice
      try {
        localStorage.setItem('portfolio-theme', preference)
      } catch {}
      applyTheme()
    }),
  )
  media.addEventListener('change', () => {
    if (!preference) applyTheme()
  })
  window.addEventListener('storage', (event) => {
    if (event.key !== 'portfolio-theme' && event.key !== null) return
    preference = ['light', 'dark'].includes(event.newValue)
      ? event.newValue
      : null
    applyTheme()
  })

  const header = document.querySelector('.site-header')
  const sections = ['home', 'projects', 'writing', 'about'].map((id) =>
    document.getElementById(id),
  )
  const navLinks = [...document.querySelectorAll('.nav a')]
  function updateActiveSection() {
    if (dialog.open) return
    const line = header.getBoundingClientRect().height + 64
    let active = sections[0]
    for (const section of sections)
      if (section.getBoundingClientRect().top <= line) active = section
    navLinks.forEach((link) => {
      if (link.hash === '#' + active.id)
        link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
  }
  new ResizeObserver(() => {
    root.style.setProperty(
      '--header-height',
      header.getBoundingClientRect().height + 'px',
    )
    updateActiveSection()
  }).observe(header)
  let scheduled = false
  window.addEventListener(
    'scroll',
    () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        updateActiveSection()
      })
    },
    { passive: true },
  )
  function targetForHash(hash) {
    return document.getElementById(hash.slice(1))
  }
  function scrollToTarget(target, smooth = true, focus = true) {
    if (!target) return
    const behavior = smooth && !reducedMotion.matches ? 'smooth' : 'instant'
    if (target.id === 'home') window.scrollTo({ top: 0, behavior })
    else target.scrollIntoView({ behavior, block: 'start' })
    if (focus) {
      const heading = target.matches('h1,h2,h3,h4')
        ? target
        : target.querySelector('h1,h2,h3,h4') || target
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }

  const dialog = document.getElementById('project-dialog')
  const closeButton = document.getElementById('close-dialog')
  const cards = [...document.querySelectorAll('[data-project]')]
  cards.forEach((card) => {
    const image = card.querySelector('.project-media img')
    if (!image) return
    const showName = () => {
      const media = image.closest('.project-media')
      if (!media) return
      const name = document.createElement('span')
      name.textContent = card.querySelector('h3').textContent
      media.className = 'project-media project-media--type'
      media.replaceChildren(name)
    }
    image.addEventListener('error', showName, { once: true })
    if (image.complete && !image.naturalWidth) showName()
  })
  const session = String(Math.random())
  let opener = null
  let originY = 0
  let closing = false
  let backgroundDown = false
  function syncModal() {
    const url = new URL(location.href)
    const values = url.searchParams.getAll('project')
    const card =
      values.length === 1
        ? cards.find((card) => card.dataset.project === values[0])
        : null
    if (values.length && !card) {
      url.searchParams.delete('project')
      history.replaceState(history.state, '', url)
    }
    if (card) {
      document.getElementById('dialog-title').textContent =
        card.querySelector('h3').textContent
      document.getElementById('dialog-summary').textContent =
        card.querySelector('p').textContent
      if (!dialog.open) {
        originY = scrollY
        document.body.style.overflow = 'hidden'
        dialog.showModal()
        closeButton.focus()
      }
    } else if (dialog.open) {
      dialog.close()
      document.body.style.overflow = ''
      const target = opener || document.getElementById('projects-title')
      target.focus({ preventScroll: true })
      const y = originY
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: 'instant' })
        updateActiveSection()
      })
    }
    closing = false
    updateActiveSection()
  }
  function closeProject() {
    if (closing) return
    closing = true
    if (history.state?.portfolioStudy === session) history.back()
    else {
      const url = new URL(location.href)
      url.searchParams.delete('project')
      if (!targetForHash(url.hash)) url.hash = 'projects'
      history.replaceState(history.state, '', url)
      syncModal()
    }
  }
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a')
    if (
      !link ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return
    if (link.dataset.project) {
      event.preventDefault()
      opener = link
      const url = new URL(location.href)
      url.searchParams.set('project', link.dataset.project)
      history.pushState({ ...history.state, portfolioStudy: session }, '', url)
      syncModal()
    } else if (link.getAttribute('href')?.startsWith('#')) {
      const target = targetForHash(link.hash)
      if (!target) return
      event.preventDefault()
      const url = new URL(location.href)
      url.hash = link.hash
      if (url.href !== location.href) history.pushState(history.state, '', url)
      scrollToTarget(target)
    }
  })
  window.addEventListener('popstate', () => {
    const wasOpen = dialog.open
    syncModal()
    if (!wasOpen && !dialog.open)
      scrollToTarget(targetForHash(location.hash), false)
  })
  window.addEventListener('hashchange', () => {
    updateActiveSection()
  })
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return
    const controls = [
      ...dialog.querySelectorAll(
        'button,a[href],input,select,textarea,[tabindex="0"]',
      ),
    ].filter((el) => !el.disabled && el.getClientRects().length)
    const first = controls[0],
      last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  })
  closeButton.addEventListener('click', closeProject)
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault()
    closeProject()
  })
  const outside = (event) => {
    const box = dialog.getBoundingClientRect()
    return (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
  }
  dialog.addEventListener('pointerdown', (event) => {
    backgroundDown = outside(event)
  })
  dialog.addEventListener('pointerup', (event) => {
    if (backgroundDown && outside(event)) closeProject()
    backgroundDown = false
  })
  requestAnimationFrame(() => {
    const url = new URL(location.href)
    // Support links copied from the previous design study without keeping a second router.
    const oldView = url.searchParams.get('view')
    if (sections.some((section) => section.id === oldView)) {
      url.hash = oldView
      url.searchParams.delete('view')
      history.replaceState(history.state, '', url)
    }
    if (url.searchParams.has('project'))
      scrollToTarget(document.getElementById('projects'), false, false)
    else if (url.hash) scrollToTarget(targetForHash(url.hash), false, false)
    syncModal()
  })
})()
