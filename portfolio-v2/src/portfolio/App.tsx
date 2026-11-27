import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { certificates } from './certificates'
import { Contact } from './Contact'
import { InstagramLinks } from './InstagramLinks'
import { SiteEvolution } from './SiteEvolution'
import { Guestbook } from './Guestbook'
import { Journey } from './Journey'
import { Interests } from './Interests'
import { Skills } from './Skills'
import { GitHubActivity } from './GitHubActivity'
import { Intro } from './Intro'
import { Navigation } from './Navigation'
import ScrollReveal from '../components/reactbits/ScrollReveal/ScrollReveal'
import TextType from '../components/reactbits/TextType/TextType'
import DecryptedText from '../components/reactbits/DecryptedText/DecryptedText'
import Shuffle from '../components/reactbits/Shuffle/Shuffle'
import ScrambledText from '../components/reactbits/ScrambledText/ScrambledText'
import TrueFocus from '../components/reactbits/TrueFocus/TrueFocus'
import { Work } from './Work'
import TextLoop from '../components/reactbits/TextLoop/TextLoop'
import ScrollExpand from '../components/reactbits/ScrollExpand/ScrollExpand'
import PixelTransition from '../components/reactbits/PixelTransition/PixelTransition'
import { CircuitBoard } from '../components/componentry/circuit-board'
import { KineticTextReveal } from '../components/componentry/kinetic-text-reveal'
import { FlippingWordSwap } from '../components/componentry/flipping-word-swap'
import { TextMorph } from '../components/componentry/text-morph'
import { CaseStudyFlipStack } from '../components/componentry/case-study-flip-stack'
import { HoverTransition } from '../components/componentry/hover-transition'
import { ScrollSplitCard } from '../components/componentry/scroll-split-card'
import StatsCounter from '../components/vengeance/stats-counter'
import { AnimatedTooltip } from '../components/vengeance/animated-tooltip'
import { ImageRevealList } from '../components/vengeance/image-reveal-list'
import { CursorCard } from '../components/vengeance/cursor-card'
import { ElasticStack } from '../components/vengeance/elastic-stack'
import './new-site.css'

