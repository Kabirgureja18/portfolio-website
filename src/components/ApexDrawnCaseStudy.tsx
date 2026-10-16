import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Trophy,
  CheckCircle2,
  Users,
  Layers,
  Cpu,
  Gauge,
  Compass,
  ArrowUpRight,
  Maximize2,
  Share2,
  ChevronRight,
  Gamepad2,
  Activity,
  Code2,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { playPop, playSuccessChime } from '../utils/soundFX';
import { smoothScrollTo } from '../utils/smoothScroll';

// Assets
import apexdrawnOg from '../assets/apexdrawn-og.png';
import apexdrawnIcon from '../assets/apexdrawn-icon.png';
import apexdrawnTrackCanvas from '../assets/apexdrawn-track-canvas.jpg';
import apexdrawnRacingAction from '../assets/apexdrawn-racing-action.jpg';
import apexdrawnExportPipeline from '../assets/apexdrawn-export-pipeline.jpg';

interface ApexDrawnCaseStudyProps {
  onBackToPortfolio: (sectionId?: string) => void;
  onNavigateToProject?: (projectId: string) => void;
}

export default function ApexDrawnCaseStudy({
  onBackToPortfolio,
  onNavigateToProject,
}: ApexDrawnCaseStudyProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture' | 'export'>('overview');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [inspectingImage, setInspectingImage] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleShare = async (title?: string, text?: string) => {
    playPop(520);
    const shareUrl = window.location.origin + '/projects/apexdrawn';
    const shareData = {
      title: title || 'ApexDrawn — Draw the track. Own the racing line.',
      text: text || 'Zero-install in-browser 3D racing game and procedural track creator by Kabir.',
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareFeedback('Shared successfully!');
        setTimeout(() => setShareFeedback(null), 2500);
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // User deliberately cancelled the share dialog - no error needed
          return;
        }
        // Fall back to clipboard if navigator.share fails or is restricted in iframe
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback('Link copied to clipboard!');
      } else {
        // Fallback for older browsers / strict iframe policies
        const input = document.createElement('textarea');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setShareFeedback('Link copied to clipboard!');
      }
    } catch {
      setShareFeedback('ApexDrawn: apexdrawn.com');
    }
    setTimeout(() => setShareFeedback(null), 2500);
  };

  const mediaGallery = [
    {
      id: 'starting-grid',
      title: 'Starting Grid & Official Identity',
      caption: 'The chequered line gantry looking down into the first corner of a player-drawn circuit.',
      image: apexdrawnOg,
      category: 'OFFICIAL MEDIA',
    },
    {
      id: 'track-canvas',
      title: '2D Spline Track Designer',
      caption: 'Freeform vector drawing canvas with bezier control points, individual corner banking, and elevation raises.',
      image: apexdrawnTrackCanvas,
      category: 'CIRCUIT DESIGNER',
    },
    {
      id: 'racing-action',
      title: 'In-Browser 3D Simulation Action',
      caption: 'Real-time chase camera behind a GT car with apex curbs, tire slip angles, and tachometer telemetry.',
      image: apexdrawnRacingAction,
      category: '3D RACING ENGINE',
    },
    {
      id: 'export-pipeline',
      title: 'BeamNG.drive & Assetto Corsa Pipeline',
      caption: '3D mesh packaging interface baking contour elevations and surface friction directly for racing sims.',
      image: apexdrawnExportPipeline,
      category: 'SIMULATOR EXPORT',
    },
  ];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-[#ffb020] selection:text-black pb-32">
      {/* Top Fixed Breadcrumb & Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              playPop(480);
              onBackToPortfolio('projects');
            }}
            data-interactive="true"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-amber-400/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-mono-code transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#ffb020]" />
            <span>BACK TO PROJECTS</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono-code text-zinc-500">
            <span>/</span>
            <span className="text-zinc-400">PROJECTS</span>
            <span>/</span>
            <span className="text-zinc-100 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffb020] animate-pulse" />
              APEXDRAWN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleShare('ApexDrawn — Draw the track. Own the racing line.', 'Zero-install in-browser 3D racing game and procedural track creator by Kabir.')}
            data-interactive="true"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-mono-code transition-all cursor-pointer shadow-sm"
            title="Share ApexDrawn"
          >
            <Share2 className="w-3.5 h-3.5 text-[#ffb020]" />
            <span className="hidden sm:inline">SHARE</span>
          </button>

          <a
            href="https://apexdrawn.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playPop(540)}
            data-interactive="true"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffb020] hover:bg-[#ffc14d] text-zinc-950 text-xs font-mono-code font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(255,176,32,0.25)]"
          >
            <span>LAUNCH LIVE GAME</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 space-y-16 sm:space-y-24">
        {/* =========================================================================
            SECTION A: CINEMATIC INTRODUCTION
            ========================================================================= */}
        <section className="space-y-8">
          {/* Top Tag & Status Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono-code text-[#ffb020]">
              <span className="w-2 h-2 rounded-full bg-[#ffb020] animate-ping" />
              <span>ACTIVE FLAGSHIP CASE STUDY</span>
            </div>
            <span className="text-xs font-mono-code text-zinc-500">//</span>
            <span className="text-xs font-mono-code text-zinc-400">WEB & 3D SIMULATION</span>
            <span className="text-xs font-mono-code text-zinc-500">//</span>
            <span className="text-xs font-mono-code text-zinc-400">2025 RELEASE</span>
          </div>

          {/* Title & Tagline Hierarchy */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={apexdrawnIcon}
                alt="ApexDrawn Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-zinc-700/80 shadow-2xl p-0.5 bg-black"
              />
              <div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white uppercase">
                  APEX<span className="text-[#ffb020]">DRAWN</span>
                </h1>
                <p className="text-base sm:text-2xl font-mono-code text-[#ffb020] font-medium tracking-wide">
                  Draw the track. Own the racing line.
                </p>
              </div>
            </div>

            <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-sans font-normal pt-2">
              A browser-based racing experience combining custom circuit creation, 3D driving,
              competitive time trials, and multiplayer racing. Built on WebGL and Three.js with zero
              downloads or account friction required.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://apexdrawn.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playPop(540)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffb020] hover:bg-[#ffc14d] text-zinc-950 text-xs font-mono-code font-bold uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(255,176,32,0.3)] group"
            >
              <span>PLAY APEXDRAWN LIVE</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={() => {
                playPop(480);
                smoothScrollTo('section-features', { offset: -80, duration: 0.9 });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono-code uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>EXPLORE CASE STUDY SPECS</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Hero Striking Visual Media Showcase */}
          <div className="relative rounded-2xl border border-zinc-700/80 bg-zinc-950 overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,176,32,0.15)] group">
            {/* Top Device Bar */}
            <div className="h-8 px-4 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between text-[11px] font-mono-code text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-zinc-300 font-semibold">apexdrawn.com</span>
              </div>
              <div className="flex items-center gap-2 text-[#ffb020]">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-wider">60 FPS WEBGL RUNTIME</span>
              </div>
            </div>

            {/* Selected Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={mediaGallery[activeMediaIndex].image}
                alt={mediaGallery[activeMediaIndex].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1 max-w-xl">
                  <div className="text-[10px] font-mono-code text-[#ffb020] uppercase tracking-wider font-bold">
                    {mediaGallery[activeMediaIndex].category}
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                    {mediaGallery[activeMediaIndex].title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {mediaGallery[activeMediaIndex].caption}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleShare(mediaGallery[activeMediaIndex].title, `ApexDrawn: ${mediaGallery[activeMediaIndex].title} - ${mediaGallery[activeMediaIndex].caption}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700 hover:border-zinc-500 text-xs font-mono-code text-zinc-200 hover:text-white backdrop-blur-md cursor-pointer transition-all"
                    title="Share Media"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#ffb020]" />
                    <span>SHARE</span>
                  </button>
                  <button
                    onClick={() => setInspectingImage(mediaGallery[activeMediaIndex].image)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700 hover:border-zinc-500 text-xs font-mono-code text-zinc-200 hover:text-white backdrop-blur-md cursor-pointer transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>EXPAND</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-zinc-900/90 border-t border-zinc-800">
              {mediaGallery.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playPop(500 + idx * 30);
                    setActiveMediaIndex(idx);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    activeMediaIndex === idx
                      ? 'bg-amber-950/40 border-[#ffb020] text-white shadow-md'
                      : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="aspect-video w-full rounded-md overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-mono-code font-bold truncate">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION B: PROJECT OVERVIEW & VALUE PROPOSITION
            ========================================================================= */}
        <section id="section-overview" className="border-t border-zinc-800/80 pt-12 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-[0.2em] text-[#ffb020] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020]" />
              <span>SECTION 01 // OVERVIEW & PURPOSE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-zinc-100">
              DEMOCRATIZING MOTORSPORT SIMULATION
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
              <p>
                Traditional racing simulators require multi-gigabyte installations, specialized steering
                wheels, and steep learning curves. ApexDrawn eliminates that friction entirely. By
                bringing real-time 3D vehicle physics and procedural mesh generation into the web browser,
                anyone can design a custom racetrack with their finger or mouse and immediately drive on it
                within seconds.
              </p>
              <p>
                Whether players are sketching tight hairpins, testing elevation climbs, or fine-tuning corner
                banking, ApexDrawn bridges the gap between casual arcade creativity and authentic simulator
                demands. With zero accounts required to start, cross-device responsiveness, and instant
                multiplayer party codes, the platform proves that sophisticated WebGL graphics and physics
                belong in the open web.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="text-xs font-mono-code uppercase tracking-wider text-zinc-400">
                  CORE VALUE DRIVERS //
                </div>
                <div className="space-y-2.5 text-xs font-mono-code">
                  <div className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-[#ffb020] shrink-0 mt-0.5" />
                    <span>Zero-Install: Instant gameplay across phone, tablet, or desktop</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-[#ffb020] shrink-0 mt-0.5" />
                    <span>Real-Time Extrusion: 2D vector spline turns to 3D track immediately</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-[#ffb020] shrink-0 mt-0.5" />
                    <span>Authentic Dynamics: Raycast wheels, slip angles, and brake bias</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-[#ffb020] shrink-0 mt-0.5" />
                    <span>Simulator Bridge: Direct export to BeamNG.drive & Assetto Corsa</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono-code text-[#ffb020] flex items-center justify-between">
                <span>OFFICIAL PLATFORM URL:</span>
                <a
                  href="https://apexdrawn.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline hover:text-white"
                >
                  apexdrawn.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION C: KEY VERIFIED FEATURES
            ========================================================================= */}
        <section id="section-features" className="border-t border-zinc-800/80 pt-12 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-[0.2em] text-[#ffb020] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020]" />
              <span>SECTION 02 // VERIFIED FEATURE MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-zinc-100">
              SIX CORE ARCHITECTURAL PILLARS
            </h2>
            <p className="text-xs font-mono-code text-zinc-400 mt-1">
              Every feature below is verified directly against the production platform at apexdrawn.com.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1: Track Designer */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 transition-all space-y-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffb020] group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                Procedural Track Designer
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Draw any circuit layout freehand with bezier nodes. Adjust road widths, corner smoothness,
                individual corner banking angles, and elevation profiles (hills, dips, and crests). Includes an
                image tracing overlay to recreate real-world circuits.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Spline Nodes</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Corner Banking</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Image Tracing</span>
              </div>
            </div>

            {/* Feature 2: 3D Driving Simulation */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 transition-all space-y-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffb020] group-hover:scale-105 transition-transform">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                3D Driving & Physics Simulation
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Immediate transition from 2D vector drawing to full 3D driving with no compile time.
                Custom raycast suspension physics simulate tire slip angles, kerb vibrations, weight transfer,
                and analog tachometer telemetry.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Three.js WebGL</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Raycast Physics</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Dynamic Cam</span>
              </div>
            </div>

            {/* Feature 3: Multiplayer */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 transition-all space-y-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffb020] group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                8-Player Live Multiplayer
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Host a multiplayer party with a simple 4-letter join code. Up to eight drivers race together
                on the player's custom circuit with live positions, driver nametags, real-time running orders,
                and seamless garage car changes without leaving the session.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">4-Letter Codes</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Running Order</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Low Latency</span>
              </div>
            </div>

            {/* Feature 4: Time Trials & Ghost Pace */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 transition-all space-y-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffb020] group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                Time Trials & Best-Lap Ghost
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Every circuit layout maintains its own persistent leaderboard of fastest laps. Drivers race
                against an interactive ghost representing their best lap delta, with precise sector split times
                and world records.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Ghost Car</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Sector Splits</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Leaderboards</span>
              </div>
            </div>

            {/* Feature 5: Diverse Vehicle Classes */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 transition-all space-y-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffb020] group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                Multi-Class Garage
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Each vehicle class features unique handling kinematics and power curves: agile racing karts,
                GT touring cars, Formula single-seaters, hot hatchbacks, prototype monsters, and superbikes.
                Custom liveries and colors are saved to player profiles.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Formula & GT</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">125cc Karts</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Bespoke Liveries</span>
              </div>
            </div>

            {/* Feature 6: Simulator Export Pipeline */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/50 transition-all space-y-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ffb020] group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                BeamNG & Assetto Corsa Export
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                A dedicated export serializer converts player-drawn circuits into standalone track packages
                for BeamNG.drive and Assetto Corsa, retaining 3D elevations, road banking, kerbs, barriers,
                and roadside trees.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">BeamNG.drive</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Assetto Corsa</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Mesh Packaging</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION D: DESIGN & USER EXPERIENCE
            ========================================================================= */}
        <section id="section-design" className="border-t border-zinc-800/80 pt-12 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-[0.2em] text-[#ffb020] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020]" />
              <span>SECTION 03 // DESIGN & INTERACTION DESIGN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-zinc-100">
              MINIMALIST RACING CAD MATRIX
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-[#0c0f12] border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400">
                  <Sliders className="w-4 h-4 text-[#ffb020]" />
                  <span>UI PARADIGM: ZERO DISTRACTION WORKFLOW</span>
                </div>
                <h4 className="text-lg font-display font-bold text-white">
                  Seamless State Switching
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                  The interface transitions effortlessly between a dark blueprint drafting board and high-speed
                  driving. Controls are docked into collapsible side rails to maximize canvas surface area,
                  ensuring smooth manipulation on small laptop screens and mobile touchscreens.
                </p>
                <div className="pt-2 border-t border-zinc-800/80 space-y-2 text-xs font-mono-code text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span>Touch Layout:</span>
                    <span className="text-zinc-200">Adaptive On-Screen Pedals & Steering</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Desktop Controls:</span>
                    <span className="text-zinc-200">Keyboard (WASD/Arrows) & Gamepad API</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>HUD Elements:</span>
                    <span className="text-zinc-200">Analog/Digital Tachometer, Sector Delta, Ghost</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-zinc-700/80 overflow-hidden bg-black shadow-xl">
                <img
                  src={apexdrawnTrackCanvas}
                  alt="Track Designer Canvas"
                  className="w-full h-auto object-cover"
                />
                <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 text-[10px] font-mono-code text-zinc-400 flex items-center justify-between">
                  <span>CANVAS TELEMETRY // 2D SPLINE BEZIER NODES</span>
                  <span className="text-[#ffb020]">STATUS: COMPILED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION E: TECHNICAL IMPLEMENTATION
            ========================================================================= */}
        <section id="section-tech" className="border-t border-zinc-800/80 pt-12 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-[0.2em] text-[#ffb020] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020]" />
              <span>SECTION 04 // TECHNICAL ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-zinc-100">
              UNDER THE HOOD: OBSERVABLE PIPELINE
            </h2>
            <p className="text-xs font-mono-code text-zinc-400 mt-1">
              Grounded strictly in observable browser code, client performance, and WebGL asset inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#ffb020]">
                <Code2 className="w-4 h-4" />
                <span>PROCEDURAL MESH GENERATION //</span>
              </div>
              <h4 className="text-base font-display font-bold text-zinc-100">
                2D Spline Extrusion to 3D Manifold
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                As the player draws, 2D coordinates are sampled into a continuous parametric curve. The engine
                generates orthogonal cross-sections at sampled intervals, applying elevation offsets and rotational
                transformations for corner banking. The resulting vertex buffer dynamically generates asphalt
                polygons, red-and-white curb extrusions, and collision colliders without heavy offline baking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#ffb020]">
                <Cpu className="w-4 h-4" />
                <span>CLIENT-SIDE VEHICLE KINEMATICS //</span>
              </div>
              <h4 className="text-base font-display font-bold text-zinc-100">
                Raycast Wheel Dynamics & Slip Angles
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Rather than treating the car as a rigid box sliding on ice, the simulator projects vertical
                raycasts from each suspension corner down to the track geometry. Spring-damper formulas calculate
                suspension compression, while Pacejka-inspired lateral friction models produce realistic drift,
                understeer, and weight transfer through chicanes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#ffb020]">
                <Zap className="w-4 h-4" />
                <span>REAL-TIME MULTIPLAYER PROTOCOL //</span>
              </div>
              <h4 className="text-base font-display font-bold text-zinc-100">
                Low-Bandwidth State Replication
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Multiplayer sessions use lightweight message channels to broadcast vehicle transforms
                (position, rotation, velocity, and steering angle) at high frequencies. Client-side dead reckoning
                and Hermite curve interpolation keep 8-car battles silky smooth even across variable mobile network
                latencies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#ffb020]">
                <Layers className="w-4 h-4" />
                <span>CROSS-SIMULATOR EXPORT ENGINE //</span>
              </div>
              <h4 className="text-base font-display font-bold text-zinc-100">
                BeamNG & Assetto Corsa Serializer
              </h4>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                ApexDrawn structures track data into portable vertex buffers. When the user requests an export,
                a client-side exporter builds game-engine specific folder structures: OBJ/FBX geometry with UV
                mapped road textures, terrain heightmaps, collision surfaces, and spawn-point definitions ready to
                be dropped into BeamNG.drive or Assetto Corsa.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION F: CHALLENGES & KEY LEARNINGS
            ========================================================================= */}
        <section id="section-challenges" className="border-t border-zinc-800/80 pt-12 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-[0.2em] text-[#ffb020] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb020]" />
              <span>SECTION 05 // ENGINEERING CHALLENGES & TAKEAWAYS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-zinc-100">
              CRITICAL TECHNICAL LESSONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
              <span className="text-xs font-mono-code text-[#ffb020] font-bold">01 // TOPOLOGY STABILITY</span>
              <h4 className="text-sm font-display font-bold text-white">Preventing Mesh Self-Intersection</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                In acute hairpins, naive road extrusion algorithms cause the inner boundary to overlap and twist.
                Resolving this requires dynamic spline subdivision and adaptive vertex spacing based on corner
                radius to guarantee manifold geometry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
              <span className="text-xs font-mono-code text-[#ffb020] font-bold">02 // 60 FPS PERFORMANCE BUDGET</span>
              <h4 className="text-sm font-display font-bold text-white">Lightweight Shaders & Draw Calls</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Mobile GPUs throttle rapidly under heavy post-processing. Grouping road meshes into shared
                instanced buffers and using optimized vertex shaders ensures smooth 60 FPS playback on mid-tier
                smartphones without burning battery life.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2.5">
              <span className="text-xs font-mono-code text-[#ffb020] font-bold">03 // INPUT ACCESSIBILITY</span>
              <h4 className="text-sm font-display font-bold text-white">Multi-Device Input Unification</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Balancing keyboard digital inputs, touchscreen virtual pedals, and analog gamepads requires
                dedicated input dampening and dynamic counter-steering assist to keep keyboard racers competitive
                against gamepad users.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION G: FINAL CALL TO ACTION & PROJECT CAROUSEL
            ========================================================================= */}
        <section className="border-t border-zinc-800/80 pt-16 space-y-12">
          {/* Main Visual Banner Card */}
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#1c1608] via-[#0f0e0c] to-[#070709] border border-amber-500/40 overflow-hidden shadow-2xl text-center space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-xs font-mono-code text-[#ffb020]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PLAY IN YOUR BROWSER NOW</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
                DRAW THE TRACK. <br />
                <span className="text-[#ffb020]">OWN THE RACING LINE.</span>
              </h3>

              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                Experience ApexDrawn firsthand. Draw your first circuit, race in 3D against the world
                leaderboards, host a multiplayer lobby with friends, or export your layout directly to BeamNG.drive.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <a
                  href="https://apexdrawn.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSuccessChime()}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ffb020] hover:bg-[#ffc14d] text-zinc-950 text-xs font-mono-code font-bold uppercase tracking-wider transition-all shadow-[0_0_35px_rgba(255,176,32,0.4)]"
                >
                  <span>LAUNCH APEXDRAWN (apexdrawn.com)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    playPop(480);
                    onBackToPortfolio('projects');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white text-xs font-mono-code uppercase tracking-wider transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#ffb020]" />
                  <span>BACK TO PORTFOLIO</span>
                </button>
              </div>
            </div>
          </div>

          {/* Previous / Next Project Navigation Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80">
            {/* Previous Project: FarmVerse */}
            <button
              onClick={() => {
                playPop(500);
                onBackToPortfolio('projects');
              }}
              className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/60 text-left transition-all cursor-pointer group space-y-1"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-zinc-400 uppercase">
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
                <span>PREVIOUS PROJECT</span>
              </div>
              <div className="text-base font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                FarmVerse — Agri Mitra AI Rover
              </div>
              <div className="text-xs font-mono-code text-zinc-500 truncate">
                Autonomous robotics & AI crop health telemetry
              </div>
            </button>

            {/* Next Project: T.E.R.R.A. */}
            <button
              onClick={() => {
                playPop(520);
                onBackToPortfolio('projects');
              }}
              className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/60 text-right transition-all cursor-pointer group space-y-1"
            >
              <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono-code text-zinc-400 uppercase">
                <span>NEXT PROJECT</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-base font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                T.E.R.R.A. Bio-Robotics
              </div>
              <div className="text-xs font-mono-code text-zinc-500 truncate">
                Terrain-enhancing robotic algae soil remediation
              </div>
            </button>
          </div>
        </section>
      </main>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {inspectingImage && (
          <div
            onClick={() => setInspectingImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden border border-zinc-700 bg-black shadow-2xl"
            >
              <img
                src={inspectingImage}
                alt="Enlarged view"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Toast Notification */}
      <AnimatePresence>
        {shareFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-[#ffb020]/60 text-white shadow-2xl font-mono-code text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#ffb020]" />
            <span>{shareFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
