import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './journey.css'

gsap.registerPlugin(ScrollTrigger)

export function Journey() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const drone = useRef<HTMLDivElement>(null)
  const scrollAnimation = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const section = root.current
    const strip = track.current
    const craft = drone.current
    if (!section || !strip || !craft) return
    const media = gsap.matchMedia()
    media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      let stopTimer = 0
      const path = strip.querySelector<SVGPathElement>('.journey-route path')
      const pathLength = path?.getTotalLength() ?? 0
      const positionDrone = (progress: number) => {
        if (!path || !pathLength) return
        const distance = Math.max(0, strip.scrollWidth - section.clientWidth)
        const targetX = ((distance * progress + section.clientWidth / 2) / strip.scrollWidth) * 3000
        let low = 0, high = pathLength
        for (let i = 0; i < 18; i++) {
          const mid = (low + high) / 2
          if (path.getPointAtLength(mid).x < targetX) low = mid
          else high = mid
        }
        craft.style.top = (path.getPointAtLength((low + high) / 2).y / 5) + '%'
      }
      const tween = gsap.to(strip, {
        x: () => -Math.max(0, strip.scrollWidth - section.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + Math.max(1, strip.scrollWidth - section.clientWidth),
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: self => {
            positionDrone(self.progress)
            if (Math.abs(self.getVelocity()) < 1) return
            craft.classList.add('drone-moving')
            window.clearTimeout(stopTimer)
            stopTimer = window.setTimeout(() => craft.classList.remove('drone-moving'), 150)
          },
          onLeave: () => craft.classList.remove('drone-moving'),
          onLeaveBack: () => craft.classList.remove('drone-moving'),
        },
      })
      positionDrone(tween.scrollTrigger?.progress ?? 0)
      scrollAnimation.current = tween
      return () => {
        scrollAnimation.current = null
        window.clearTimeout(stopTimer)
        craft.classList.remove('drone-moving')
        craft.style.removeProperty('top')
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }, section)
    media.add('(max-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(craft, { x: -3 }, {
        x: 3,
        ease: 'none',
        scrollTrigger: { trigger: craft, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      })
    }, section)
    return () => media.revert()
  }, [])

  function bringFocusedLinkIntoView(event: React.FocusEvent<HTMLDivElement>) {
    const target = event.target
    const trigger = scrollAnimation.current?.scrollTrigger
    const strip = track.current
    const section = root.current
    if (!(target instanceof HTMLAnchorElement) || !target.matches(':focus-visible') || !trigger || !strip || !section) return
    const card = target.closest<HTMLElement>('.journey-stop')
    if (!card) return
    const distance = Math.max(1, strip.scrollWidth - section.clientWidth)
    const position = Math.min(distance, Math.max(0, card.offsetLeft - section.clientWidth * 0.06))
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * position / distance, behavior: 'instant' })
    if (event.currentTarget.scrollLeft) event.currentTarget.scrollLeft = 0
    trigger.update()
  }

  return <section ref={root} id="journey" className="journey-story" aria-labelledby="journey-title">
    <div className="journey-top">
      <div><p className="label">ALONG THE WAY</p><h2 id="journey-title">Ideas take<br/><em>a few turns.</em></h2></div>
      <p>Scroll to follow the journey <span aria-hidden="true">→</span></p>
    </div>
    <div className="journey-route-body">
    <div className="journey-craft" ref={drone} role="img" aria-label="Illustration of the T.E.R.R.A. drone">
      <img src="/images/drone-still.webp" alt="" loading="lazy" decoding="async" />
      <img className="drone-moving-frame" src="/images/drone-moving.webp" alt="" loading="lazy" decoding="async" />
    </div>
    <div className="journey-window" onFocus={bringFocusedLinkIntoView} tabIndex={0} aria-label="Journey stories">
      <div className="journey-track" ref={track}>
        <svg className="journey-route" viewBox="0 0 3000 500" preserveAspectRatio="none" aria-hidden="true"><path d="M 0 290 C 260 290 300 125 550 125 S 850 360 1100 360 S 1350 125 1600 125 S 1900 360 2150 360 S 2700 145 3000 200" /></svg>
        <article className="journey-stop"><span>RIVERSPARK</span><h3>One question at a time.</h3><p>Could moving water charge a phone while you paddle? That’s the question behind RiverSpark.</p><a href="/projects/riverspark">Explore RiverSpark ↗</a></article>
        <article className="journey-stop"><span>T.E.R.R.A.</span><h3>A change in the design.</h3><p>We started with a detachable pouch. We changed the design to a tank, pump, tube and nozzle so the drone could spray the algae solution directly.</p><a href="/projects/terra">Explore T.E.R.R.A. ↗</a></article>
        <article className="journey-stop"><span>VIBE101</span><h3>Tools for the next idea.</h3><p>I’m building Vibe101 to help people find tools, edit prompts and keep track of their builds.</p><a href="/projects/vibe101">Explore Vibe101 ↗</a></article>
      </div>
    </div>
    </div>
  </section>
}
