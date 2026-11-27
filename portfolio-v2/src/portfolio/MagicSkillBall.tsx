import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './magic-ball.css'

const SKILLS = ['Vibe Coding', 'Web Development', 'UI/UX Design', 'Robotics', 'AI & Automation', 'Entrepreneurship', 'Marketing', 'Branding', 'Advertising', 'Public Speaking', 'Leadership', 'Problem Solving', 'Creative Thinking', 'Project Management', 'Content Creation', 'Prototyping']

function shuffled(previous: string | null) {
  const deck = [...SKILLS]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  if (deck[0] === previous) [deck[0], deck[1]] = [deck[1], deck[0]]
  return deck
}

export function MagicSkillBall() {
  const ball = useRef<HTMLSpanElement>(null)
  const answer = useRef<HTMLSpanElement>(null)
  const deck = useRef<string[]>([])
  const last = useRef<string | null>(null)
  const busy = useRef(false)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [skill, setSkill] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const [shaking, setShaking] = useState(false)
  useEffect(() => () => { timeline.current?.kill() }, [])

  function shake() {
    if (busy.current || !ball.current || !answer.current) return
    busy.current = true
    setShaking(true)
    if (!deck.current.length) deck.current = shuffled(last.current)
    const next = deck.current.shift()!
    const reveal = () => { last.current = next; setSkill(next); setCount(value => value % SKILLS.length + 1) }
    const finish = () => { busy.current = false; setShaking(false) }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal(); finish(); return
    }
    if (typeof navigator.vibrate === 'function') navigator.vibrate(35)
    const orb = ball.current
    const text = answer.current
    timeline.current = gsap.timeline({ onComplete: finish })
      .to(text, { autoAlpha: 0, duration: .12 })
      .to(orb, { keyframes: [
        { x: -12, y: 3, rotation: -9, duration: .09 }, { x: 15, y: -9, rotation: 11, duration: .11 },
        { x: -16, y: 5, rotation: -12, duration: .11 }, { x: 13, y: -7, rotation: 9, duration: .1 },
        { x: -8, y: 3, rotation: -5, duration: .1 }, { x: 4, y: -2, rotation: 3, duration: .1 },
        { x: 0, y: 0, rotation: 0, duration: .24, ease: 'elastic.out(1, .55)' },
      ], ease: 'power1.inOut' })
      .call(reveal)
      .to(text, { autoAlpha: 1, duration: .45, ease: 'power2.out' }, '+=.08')
  }

  return <div className="magic-skill">
    <div className="magic-skill-copy"><p className="magic-skill-kicker">A LITTLE ABOUT WHAT I DO</p><h3>What’s my skill? <span aria-hidden="true">🎱</span></h3><p>A little shake. A different skill.</p></div>
    <div className="magic-skill-stage">
      <button className="magic-ball-button" type="button" onClick={shake} aria-label={shaking ? 'Shaking the skill ball' : 'Shake to discover a skill'} aria-disabled={shaking}>
        <span className="magic-ball-float"><span className="magic-ball" ref={ball}><span className="magic-ball-window"><span className="magic-ball-triangle" /><span className="magic-ball-answer" ref={answer} aria-hidden="true">{skill || 'YOUR\nTURN'}</span></span></span></span>
      </button>
      <div className="magic-skill-footer"><span>{skill ? 'Shake again' : 'Click to shake'}</span><span aria-label={`${count} of ${SKILLS.length} skills discovered`}>{String(count).padStart(2, '0')} / {SKILLS.length}</span></div>
      <span className="magic-skill-sr" role="status" aria-live="polite">{skill ? `Skill discovered: ${skill}` : ''}</span>
    </div>
  </div>
}
