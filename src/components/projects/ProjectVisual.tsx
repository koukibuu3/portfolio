'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Project } from '~/content/projects'

export function ProjectVisual({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false)
  if (failed)
    return (
      <span className="project-media project-media--type" aria-hidden="true">
        <span>{project.name}</span>
      </span>
    )
  return (
    <span className={`project-media project-media--${project.image.variant}`}>
      <Image
        src={project.image.src}
        width={project.image.width}
        height={project.image.height}
        alt=""
        sizes="(min-width: 1200px) 265px, (min-width: 1024px) 24vw, (min-width: 768px) 46vw, 100vw"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
