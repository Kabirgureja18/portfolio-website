import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './work.css'

gsap.registerPlugin(ScrollTrigger)

export function Work() {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = section.current?.querySelectorAll<HTMLElement>('.work-card') ?? []
      cards.forEach(card => {
        gsap.from(card, {
          y: 20, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 93%', once: true },
        })
      })
    }, section)
    return () => media.revert()
  }, [])

  return <section ref={section} id="work" className="new-section work-showcase" aria-labelledby="work-heading">
    <div className="work-showcase-heading">
      <div><p className="label">COLLABORATIONS &amp; OUTPUT</p><h2 id="work-heading">Work<span>.</span></h2></div>
      <p>Design, websites, photography and the things I make with other people.</p>
    </div>
    <div className="work-grid">
      <article className="work-card">
        <a className="work-card-media" href="/projects/vibe101" aria-label="Explore Vibe101">
          <img src="/images/vibe101.png" alt="Vibe101 graphic: Less tutorial hell. More things you actually build." loading="lazy" decoding="async" />
        </a>
        <div className="work-card-body"><p className="work-category">Websites &amp; Digital Experiences</p><h3>Vibe101</h3><p>A guide for building with AI.</p><div className="work-card-bottom"><span>In development</span><a href="/projects/vibe101">Explore project ↗</a></div></div>
      </article>
      <article className="work-card">
        <a className="work-card-media work-card-media-document" href="/certificates/urbanmonkeys.png" target="_blank" rel="noreferrer" aria-label="View UrbanMonkeys course certificate">
          <img src="/certificates/urbanmonkeys.png" alt="UrbanMonkeys advertising course completion certificate" loading="lazy" decoding="async" />
        </a>
        <div className="work-card-body"><p className="work-category">Branding &amp; Creative Direction</p><h3>Advertising &amp; ideas</h3><p>Exploring brand strategy, creative ideas and visual communication.</p><div className="work-card-bottom"><span>Coursework</span><a href="/certificates/urbanmonkeys.png" target="_blank" rel="noreferrer">View certificate ↗</a></div></div>
      </article>
      <article className="work-card">
        <div className="work-card-media work-card-placeholder" aria-hidden="true"><span>LOOK<br />CLOSER<span className="work-mark">.</span></span></div>
        <div className="work-card-body"><p className="work-category">Photography &amp; Visual Experiments</p><h3>Through the lens</h3><p>A space for photography and visual experiments.</p><div className="work-card-bottom"><span>Portfolio in progress</span><a href="#contact">Get in touch ↗</a></div></div>
      </article>
      <article className="work-card">
        <div className="work-card-media work-card-placeholder work-card-collab" aria-hidden="true"><span>LET’S<br />MAKE<span className="work-mark">.</span></span></div>
        <div className="work-card-body"><p className="work-category">Collaborations &amp; Contributions</p><h3>Better together</h3><p>Have an idea for something we could make together?</p><div className="work-card-bottom"><span>Open to collaboration</span><a href="#contact">Let’s talk ↗</a></div></div>
      </article>
    </div>
  </section>
}
