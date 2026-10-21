import type { Project } from '~/content/projects'

export function ProjectDetails({
  project,
  titleId,
}: {
  project: Project
  titleId?: string
}) {
  return (
    <>
      <h2 id={titleId}>{project.name}</h2>
      <p className="project-description">{project.summary}</p>
      {project.roles?.length ? (
        <section className="project-detail-section">
          <h3>担当</h3>
          <p>{project.roles.join(' / ')}</p>
        </section>
      ) : null}
      {project.stack?.length ? (
        <section className="project-detail-section">
          <h3>Technology</h3>
          <p className="stack">{project.stack.join(' / ')}</p>
        </section>
      ) : null}
      {project.background ? (
        <section className="project-detail-section">
          <h3>背景</h3>
          <p>{project.background}</p>
        </section>
      ) : null}
      {project.highlights?.length ? (
        <section className="project-detail-section">
          <h3>工夫</h3>
          <ul>
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {project.links?.length ? (
        <div className="project-links">
          {project.links.map((link) => (
            <a key={link.url} href={link.url}>
              {link.label} ↗<span className="sr">（外部サイト）</span>
            </a>
          ))}
        </div>
      ) : null}
    </>
  )
}
