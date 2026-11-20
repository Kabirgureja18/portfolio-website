import { useRef, useState, type FormEvent } from 'react'
import data from '../../content/portfolio.json'
import './contact.css'
import SocialFlipButton from '../components/vengeance/social-flip-button'
import { LiquidButton } from '../components/vengeance/liquid-button'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

export function Contact() {
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const pending = useRef(false)
  const receipt = useRef('')
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form))
    if (!receipt.current) {
      if (typeof crypto.randomUUID === 'function') receipt.current = crypto.randomUUID()
      else {
        const bytes = crypto.getRandomValues(new Uint8Array(16))
        bytes[6] = (bytes[6] & 0x0f) | 0x40
        bytes[8] = (bytes[8] & 0x3f) | 0x80
        const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('')
        receipt.current = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-')
      }
    }
    pending.current = true
    setSending(true)
    setStatus('Sending…')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, id: receipt.current }),
        signal: AbortSignal.timeout(15000),
      })
      const result = await response.json()
      if (!response.ok || result.id !== receipt.current) throw new Error(result.error || 'Please retry.')
      setSent(true)
      setStatus('Your note was saved to Kabir’s private inbox.')
      receipt.current = ''
      form.reset()
      window.setTimeout(() => setSent(false), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Please retry.')
    } finally {
      pending.current = false
      setSending(false)
    }
  }
  return <section id="contact" className="contact">
    <p className="eyebrow">End of transmission</p>
    <h2>Contact</h2><p>Got something in mind? Send me a note.</p><SocialFlipButton className="contact-social-component" items={[
      {letter:'G', icon:<FaGithub />, label:'GitHub', href:'https://github.com/Kabirgureja18'},
      {letter:'L', icon:<FaLinkedin />, label:'LinkedIn', href:'https://www.linkedin.com/in/kabir-gureja-189558409/'},
      {letter:'E', icon:<FaEnvelope />, label:'Email', href:'mailto:kabirgureja08@gmail.com'}
    ]} />
    <form className={`private-note ${sent ? 'private-note-sent' : ''}`} onSubmit={send} onChange={() => {receipt.current = ''; setStatus('')}}>
      <fieldset disabled={sending}>
        <legend>Send a private note</legend>
        <label>Your name<input name="name" required maxLength={100} autoComplete="name" /></label>
        <label>Reply email (optional)<input name="reply" type="email" maxLength={254} autoComplete="email" /></label>
        <label>Message<textarea name="message" required maxLength={2000} rows={3} /></label>
        <LiquidButton type="submit" fillColor="#f8fae3" textColor="#f8fae3" activeTextColor="#0d0e82" borderColor="#f8fae3">{sending ? 'Sending…' : 'Send private note'}</LiquidButton>
      </fieldset>
      <p role="status">{status}</p>
    </form>
    {data.profile.email && <a href={`mailto:${data.profile.email}`}>{data.profile.email} ↗</a>}
  </section>
}
