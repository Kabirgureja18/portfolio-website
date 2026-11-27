import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './intro.css'

const markPath = 'M 150 8 C 154 1 162 2 160 11 L 129 109 C 127 116 130 119 137 118 L 181 113 C 190 112 192 118 183 121 L 134 138 C 114 145 104 156 94 170 L 65 212 C 59 221 53 219 57 210 L 70 168 C 72 162 70 158 64 158 L 22 162 C 12 163 10 157 20 154 C 63 143 82 132 102 108 C 120 87 135 41 150 8 Z M 179 30 C 176 23 181 20 185 27 C 203 55 216 79 233 101 C 248 122 263 131 287 141 C 296 145 295 150 287 150 L 260 149 C 254 149 252 153 255 159 L 288 259 C 291 269 285 272 280 264 L 227 169 C 208 135 195 94 179 30 Z'

const greetings = [
  ['Hello', 'en'], ['नमस्ते', 'hi'], ['Bonjour', 'fr'], ['Hola', 'es'],
  ['こんにちは', 'ja'], ['안녕하세요', 'ko'], ['مرحباً', 'ar'], ['Hallo', 'de'],
  ['Ciao', 'it'], ['Привет', 'ru'], ['你好', 'zh'], ['Olá', 'pt'],
  ['नमस्कारः', 'sa'], ['ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 'pa'], ['নমস্কার', 'bn'], ['வணக்கம்', 'ta'],
  ['Γεια σου', 'el'], ['Merhaba', 'tr'], ['สวัสดี', 'th'], ['Hallo', 'nl'],
  ['નમસ્તે', 'gu'], ['नमस्कार', 'mr'], ['שלום', 'he'], ['Hej', 'sv'],
  ['Hei', 'fi'], ['Cześć', 'pl'], ['Xin chào', 'vi'], ['Halo', 'id'],
  ['नमस्ते', 'ne'], ['Jambo', 'sw'],
] as const

export function BrandMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 310 275" aria-hidden="true" focusable="false"><path d={markPath} /></svg>
}

