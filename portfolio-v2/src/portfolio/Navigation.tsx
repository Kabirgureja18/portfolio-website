import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { BrandMark } from './Intro'
import './navigation.css'
import GradualBlur from '../components/reactbits/GradualBlur/GradualBlur'

const links = [
  { label: 'Home', href: '/#top' },
  { label: 'About', href: '/#about' },
  { label: 'Interests', href: '/#interests' },
  { label: 'Achievements', href: '/#achievements' },
  { label: 'Projects', href: '/projects' },
  { label: 'Work', href: '/#work' },
  { label: 'Contact', href: '/#contact' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)

  useEffect(() => {
    const panel = dialog.current
    if (!panel) return
    if (open) {
      panel.showModal()
      document.body.classList.add('menu-open')
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const context = gsap.context(() => {
          gsap.fromTo('.menu-layer', { xPercent: 105 }, { xPercent: 0, duration: .55, stagger: .07, ease: 'power4.out' })
          gsap.fromTo('.menu-link', { yPercent: 105, rotate: 5 }, { yPercent: 0, rotate: 0, duration: .55, stagger: .045, delay: .18, ease: 'power3.out' })
        }, panel)
        return () => context.revert()
      }
    } else if (panel.open) {
      panel.close()
      document.body.classList.remove('menu-open')
      trigger.current?.focus({ preventScroll: true })
    }
    return () => document.body.classList.remove('menu-open')
  }, [open])

  function closeMenu() {
    setOpen(false)
  }

  function dismissMenu() {
    if (closing.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !dialog.current) { closeMenu(); return }
    closing.current = true
    gsap.to(dialog.current.querySelectorAll('.menu-layer'), {
      xPercent: 105, duration: .38, stagger: { each: .04, from: 'end' }, ease: 'power3.in',
      onComplete: () => { closing.current = false; closeMenu() },
    })
  }

  return <header className="new-nav">
    <a className="brand-link" href="/" aria-label="Kabir Gureja home"><BrandMark className="brand-mark" /><span>kabir.rrr</span></a>
    <GradualBlur position="bottom" height="6px" strength={0.35} layers={2} style={{ top: 'auto', bottom: 0, pointerEvents: 'none' }} />
    <button ref={trigger} type="button" className="menu-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>Menu <span aria-hidden="true">＋</span></button>
    <dialog id="site-menu" ref={dialog} className="menu-dialog" aria-labelledby="menu-heading" onCancel={event => { event.preventDefault(); dismissMenu() }} onClose={closeMenu} onClick={event => { if (event.target === dialog.current) dismissMenu() }}>
      <div className="menu-layer menu-layer-back" aria-hidden="true" />
      <div className="menu-layer menu-layer-middle" aria-hidden="true" />
      <div className="menu-layer menu-panel">
        <div className="menu-top"><span id="menu-heading">Explore</span><button type="button" className="menu-close" onClick={dismissMenu} autoFocus>Close <span aria-hidden="true">×</span></button></div>
        <nav aria-label="Main navigation"><ul>{links.map(link => <li key={link.label}><span className="menu-link-mask"><a className="menu-link" href={link.href} onClick={closeMenu}>{link.label}</a></span></li>)}</ul></nav>
        <div className="menu-socials"><span>Find me on</span><div><a href="https://github.com/Kabirgureja18">GitHub ↗</a><a href="https://www.linkedin.com/in/kabir-gureja-189558409/">LinkedIn ↗</a><a href="mailto:kabirgureja08@gmail.com">Email ↗</a></div></div>
      </div>
    </dialog>
  </header>
}
