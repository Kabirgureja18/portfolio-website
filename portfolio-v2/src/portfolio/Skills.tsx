import LogoLoop from '../components/reactbits/LogoLoop'
import { MagicSkillBall } from './MagicSkillBall'

export function Skills() {
  const logos = [
    { src: '/images/tech/react.svg', alt: 'React' },
    { src: '/images/tech/typescript.svg', alt: 'TypeScript' },
    { src: '/images/tech/vite.svg', alt: 'Vite' },
    { src: '/images/tech/greensock.svg', alt: 'GSAP' },
  ]
  return <section id="skills" className="new-section">
    <p className="label">WHAT I DO</p>
    <h2>Skills</h2>
    <MagicSkillBall />
    <div className="portfolio-tools"><p>Built with these tools</p><LogoLoop logos={logos} logoHeight={28} gap={48} speed={35} ariaLabel="React, TypeScript, Vite and GSAP" pauseOnHover /></div>
  </section>
}
