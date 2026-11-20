import { useEffect, useRef, useState } from 'react'
import './github-activity.css'

type Day = { date: string; count: number; level: number }
type Repo = { name: string; url: string; updated: string; description: string | null; language: string | null; stars: number; fork: boolean }
type Activity = { days: Day[] | null; repos: Repo[] | null; fetchedAt: string }

const featuredNames = ['vibe101website', 'terra-competition-site', 'portfolio-website']
const annualGoal = 1000
const formatDate = (date: string) => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))

export function GitHubActivity() {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [error, setError] = useState(false)
  const [reload, setReload] = useState(0)
  const [selected, setSelected] = useState('')
  const [focusedDay, setFocusedDay] = useState(0)
  const grid = useRef<HTMLDivElement>(null)
  const scrollArea = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    setError(false)
    fetch('/api/github-activity', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json() })
      .then((result: Activity) => {
        if (!Array.isArray(result.days) && !Array.isArray(result.repos)) throw new Error('Invalid response')
        if (result.days?.length) setFocusedDay(result.days.length - 1)
        setActivity(result)
      })
      .catch(() => { if (!controller.signal.aborted) setError(true) })
    return () => controller.abort()
  }, [reload])

  useEffect(() => { if (activity?.days && scrollArea.current) scrollArea.current.scrollLeft = scrollArea.current.scrollWidth }, [activity])
  const days = activity?.days
  const repos = activity?.repos
  const total = days?.reduce((sum, day) => sum + day.count, 0)
  const lastDay = days?.at(-1)?.date
  const cutoff = lastDay ? new Date(`${lastDay}T00:00:00Z`) : null
  cutoff?.setUTCDate(cutoff.getUTCDate() - 364)
  const yearTotal = cutoff && days ? days.filter(day => day.date >= cutoff.toISOString().slice(0, 10)).reduce((sum, day) => sum + day.count, 0) : null
  const goalProgress = yearTotal === null ? 0 : Math.min(100, yearTotal / annualGoal * 100)
  const pad = days?.length ? new Date(days[0].date + 'T00:00:00Z').getUTCDay() : 0
  const featured = featuredNames.flatMap(name => repos?.filter(repo => !repo.fork && repo.name.toLowerCase() === name) ?? [])
  const languages = repos ? [...new Set(repos.map(repo => repo.language).filter((language): language is string => Boolean(language)))].sort() : []
  const recent = repos ? [...repos].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 4) : []
  return <section className="github-activity" aria-labelledby="github-activity-title">
    <div className="github-activity-header"><div><p className="label">CODE IN THE OPEN</p><h2 id="github-activity-title">Built, Broken,<br />Rebuilt<span>.</span></h2></div><a href="https://github.com/Kabirgureja18" target="_blank" rel="noreferrer">Visit my GitHub ↗</a></div>
    {error && !activity ? <div className="github-state" role="alert"><p>Couldn’t load GitHub activity.</p><button type="button" onClick={() => setReload(value => value + 1)}>Try again</button></div> : !activity ? <p className="github-state" role="status">Loading GitHub activity…</p> : <>
      <div className="github-card">
        {yearTotal !== null && <div className="github-goal">
          <div className="github-goal-title"><span>THE BUILD CONTINUES</span><span>ROLLING 365 DAYS</span></div>
          <div className="github-goal-main"><div><strong>{yearTotal.toLocaleString()}</strong><span> contributions</span></div><p>Working towards<br /><b>1,000 / year</b></p></div>
          <div className="github-goal-track" role="progressbar" aria-label="Progress towards 1,000 contributions in a rolling year" aria-valuemin={0} aria-valuemax={annualGoal} aria-valuenow={Math.min(yearTotal, annualGoal)} aria-valuetext={`${yearTotal} contributions in the last 365 days; goal ${annualGoal}`}><span style={{ width: `${goalProgress}%` }} /></div>
          <div className="github-goal-caption"><span>Annual goal</span><span>{yearTotal >= annualGoal ? 'Goal reached' : `${(annualGoal - yearTotal).toLocaleString()} to go`}</span></div>
        </div>}
        <div className="github-card-heading"><strong>{total === undefined ? 'Contribution calendar unavailable' : `${total.toLocaleString()} contributions`}</strong>{total !== undefined && <span>shown in the calendar</span>}</div>
        {days?.length ? <><div ref={scrollArea} className="github-grid-scroll" role="region" aria-label="GitHub contribution calendar. Scroll horizontally and select a day for its count." tabIndex={0}>
          <div className="github-grid" ref={grid}>
            {Array.from({ length: pad }, (_, i) => <span key={'pad'+i} aria-hidden="true" />)}
            {days.map((day, index) => <button className="github-day" type="button" data-level={day.level} key={day.date} aria-label={`${day.date}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`} title={`${day.date}: ${day.count} contributions`}
              onFocus={() => { setFocusedDay(index); setSelected(`${day.date} · ${day.count} contributions`) }} onMouseEnter={() => setSelected(`${day.date} · ${day.count} contributions`)} onClick={() => { setFocusedDay(index); setSelected(`${day.date} · ${day.count} contributions`) }}
              onKeyDown={event => { const shift: Record<string, number> = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }; if (!(event.key in shift)) return; event.preventDefault(); const next = Math.max(0, Math.min(days.length - 1, index + shift[event.key])); grid.current?.querySelectorAll<HTMLButtonElement>('.github-day')[next]?.focus() }} tabIndex={focusedDay === index ? 0 : -1} />)}
          </div>
        </div><div className="github-grid-meta"><span aria-live="polite">{selected || 'Scroll, hover or tap a day for details'}</span><span>Less <i data-level="0"/><i data-level="1"/><i data-level="2"/><i data-level="3"/><i data-level="4"/> More</span></div></> : <button className="github-retry" type="button" onClick={() => setReload(value => value + 1)}>Try again</button>}
      </div>
      <div className="github-work-heading"><h3>Featured repositories</h3><span>Public projects on GitHub</span></div>
      {repos ? <><div className="github-featured">{featured.length ? featured.map(repo => <article className="github-repo-card" key={repo.name}>
        <h4><a href={repo.url} target="_blank" rel="noreferrer">{repo.name} ↗</a></h4><p>{repo.description || 'No description provided on GitHub.'}</p><div className="github-repo-meta"><span>{repo.language || 'Language not specified'}</span><span>★ {repo.stars}</span><time dateTime={repo.updated}>Updated {formatDate(repo.updated)}</time></div>
      </article>) : <p>No featured repositories are currently available.</p>}</div>
      <div className="github-overview"><div><span>Public repositories</span><strong>{repos.length}</strong></div><div><span>Primary languages</span><strong>{languages.length ? languages.join(' · ') : 'Not specified'}</strong></div><div><span>Recent updates</span><ul>{recent.map(repo => <li key={repo.name}><a href={repo.url} target="_blank" rel="noreferrer">{repo.name}</a>{repo.fork && <span className="github-fork">Fork</span>} <time dateTime={repo.updated}>{formatDate(repo.updated)}</time></li>)}</ul></div></div></> : <div className="github-state"><p>Repository details are temporarily unavailable.</p><button type="button" onClick={() => setReload(value => value + 1)}>Try again</button></div>}
      {error && <p className="github-state" role="status">Couldn’t refresh GitHub data. Showing the last loaded results. <button type="button" onClick={() => setReload(value => value + 1)}>Retry</button></p>}
    </>}
  </section>
}