const achievements = [
  ['Bal Vigyan 2026', 'Science research presentation · T.E.R.R.A.'],
  ['Design for Bharat 2026', 'Youth Innovation Challenge · State-level participation'],
  ['IPSC Hockey', 'Winner'],
  ['SGFI Hockey', 'Winner'],
  ['Robotics Club', 'Technical Head'],
  ['Content Creation Club', 'Technical Head'],
  ['IRIS National Fair', 'Grand Prize · T.E.R.R.A. team · 2026'],
  ['Viksit Bharat 2026', 'T.E.R.R.A. team win'],
  ['Technoxian Nationals', 'Robo Soccer and Robo Race · second place'],
  ['Avishkar IRC', 'National win · 2024'],
  ['OXMUN', 'Winner'],
  ['WSRO', 'National win'],
  ['MU20', 'Wins in 2025 and 2026'],
]
const projects = [
  {slug:'terra', name:'T.E.R.R.A.', status:'Team project', text:'Our team designed a drone to spray a liquid algae solution over degraded soil. I worked on the technical side as CTO. One of our design questions was how to get the solution from the tank to the ground without blocking the nozzle.', link:'https://terra-1mf.vercel.app/'},
  {slug:'vibe101', name:'Vibe101', status:'In development', text:'I’m building the guide I wanted when I started vibecoding: a place to find tools, edit a prompt, choose a project blueprint and keep track of the build.', link:'https://github.com/Kabirgureja18/vibe101website'},
  {slug:'riverspark', name:'RiverSpark', status:'Project in development', text:'Could moving water charge a phone while you paddle? RiverSpark is my portable turbine charger project, built around that question.', link:''},
]
function ProjectsPage() {
 return <section className="new-section detail projects-index"><a href="/">← Back home</a><p className="label">PROJECTS & WORK</p><h1>Things I make<span>.</span></h1><p className="detail-copy">Projects, experiments and work across technology and design.</p><div className="projects-index-list">{projects.map((p, index) => <article key={p.slug} className="projects-index-item"><div><p className="label">{String(index + 1).padStart(2, '0')} / {p.status}</p><h2>{p.name}</h2><p>{p.text}</p><a href={'/projects/' + p.slug}>Explore project ↗</a></div><img src={p.slug === 'terra' ? '/images/interests/robotics.jpg' : p.slug === 'vibe101' ? '/images/vibe101.png' : '/images/riverspark.png'} alt={p.slug === 'riverspark' ? 'RiverSpark turbine model' : p.slug === 'vibe101' ? 'Vibe101 graphic' : 'T.E.R.R.A. concept illustration'} loading="lazy" decoding="async" /></article>)}</div><div className="projects-index-work"><p className="label">COLLABORATIONS & OUTPUT</p><h2>Work.</h2><p>Design, websites, photography and the things I make with other people.</p><a href="/#contact">Have something in mind? Let’s talk ↗</a></div></section>
}
function Home() {
 const root = useRef<HTMLDivElement>(null)
 const [desktopQuote, setDesktopQuote] = useState(() => window.matchMedia('(min-width: 761px)').matches)
 useEffect(() => {
   const query = window.matchMedia('(min-width: 761px)')
   const sync = () => setDesktopQuote(query.matches)
   query.addEventListener('change', sync)
   return () => query.removeEventListener('change', sync)
 }, [])
 useEffect(() => {
   const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
   return () => cancelAnimationFrame(frame)
 }, [desktopQuote])
 useEffect(() => {
   const media = gsap.matchMedia()
   media.add('(prefers-reduced-motion: no-preference)', () => {
     const cards = root.current?.querySelectorAll<HTMLElement>('.project-link') ?? []
     if (window.matchMedia('(min-width: 900px)').matches) {
       cards.forEach((card, index) => {
         const next = cards[index + 1]
         if (!next) return
         gsap.to(card, {
           scale: 0.96, transformOrigin: 'center top', ease: 'none',
           scrollTrigger: { trigger: next, start: 'top 80%', end: 'top 20%', scrub: true, invalidateOnRefresh: true },
         })
       })
     }

   }, root)
   return () => media.revert()
 }, [])
 return <div ref={root}><section id="top" className="new-hero"><div className="hero-heading"><p className="hero-kicker">A LITTLE BIT OF EVERYTHING.</p><h1 aria-label="Kabir Gureja"><span>KABIR</span><span>GUREJA</span></h1></div><img src="/images/hero.webp" alt="Kabir Gureja seated with his arms crossed" width={1030} height={1527} fetchPriority="high" decoding="async" /><div className="hero-bottom"><span>Student · Builder · Creator</span><a href="#about">SCROLL TO EXPLORE ↓</a></div></section>
 <section id="about" className="new-section about-new"><p className="label"><KineticTextReveal text="A LITTLE ABOUT ME" splitBy="words" /></p><h2>Don’t study me;<br/><i>you won’t graduate.</i></h2><div><p>I’m Kabir Gureja, a Class 9 student from Indore. I build <CursorCard href="/projects/terra" image="/images/interests/robotics.jpg" description="T.E.R.R.A. support hub concept">robots</CursorCard> and websites, take photos, and spend a lot of time thinking about branding and ads.</p><p className="about-flip">I enjoy both <FlippingWordSwap word1="building" word2="creating" />.</p><p className="aside" aria-label="In a zombie apocalypse, I would be most useful for being eaten first."><span aria-hidden="true">{window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'In a zombie apocalypse, I would be most useful for being eaten first.' : <TextType as="span" text="In a zombie apocalypse, I would be most useful for being eaten first." typingSpeed={20} loop={false} startOnVisible showCursor={false} />}</span></p></div></section>
 <Interests />
 <blockquote className="story-quote first-quote"><ScrambledText radius={55} duration={0.5} intro={desktopQuote}>I don’t really have a single lane. I’d rather build my own road and see where it goes.</ScrambledText></blockquote>
 <section id="achievements" className="new-section"><p className="label">THE HIGHLIGHTS</p><h2><Shuffle text="Achievements" tag="span" triggerOnHover={true} respectReducedMotion /></h2><div className="achievement-list">{achievements.map(([a,b])=><article key={a}><h3>{a}</h3><p>{b}{a === 'Bal Vigyan 2026' && <> · <a href="/achievements#bal-vigyan-2026">View details ↗</a></>}{a === 'Design for Bharat 2026' && <> · <a href="/certificates/design-for-bharat.png" target="_blank" rel="noreferrer">View certificate ↗</a></>}{a === 'IRIS National Fair' && <> · <a href="/certificates/iris.png" target="_blank" rel="noreferrer">View certificate ↗</a></>}</p></article>)}</div><div className="certificate-stack"><p>Certificates</p><ElasticStack items={[{id:"nvidia",image:"/certificates/thumbs/nvidia.webp",name:"NVIDIA"},{id:"w3schools",image:"/certificates/thumbs/w3schools.webp",name:"W3Schools"},{id:"urbanmonkeys",image:"/certificates/thumbs/urbanmonkeys.webp",name:"UrbanMonkeys"}]} itemSize={75} /><a className="text-link" href="/achievements">View all achievements ↗</a></div></section>
 <Journey />
 <Skills /><div className="topic-morph"><span>I like exploring</span><TextMorph words={["robotics", "design", "photography"]} /></div><div className="topic-loop" aria-label="Robotics, websites, design and photography"><TextLoop text="ROBOTICS · WEBSITES · DESIGN · PHOTOGRAPHY" shape="line" speed={35} color="#f8fae3" /></div><div className="focus-interests" aria-label="Interests: Robotics, Design, Photography"><TrueFocus sentence="Robotics Design Photography" borderColor="#3270e8" blurAmount={1} manualMode /></div>
 <blockquote className="story-quote reactbits-quote"><ScrollReveal baseRotation={0} enableBlur baseOpacity={0.5} blurStrength={2}>Some ideas stay in my head. Mine usually end up becoming projects.</ScrollReveal></blockquote>
 <section id="projects" className="new-section projects-new"><div className="section-heading"><p className="label"><DecryptedText text="THE THINGS I MAKE" animateOn="view" sequential speed={25} /></p><h2>Projects<span>.</span></h2><p>Some ideas make it out of my notes. These are a few of them.</p></div><CaseStudyFlipStack items={projects.map((p,index)=>({number:String(index+1).padStart(2,'0'),eyebrow:p.status,title:p.name,description:p.slug==='terra'?'Robotics, regeneration and a lot of questions.':p.slug==='vibe101'?'A guide for building with AI.':'A portable turbine charger.',href:'/projects/'+p.slug,image:p.slug==='terra'?'/images/interests/robotics.jpg':p.slug==='vibe101'?'/images/vibe101.png':p.slug==='riverspark'?'/images/riverspark.png':undefined,imageAlt:p.slug==='vibe101'?'Vibe101 graphic: Less tutorial hell. More things you actually build.':p.slug==='riverspark'?'RiverSpark turbine charger model with an 87% progress display.':'',background:index===1?'#3270e8':'#0d0e82',foreground:'#f8fae3'}))} /></section>
 <GitHubActivity />
 <Work />
 <SiteEvolution /><Contact /><Guestbook /><footer className="portfolio-footer"><p>kabir.rrr</p><InstagramLinks label="Instagram accounts in footer" /></footer></div>
}
function App() {
 const path=location.pathname.replace(/\/+$/, '') || '/'
 const project=projects.find(p=>path==='/projects/'+p.slug)
 return <><Intro/><Navigation /><main>{path==='/projects' || path==='/projects/'?<ProjectsPage/>:path==='/achievements'?<section className="new-section detail"><a href="/#achievements" onClick={event => { if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) { event.preventDefault(); history.back() } }}>← Back</a><h1>Achievements</h1><div className="achievement-list">{achievements.map(([a,b])=><article key={a} id={a === 'Bal Vigyan 2026' ? 'bal-vigyan-2026' : undefined}><h2>{a}</h2><div><p>{b}</p>{a === 'Design for Bharat 2026' && <a href="/certificates/design-for-bharat.png" target="_blank" rel="noreferrer">View certificate ↗</a>}{a === 'Bal Vigyan 2026' && <><p>Presented T.E.R.R.A. (Terrain-Enhancing Regeneration via Robotic Algae), a proposed autonomous drone system exploring how algae, cyanobacteria and soil monitoring could help restore degraded land.</p><p>Science, Research & Environmental Innovation · The Emerald Heights International School, Indore</p><a href="/projects/terra">Explore T.E.R.R.A. ↗</a></>}</div></article>)}</div><h2 className="certificate-heading">Certificates</h2><p className="certificate-count"><span aria-label={`${certificates.length} certificate images`}>{window.matchMedia('(prefers-reduced-motion: reduce)').matches ? certificates.length : <span aria-hidden="true"><StatsCounter value={certificates.length} duration={0.8} /></span>}</span> certificate images</p><ImageRevealList className="certificate-reveal-list" items={certificates.filter(c=>["nvidia","w3schools","urbanmonkeys"].includes(c.file)).map((c,index)=>({id:c.file,title:c.title,subtitle:"View certificate",image:`/certificates/${c.file}.png`,number:String(index+1).padStart(2,"0"),href:`/certificates/${c.file}.png`}))} /><div className="certificate-grid">{certificates.filter(c=>!["nvidia","w3schools","urbanmonkeys"].includes(c.file)).map(c=><article key={c.file}>{c.file === "iris" ? <PixelTransition className="certificate-pixel" trigger="click" pixelColor="#3270e8" firstContent={<img src="/certificates/iris.png" alt="IRIS Grand Prize certificate" />} secondContent={<div className="certificate-pixel-detail"><strong>IRIS National Fair</strong><p>Grand Prize · Team category · 2026</p><span>Tap to return</span></div>} /> : <a href={`/certificates/${c.file}.png`} target="_blank" rel="noreferrer" aria-label={`Open ${c.title} certificate`}><img src={`/certificates/${c.file}.png`} alt={`${c.title} certificate`} loading="lazy" /></a>}<h3>{c.title}</h3><p>{c.description}</p><a href={`/certificates/${c.file}.png`} target="_blank" rel="noreferrer">View full certificate ↗</a></article>)}</div></section>:project?<section className="new-section detail"><a href="/#projects" onClick={event => { if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) { event.preventDefault(); history.back() } }}>← Back to projects</a><p className="label">{project.status}</p><h1>{project.name}</h1><p className="detail-copy">{project.text}</p>{project.slug==='terra'&&<><p>Our team won at Viksit Bharat 2026. The solar-powered mobile hub is a proposed part of the system.</p><HoverTransition className="terra-hover" label="T.E.R.R.A. concept illustration" defaultComponent={<div className="terra-hover-panel"><img src="/images/drone-still.png" alt="T.E.R.R.A. drone concept" /><span>Drone concept</span></div>} hoverComponent={<div className="terra-hover-panel terra-hover-caption"><strong>T.E.R.R.A.</strong><span>A team project exploring robotic algae application.</span></div>} /><div className="flow-diagram"><h2>Spray system</h2><AnimatedTooltip variant="dori" accentColor="#3270e8" shapeColor="#0d0e82" textColor="#f8fae3" content="The tank, pump, tube and nozzle form the proposed delivery route." className="flow-tooltip">How it works</AnimatedTooltip><p>The proposed route runs from the tank through the pump and tubing to the spray nozzle.</p><p className="flow-scroll-hint">Swipe to see the full diagram →</p><div className="flow-board-scroll" role="region" aria-label="Spray system diagram" tabIndex={0}><CircuitBoard nodes={[{id:"tank",x:80,y:110,label:"Tank"},{id:"pump",x:230,y:110,label:"Pump"},{id:"tube",x:380,y:110,label:"Tube"},{id:"nozzle",x:530,y:110,label:"Nozzle"}]} connections={[{from:"tank",to:"pump",animated:false},{from:"pump",to:"tube",animated:false},{from:"tube",to:"nozzle",animated:false}]} width={610} height={220} showGrid={false} variant="light" traceColor="#0d0e82" nodeColor="#3270e8" pulseColor="#3270e8" /></div></div><ScrollSplitCard imageSrc="/images/drone-still.png" cards={[{title:"Tank",description:"Holds the liquid algae solution.",bgColor:"#0d0e82",textColor:"#f8fae3"},{title:"Pump and tubing",description:"Moves the solution through the system.",bgColor:"#3270e8",textColor:"#f8fae3"},{title:"Nozzle",description:"Sprays the solution toward the ground.",bgColor:"#0d0e82",textColor:"#f8fae3"}]} /><ScrollExpand src="/images/interests/robotics.jpg" alt="Illustrative T.E.R.R.A. support hub concept model" useWindowScroll scrollDistance={0.55} holdDistance={0} startWidth={75} startHeight={65} overlayScrim={0} /></>}{project.link&&<a className="text-link" href={project.link} target="_blank" rel="noreferrer">Explore the project ↗</a>}</section>:<Home/>}</main></>
}
export { App }
