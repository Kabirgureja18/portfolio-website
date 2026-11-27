import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import './guestbook.css'

type Note = { id: string; message: string }
type Phase = 'editing' | 'saving' | 'placing' | 'failed'

function newNote(): Note {
  // getRandomValues also works on local-network HTTP previews.
  if (typeof crypto.randomUUID === 'function') return { id: crypto.randomUUID(), message: '' }
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('')
  const id = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
  return { id, message: '' }
}

function mergeNotes(first: Note[], second: Note[]) {
  return [...new Map([...second, ...first].map(note => [note.id, note])).values()]
}

function noteStyle(id: string): CSSProperties {
  let hash = 2166136261
  for (let i = 0; i < id.length; i++) hash = Math.imul(hash ^ id.charCodeAt(i), 16777619)
  const value = hash >>> 0
  const colors = ['#fff0a6', '#f7cbd5', '#c9e3f0', '#d3e9c4', '#ddd1ed']
  return { '--paper-color': colors[value % colors.length], '--note-rotation': `${(value % 701) / 100 - 3.5}deg`, '--note-shift': `${((value >>> 10) % 17) - 8}px` } as CSSProperties
}

export function Guestbook() {
  const [draft, setDraft] = useState(newNote)
  const [notes, setNotes] = useState<Note[]>([])
  const [phase, setPhase] = useState<Phase>('editing')
  const [feedback, setFeedback] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [reload, setReload] = useState(0)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const wall = useRef<HTMLDivElement>(null)
  const editor = useRef<HTMLTextAreaElement>(null)
  const busy = useRef(false)
  const attempted = useRef(false)
  const restoreFocus = useRef(false)
  const selectionAfterEdit = useRef<[number, number] | null>(null)
  const move = useRef<{ id: string; origin: DOMRect } | null>(null)
  const activeRequest = useRef<AbortController | null>(null)

  useEffect(() => {
    if (selectedNote && dialog.current && !dialog.current.open) dialog.current.showModal()
  }, [selectedNote])

  useEffect(() => () => activeRequest.current?.abort(), [])

  useEffect(() => {
    const section = wall.current
    if (!section) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        void document.fonts.load('1.4rem Kalam').catch(() => {})
        observer.disconnect()
      }
    }, { rootMargin: '400px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const request = new AbortController()
    setLoadFailed(false)
    setLoading(true)
    async function load() {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch('/api/guestbook', { signal: request.signal, cache: 'no-store' })
          if (!response.ok) throw new Error('Unavailable')
          const payload = await response.json()
          if (!Array.isArray(payload.notes)) throw new Error('Invalid wall')
          if (!request.signal.aborted) {
            setNotes(current => mergeNotes(payload.notes, current))
            setLoaded(true)
            setLoading(false)
          }
          return
        } catch {
          if (request.signal.aborted) return
          if (attempt < 2) await new Promise(resolve => window.setTimeout(resolve, 800 * (attempt + 1)))
        }
      }
      if (!request.signal.aborted) { setLoadFailed(true); setLoading(false) }
    }
    void load()
    return () => request.abort()
  }, [reload])

  useLayoutEffect(() => {
    if (phase !== 'placing' || !move.current) return
    const { id, origin } = move.current
    const posted = wall.current?.querySelector<HTMLElement>(`[data-note-id="${id}"]`)
    let animation: Animation | undefined
    let cancelled = false
    const finish = () => {
      if (cancelled) return
      busy.current = false
      move.current = null
      setPhase('editing')
    }
    if (!posted || !posted.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
    } else {
      const destination = posted.getBoundingClientRect()
      animation = posted.animate([
        { transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px) scale(.92)` },
        { transform: 'translate(0, var(--note-shift)) rotate(var(--note-rotation)) scale(1)' },
      ], { duration: 420, easing: 'cubic-bezier(.22,.75,.24,1)' })
      animation.finished.then(finish, finish)
    }
    return () => { cancelled = true; animation?.cancel() }
  }, [phase])

  useLayoutEffect(() => {
    if ((phase === 'editing' || phase === 'failed') && restoreFocus.current) {
      if (document.activeElement === document.body || wall.current?.contains(document.activeElement)) {
        editor.current?.focus({ preventScroll: true })
        if (selectionAfterEdit.current) editor.current?.setSelectionRange(...selectionAfterEdit.current)
      }
      selectionAfterEdit.current = null
      restoreFocus.current = false
    }
  }, [phase, draft.id])

  function changeMessage(message: string) {
    // A changed payload is a new submission. Unmodified retries retain the original ID.
    if (attempted.current && editor.current) {
      restoreFocus.current = true
      selectionAfterEdit.current = [editor.current.selectionStart, editor.current.selectionEnd]
    }
    setDraft({ id: attempted.current ? newNote().id : draft.id, message })
    attempted.current = false
    setPhase('editing')
    setFeedback('')
  }

  async function post() {
    if (busy.current || !draft.message.trim()) return
    busy.current = true
    attempted.current = true
    restoreFocus.current = true
    setPhase('saving')
    setFeedback('Posting your note…')
    const request = new AbortController()
    activeRequest.current = request
    const timeout = window.setTimeout(() => request.abort(), 15000)
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
        signal: request.signal,
      })
      const result = await response.json()
      if (!response.ok || result.id !== draft.id || !['held', 'published'].includes(result.status)) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Couldn’t confirm your post.')
      }
      attempted.current = false
      if (result.status === 'held') {
        busy.current = false
        setFeedback('Your note is held for review. Only approved notes appear on the wall.')
        setPhase('editing')
      } else {
        const origin = wall.current!.querySelector<HTMLElement>('[data-composer="true"]')!.getBoundingClientRect()
        move.current = { id: draft.id, origin }
        setNotes(current => [draft, ...current.filter(note => note.id !== draft.id)])
        setFeedback('Your note is on the wall.')
        setPhase('placing')
      }
      setDraft(newNote())
    } catch (error) {
      busy.current = false
      setFeedback(error instanceof Error && error.name !== 'AbortError'
        ? `${error.message} Your note is here to retry.`
        : 'Couldn’t confirm your post. Your note is here to retry.')
      setPhase('failed')
    } finally {
      window.clearTimeout(timeout)
      activeRequest.current = null
    }
  }

  function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    if (!event.repeat) void post()
  }

  return <section id="guestbook" className="guestbook" aria-labelledby="guestbook-title">
    <div className="guestbook-heading">
      <h2 id="guestbook-title">Leave a sticky note</h2>
      <p id="guestbook-public">Your note will be public</p>
    </div>
    <p className="guestbook-feedback" role="status">{feedback}</p>
    {loading && <p className="guestbook-load-status" role="status">Loading notes…</p>}
    {loadFailed && <p className="guestbook-load-error">Couldn’t load the wall. <button onClick={() => setReload(n => n + 1)}>Reload notes</button></p>}
    {!loading && !loadFailed && loaded && notes.length === 0 && <p className="guestbook-load-status">No notes yet. Leave the first one.</p>}
    {!loading && !loadFailed && loaded && notes.length > 0 && <p className="guestbook-load-error"><button type="button" onClick={() => setReload(n => n + 1)}>Reload notes</button></p>}
    <div className="guestbook-wall" ref={wall}>
      {[draft, ...notes.filter(note => note.id !== draft.id)].map(note => {
        const composing = note.id === draft.id
        const saving = composing && phase === 'saving'
        return <article key={note.id} data-composer={composing} data-note-id={note.id}
          className="guestbook-note" aria-label={composing ? 'Write a public note' : 'Public sticky note'}
          style={{ ...(!composing ? noteStyle(note.id) : {}), ...(composing && phase === 'placing' ? { visibility: 'hidden' } : {}) }}>
          {composing ? <>
            <div className={`guestbook-input-wrap${saving ? ' guestbook-hand' : ''}`}>
              <span aria-hidden="true">{note.message + ' '}</span>
              <textarea ref={editor} aria-label="Your public note" aria-describedby="guestbook-public guestbook-help"
                value={note.message} maxLength={500} readOnly={saving}
                onChange={event => changeMessage(event.target.value)} onKeyDown={submitOnEnter} />
            </div>
            <div className="guestbook-controls">
              <small id="guestbook-help">Shift+Enter for a new line</small>
              <button type="button" onClick={() => void post()} disabled={saving || !note.message.trim()}>
                {phase === 'failed' ? 'Retry post' : saving ? 'Posting…' : 'Post note'}
              </button>
            </div>
          </> : <button className="guestbook-note-open" type="button" onClick={() => setSelectedNote(note)} aria-label={`Open note: ${note.message}`}><span className="guestbook-hand">{note.message}</span><span className="guestbook-read">Read note ↗</span></button>}
        </article>
      })}
    </div>
    <dialog ref={dialog} className="guestbook-dialog" onClose={() => setSelectedNote(null)} aria-label="Full sticky note">
      {selectedNote && <div className="guestbook-dialog-paper" style={noteStyle(selectedNote.id)}>
        <button type="button" className="guestbook-dialog-close" aria-label="Close note" onClick={() => dialog.current?.close()}>×</button>
        <p className="guestbook-hand">{selectedNote.message}</p>
      </div>}
    </dialog>
  </section>
}

