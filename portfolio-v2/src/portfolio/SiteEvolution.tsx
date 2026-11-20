import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SiteEvolution() {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.evolution-arrow', { x: -8 }, {
        x: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: section.current, start: 'top 80%', once: true },
      })
    }, section)
    return () => media.revert()
  }, [])

  return <section ref={section} className="new-section site-evolution" aria-labelledby="evolution-title">
    <p className="label">SITE EVOLUTION</p>
    <h2 id="evolution-title">SAME PERSON.<br />BETTER BUILD.</h2>
    <p className="evolution-subtitle">From the first version to something more me.</p>
    <div className="evolution-versions">
      <article className="evolution-version">
        <p className="evolution-label">V1 — THE BEGINNING</p>
        <a href="https://kabirgureja.vercel.app/" target="_blank" rel="noreferrer">kabirgureja.vercel.app ↗</a>
        <p>My first attempt at building a digital space for my work, ideas and experiments.</p>
      </article>
      <span className="evolution-arrow" aria-hidden="true">→</span>
      <article className="evolution-version evolution-current">
        <p className="evolution-label">V2 — THE EVOLUTION</p>
        <a href="https://kabir-gureja-portfolio.netlify.app/">kabir-gureja-portfolio.netlify.app ↗</a>
        <p>Rebuilt with a distinct visual identity, refreshed navigation and a more personal approach to storytelling.</p>
      </article>
    </div>
    <p className="evolution-closing">Not a finished product. Just a better version than yesterday.</p>
  </section>
}
