import { FaInstagram } from 'react-icons/fa'
import './instagram-links.css'

const accounts = [
  { handle: 'kabirgureja18_', href: 'https://www.instagram.com/kabirgureja18_/' },
  { handle: 'kabirrr_dagoat', href: 'https://www.instagram.com/kabirrr_dagoat/' },
]

export function InstagramLinks({ label }: { label: string }) {
  return <nav className="instagram-links" aria-label={label}>
    {accounts.map(account => <a key={account.handle} href={account.href} target="_blank" rel="noopener noreferrer">
      <FaInstagram aria-hidden="true" /><span>@{account.handle}</span><span className="instagram-arrow" aria-hidden="true">↗</span>
    </a>)}
  </nav>
}
