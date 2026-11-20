import { useEffect, useRef, useState, type CSSProperties } from 'react'
import interests from '../../content/interest-images.json'
import './interests.css'

export function Interests() {
  const section = useRef<HTMLElement>(null)
  const [pointerItem, setPointerItem] = useState<string | null>(null)
  const [keyboardItem, setKeyboardItem] = useState<string | null>(null)
  const active = pointerItem ?? keyboardItem

  useEffect(() => {
    function clearOutside(event: PointerEvent) {
      const item = event.target instanceof Element && event.target.closest('[data-interest]')
      if (item && section.current?.contains(item)) return
      setPointerItem(null)
      setKeyboardItem(null)
    }
    document.addEventListener('pointerdown', clearOutside, true)
    return () => document.removeEventListener('pointerdown', clearOutside, true)
  }, [])

  return (
    <section ref={section} id="interests" className="world world-3 interests" aria-labelledby="interests-title">
      <p className="eyebrow">06 / SIDE QUESTS</p>
      <h2 id="interests-title">Interests &amp; Obsessions</h2>
      <div className="interest-index">
        <p>Marvel theories, hockey, gaming, and the ideas behind a clothing brand.</p>
        {interests.map(item => (
          <button
            key={item.id}
            data-interest={item.id}
            type="button"
            className="interest-item"
            aria-pressed={active === item.id}
            style={{ '--interest-accent': item.accent } as CSSProperties}
            onPointerEnter={event => {
              if (event.pointerType !== 'touch') setPointerItem(item.id)
            }}
            onPointerLeave={event => {
              if (event.pointerType !== 'touch') setPointerItem(null)
            }}
            onClick={() => setPointerItem(item.id)}
            onFocus={event => {
              if (event.currentTarget.matches(':focus-visible')) {
                setPointerItem(null)
                setKeyboardItem(item.id)
              }
            }}
            onBlur={() => {
              setKeyboardItem(null)
              setPointerItem(null)
            }}
          >
            <img src={item.image} alt={item.alt} loading="lazy" width={88} height={64} />
            <strong>{item.title}<small>{item.caption}</small></strong>
          </button>
        ))}
      </div>
    </section>
  )
}
