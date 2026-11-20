import { useRef, useState, type CSSProperties } from 'react'
import LogoLoop from '../components/reactbits/LogoLoop'
import { HighlightGrid } from '../components/vengeance/highlight-grid'

const skills = [
  { label: 'Robotics & prototyping', destination: 'T.E.R.R.A.', href: '/projects/terra' },
  { label: 'Web development', destination: 'Vibe101', href: '/projects/vibe101' },
]

export function Skills() {
  const list = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const [highlight, setHighlight] = useState<CSSProperties>({})

  function select(index: number, element: HTMLElement) {
    const container = list.current
    if (!container) return
    const item = element.getBoundingClientRect()
    const parent = container.getBoundingClientRect()
    setHighlight({ top: item.top - parent.top, left: item.left - parent.left, width: item.width, height: item.height })
    setActive(index)
  }

  const logos = [
    { src: '/images/tech/react.svg', alt: 'React' },
    { src: '/images/tech/typescript.svg', alt: 'TypeScript' },
    { src: '/images/tech/vite.svg', alt: 'Vite' },
    { src: '/images/tech/greensock.svg', alt: 'GSAP' },
  ]
  return <section id="skills" className="new-section">
    <p className="label">WHAT I DO</p>
    <h2>Skills</h2>
    <div className="skills-list skills-highlight" ref={list} onMouseLeave={() => setActive(null)}>
      <span className="skills-highlight-background" style={{ ...highlight, opacity: active === null ? 0 : 1 }} aria-hidden="true" />
      {skills.map((skill, index) => <a href={skill.href} key={skill.label}
        onMouseEnter={event => select(index, event.currentTarget)}
        onFocus={event => select(index, event.currentTarget)}
        onBlur={() => setActive(null)}>
        {skill.label} <span>{skill.destination} ↗</span>
      </a>)}

    </div>
<div className="portfolio-skills-grid"><HighlightGrid rows={[[{label:"Branding"},{label:"Marketing"},{label:"Design"}],[{label:"Public speaking"},{label:"Photography"},{label:"Painting"}]]} colors={["#0d0e82"]} highlightFirst={false} /></div>
    <div className="portfolio-tools"><p>Built with these tools</p><LogoLoop logos={logos} logoHeight={28} gap={48} speed={35} ariaLabel="React, TypeScript, Vite and GSAP" pauseOnHover /></div>
  </section>
}