export function Intro() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(() => location.pathname === '/' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const stage = useRef<HTMLDivElement>(null)
  const moving = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!visible || step >= greetings.length) return
    const delay = 320 - (170 * step / (greetings.length - 1))
    const timer = window.setTimeout(() => setStep(value => value + 1), delay)
    return () => window.clearTimeout(timer)
  }, [visible, step])

  useEffect(() => {
    if (!visible || step !== greetings.length || !stage.current || !moving.current) return
    const target = document.querySelector<HTMLElement>('.brand-mark')
    const paths = Array.from(moving.current.querySelectorAll<SVGPathElement>('path'))
    if (!target || paths.length !== 4) { setVisible(false); return }
    const lengths = paths.map(path => path.getTotalLength())
    const cursors = stage.current.querySelectorAll<HTMLElement>('.construction-cursor')
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let followingPointer = false
    const trackPointer = (event: PointerEvent) => { if (event.pointerType !== 'touch') { pointer.x = event.clientX; pointer.y = event.clientY; if (followingPointer) gsap.set(cursors[0], { x: pointer.x, y: pointer.y }) } }
    window.addEventListener('pointermove', trackPointer)
    const mark = moving.current.querySelector<SVGElement>('svg')
    const word = moving.current.querySelector<HTMLElement>('.construction-word')
    const targetRect = target.getBoundingClientRect()
    const markRect = mark!.getBoundingClientRect()
    const scale = targetRect.width / markRect.width
    const box = moving.current.getBoundingClientRect()
    const centerX = box.left + box.width / 2
    const centerY = box.top + box.height / 2
    const x = targetRect.left + targetRect.width / 2 - centerX - scale * (markRect.left + markRect.width / 2 - centerX)
    const y = targetRect.top + targetRect.height / 2 - centerY - scale * (markRect.top + markRect.height / 2 - centerY)
    gsap.set(target, { autoAlpha: 0 })

    paths.forEach(path => gsap.set(path, { fillOpacity: 0 }))
    const progress = { value: 0 }
    const svgBox = mark!.getBoundingClientRect()
    const stageBox = stage.current.getBoundingClientRect()
    const moveCursors = () => {
      paths.forEach((path, i) => {
        const half = lengths[i] / 2
        const secondHalf = i % 2 === 1
        const point = path.getPointAtLength(half * (progress.value + (secondHalf ? 1 : 0)))
        gsap.set(cursors[i], {
          x: svgBox.left - stageBox.left + point.x * svgBox.width / 310,
          y: svgBox.top - stageBox.top + point.y * svgBox.height / 275,
        })
        path.style.strokeDasharray = secondHalf
          ? `0 ${half} ${half * progress.value} ${lengths[i] * 2}`
          : `${half * progress.value} ${lengths[i] * 2}`
      })
    }
    moveCursors()
    gsap.set(word, { clipPath: 'inset(0 100% 0 0)' })
    timeline.current = gsap.timeline({ onComplete: () => setVisible(false) })
      .to(cursors, { autoAlpha: 1, duration: .2 })
      .to(progress, { value: 1, duration: 2.2, ease: 'none', onUpdate: moveCursors })
      .to([paths[0], paths[2]], { fillOpacity: 1, duration: .4 }, '+=.05')
      .to(word, { clipPath: 'inset(0 0% 0 0)', duration: .7, ease: 'steps(9)' }, '<.1')
      .to([cursors[1], cursors[2], cursors[3]], {
        x: (i: number) => i === 0 ? -80 : i === 1 ? window.innerWidth + 80 : window.innerWidth * .72,
        y: (i: number) => i === 2 ? window.innerHeight + 80 : -80,
        duration: .8, stagger: .08, ease: 'power2.in',
      }, '-=.15')
      .to(cursors[0], { x: () => pointer.x, y: () => pointer.y, duration: .65, ease: 'power2.inOut', onComplete: () => { followingPointer = true; gsap.set(cursors[0], { x: pointer.x, y: pointer.y }) } }, '<.05')
      .to(word, { autoAlpha: 0, duration: .25 }, '+=.25')
      .to(stage.current, { backgroundColor: 'transparent', duration: .75, ease: 'power2.inOut' }, '<')
      .to(moving.current, { x, y, scale, duration: .9, ease: 'power3.inOut' }, '<')
      .to(paths, { fill: '#0d0e82', stroke: '#0d0e82', duration: .45 }, '-=.45')
    const finishOnResize = () => setVisible(false)
    window.addEventListener('resize', finishOnResize, { once: true })
    return () => { window.removeEventListener('pointermove', trackPointer); window.removeEventListener('resize', finishOnResize); timeline.current?.kill(); timeline.current = null; gsap.set(target, { clearProps: 'visibility,opacity' }) }
  }, [visible, step])

  if (!visible) return null
  return <div ref={stage} className={`opening constructed-intro${step === greetings.length ? ' is-building' : ''}`} aria-label="Portfolio introduction">
    {step < greetings.length ? <span className="intro-greeting" key={step} lang={greetings[step][1]} dir="auto" aria-hidden="true">{greetings[step][0]}</span> :
      <div ref={moving} className="construction-logo">
        <svg viewBox="0 0 310 275" aria-hidden="true" focusable="false">{markPath.split(" Z M ").flatMap((part, index) => { const d = index === 0 ? part + " Z" : "M " + part; return [<path key={`${index}-a`} d={d} />, <path key={`${index}-b`} d={d} />] })}</svg>
        <span className="construction-word">kabir.rrr</span>
      </div>}
    {step === greetings.length && [0, 1, 2, 3].map(i => <span key={i} className="construction-cursor" aria-hidden="true" />)}
  </div>
}
