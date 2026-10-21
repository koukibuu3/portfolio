import { ProjectVisual } from '~/components/projects/ProjectVisual'
import { experience, profile } from '~/content/profile'
import { projects } from '~/content/projects'
import { formatDate, jsonLd, site } from '~/content/site'
import { sourceLabels, writing } from '~/content/writing'

export const dynamic = 'error'

function WritingRows({ items }: { items: typeof writing }) {
  return (
    <ul className="writing">
      {items.map((item) => (
        <li key={item.id}>
          <div className="writing-meta">
            {item.publishedAt ? (
              <time dateTime={item.publishedAt}>
                {formatDate(item.publishedAt)}
              </time>
            ) : null}
            <span>{sourceLabels[item.source]}</span>
          </div>
          <a href={item.url}>
            {item.title}
            {item.source !== 'local' ? (
              <>
                {' '}
                ↗<span className="sr">（外部サイト）</span>
              </>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function HomePage() {
  const recent = writing.filter((item) => item.publishedAt).slice(0, 4)
  const history = writing.slice(6)
  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile.name,
            url: site.url,
            jobTitle: profile.role,
            sameAs: profile.links.map((link) => link.url),
          }),
        }}
      />
      <section
        id="home"
        className="band band--canvas"
        aria-labelledby="home-title"
      >
        <div className="wrap section-inner">
          <div className="hero">
            <p className="role">{profile.role}</p>
            <h1 id="home-title" tabIndex={-1}>
              {profile.name}
            </h1>
            <p className="intro">{profile.intro}</p>
            <div className="actions">
              <a className="textlink" href={profile.links[0].url}>
                GitHub ↗<span className="sr">（外部サイト）</span>
              </a>
              <a className="textlink" href="/#projects">
                Projects →
              </a>
              <a className="textlink" href="/#about">
                About →
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        id="projects"
        className="band band--soft"
        aria-labelledby="projects-title"
      >
        <div className="wrap section-inner">
          <div className="page-intro">
            <h2 id="projects-title" tabIndex={-1}>
              Projects
            </h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article
                className="project-card"
                key={project.slug}
                id={`card-${project.slug}`}
              >
                <ProjectVisual project={project} />
                <div className="project-info">
                  <div className="project-title">
                    <h3>{project.name}</h3>
                  </div>
                  <p>{project.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="focus"
        className="band band--canvas"
        aria-labelledby="focus-title"
      >
        <div className="wrap section-inner">
          <div className="section-heading">
            <h2 id="focus-title">Focus</h2>
          </div>
          <div className="focus-grid">
            {profile.focus.map((focus) => (
              <div key={focus.id} id={focus.id}>
                <h3>{focus.title}</h3>
                <p>{focus.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="recent-activity"
        className="band band--surface"
        aria-labelledby="activity-title"
      >
        <div className="wrap section-inner activity-layout">
          <div className="section-heading">
            <h2 id="activity-title">Recent Activity</h2>
          </div>
          <ol className="activity">
            {recent.map((item) => (
              <li key={item.id}>
                <time dateTime={item.publishedAt}>
                  {formatDate(item.publishedAt!)}
                </time>
                <span className="kind">{sourceLabels[item.source]}</span>
                <a href={item.url}>
                  {item.title}
                  {item.source !== 'local' ? (
                    <>
                      {' '}
                      ↗<span className="sr">（外部サイト）</span>
                    </>
                  ) : null}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section
        id="writing"
        className="band band--canvas"
        aria-labelledby="writing-title"
      >
        <div className="wrap section-inner">
          <div className="page-intro">
            <h2 id="writing-title" tabIndex={-1}>
              Writing
            </h2>
          </div>
          <WritingRows items={writing.slice(0, 6)} />
          {history.length ? (
            <details className="writing-more">
              <summary>過去の記事（{history.length}件）</summary>
              <WritingRows items={history} />
            </details>
          ) : null}
        </div>
      </section>
      <section
        id="about"
        className="band band--surface"
        aria-labelledby="about-title"
      >
        <div className="wrap section-inner">
          <div className="page-intro">
            <h2 id="about-title" tabIndex={-1}>
              About
            </h2>
          </div>
          <section className="about-section">
            <h3>Profile</h3>
            <div className="prose">
              <p>{profile.summary}</p>
            </div>
          </section>
          <section className="about-section">
            <h3>Experience</h3>
            <div className="prose">
              <ol className="timeline">
                {experience.map((job) => (
                  <li key={job.company}>
                    <p className="date">{job.period}</p>
                    <h4>{job.company}</h4>
                    <div className="employment">{job.role}</div>
                    <p>{job.description}</p>
                    {job.stack ? <p className="stack">{job.stack}</p> : null}
                    {job.assignments?.map((assignment) => (
                      <div className="sub-experience" key={assignment.name}>
                        <h5>{assignment.name}</h5>
                        <p className="small">{assignment.period}</p>
                        <p>{assignment.description}</p>
                        <p className="stack">{assignment.stack}</p>
                      </div>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      </section>
      <section
        id="connect"
        className="band band--soft"
        aria-labelledby="connect-title"
      >
        <div className="wrap section-inner">
          <h2 id="connect-title">Links</h2>
          <div className="link-list">
            {profile.links.map((link) => (
              <a key={link.name} href={link.url}>
                {link.name} ↗<span className="sr">（外部サイト）</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <aside id="slides-retired" className="legacy-notice wrap">
        <p>Slidesの一覧は終了しました。</p>
        <a href="/#writing">Writingへ</a>
      </aside>
    </main>
  )
}
