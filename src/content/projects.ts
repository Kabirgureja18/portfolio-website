import { ProjectItem } from '../types';
import apexdrawnOg from '../assets/apexdrawn-og.png';
import apexdrawnTrackCanvas from '../assets/apexdrawn-track-canvas.jpg';
import apexdrawnRacingAction from '../assets/apexdrawn-racing-action.jpg';
import apexdrawnExportPipeline from '../assets/apexdrawn-export-pipeline.jpg';

export const projectsContent: ProjectItem[] = [
  {
    id: "apexdrawn",
    title: "ApexDrawn",
    subtitle: "Draw the track. Own the racing line.",
    category: "Web & Products",
    status: "ACTIVE",
    year: "2025",
    summary: "A browser-based racing experience combining custom circuit creation, 3D driving, competitive time trials, and multiplayer racing.",
    description: "ApexDrawn is a zero-install, browser-native 3D racing game and procedural track creator. Built on WebGL and Three.js, it empowers players to sketch racetracks freehand in 2D, customize road width, corner banking, elevation, and scenery, and instantly race on them in 3D across diverse vehicle classes. Features include real-time vehicle raycast dynamics, online multiplayer lobbies with party codes, global leaderboards with ghost deltas, and direct export pipelines to BeamNG.drive and Assetto Corsa.",
    highlights: [
      "Freehand 2D spline circuit editor with individual corner banking, elevation raises, and scenery placement",
      "Real-time 3D in-browser driving simulation powered by Three.js & client-side raycast vehicle physics",
      "Live multiplayer race lobbies supporting up to 8 drivers with real-time running order & party codes",
      "Per-circuit time trials with sector tracking, global leaderboards, and personal ghost pace comparison",
      "Simulator export pipeline converting user tracks directly into BeamNG.drive and Assetto Corsa packages"
    ],
    techStack: ["Three.js (WebGL)", "Procedural Spline Extrusion", "Raycast Vehicle Physics", "WebSockets Multiplayer", "TypeScript / JavaScript"],
    accentColor: "#ffb020",
    featured: true,
    visualType: "racing",
    liveUrl: "https://apexdrawn.com/",
    links: [
      { label: "Launch Live Game (apexdrawn.com)", url: "https://apexdrawn.com/", isExternal: true },
      { label: "View Detailed Case Study (/projects/apexdrawn)", url: "/projects/apexdrawn", isExternal: false },
      { label: "Inquire Architecture & Collab", url: "#contact" }
    ],
    clips: [
      {
        tag: "CIRCUIT DESIGNER",
        title: "2D Spline Track Canvas",
        caption: "Freeform circuit drafting with bezier control points, individual corner banking, and elevation profiles.",
        imageUrl: apexdrawnTrackCanvas,
        source: "ApexDrawn Procedural Canvas"
      },
      {
        tag: "3D SIMULATION",
        title: "In-Browser 3D Driving Action",
        caption: "Instant transition from 2D sketch to real-time 3D racing with tire slip, curb rumble, and tachometer telemetry.",
        imageUrl: apexdrawnRacingAction,
        source: "Three.js WebGL Simulation Engine"
      },
      {
        tag: "OFFICIAL RELEASE",
        title: "Starting Grid & Gantry",
        caption: "GT class racecar positioned on the start/finish line under the pit gantry on a player-created circuit.",
        imageUrl: apexdrawnOg,
        source: "apexdrawn.com Official Media"
      },
      {
        tag: "SIM EXPORT",
        title: "BeamNG & Assetto Corsa Pipeline",
        caption: "Direct export of user-drawn tracks including terrain elevation, asphalt friction, barriers, and scenery into sim racing engines.",
        imageUrl: apexdrawnExportPipeline,
        source: "Simulator Export Architecture"
      }
    ]
  },
  {
    id: "terra",
    title: "T.E.R.R.A.",
    subtitle: "Terrain-Enhancing Regeneration via Robotic Algae",
    category: "Climate & BioTech",
    status: "ACTIVE",
    year: "2025",
    summary: "Autonomous robotic delivery mechanism for cultivating micro-algae biofilms to combat soil degradation and accelerate desert soil carbon sequestration.",
    description: "T.E.R.R.A. stands for Terrain-Enhancing Regeneration via Robotic Algae. It combines field robotics, bio-compatible dispersal chambers, and environmental telemetry to inoculate arid terrain with cyanobacteria and micro-algae consortia, reviving sterile soil microbiomes.",
    highlights: [
      "Modular robotic payload designed for bio-slurry algae dispersal",
      "Sensor telemetry tracking moisture, temperature, and UV radiation",
      "Autonomous waypoint mapping across semi-arid terrain testbeds",
      "Low-power solar charging logic for extended outdoor test cycles"
    ],
    techStack: ["Robotics Hardware", "Bio-Engineering", "Microcontrollers", "Telemetry", "CAD Modeling"],
    accentColor: "#10b981",
    featured: true,
    visualType: "terra",
    links: [
      { label: "Launch Live Platform & Contact (terra-by-kabir.lovable.app)", url: "https://terra-by-kabir.lovable.app/#contact", isExternal: true },
      { label: "Inquire About Research", url: "#contact" }
    ],
    clips: [
      {
        tag: "BEFORE",
        title: "Barren Land Testbed",
        caption: "Degraded land — low moisture, no organic cover, compacted soil.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Drought.jpg/1280px-Drought.jpg",
        source: "ISRO Space Applications Centre Atlas Data"
      },
      {
        tag: "ACTION",
        title: "Autonomous Drone Spraying",
        caption: "An autonomous drone applies targeted treatment, zone by zone.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Agricultural_drone_spraying_on_paddy_field.jpg/1280px-Agricultural_drone_spraying_on_paddy_field.jpg",
        source: "Field Intervention Telemetry"
      },
      {
        tag: "AFTER",
        title: "Recovered Fertile Biome",
        caption: "Recovered land — vegetation returns, soil life rebuilds.",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=70",
        source: "Restoration Outcome Validation"
      },
      {
        tag: "STATION",
        title: "The T.E.R.R.A. Station Dock",
        caption: "Autonomous drone dock, wall-mounted environmental sensors, continuous bio-culture chamber, and AI zone prioritization.",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
        source: "T.E.R.R.A. Station Architecture"
      }
    ]
  },
  {
    id: "jarvis",
    title: "JARVIS",
    subtitle: "Personal Desktop AI Pet & Automation Companion",
    category: "AI & Software",
    status: "IN DEVELOPMENT",
    year: "2024–2025",
    summary: "A desktop-friendly AI companion with native voice synthesis, vision triggers, and automated system workflows.",
    description: "Inspired by futuristic personal assistants, JARVIS is a multi-modal desktop assistant engineered to execute system automations, monitor open project workspaces, answer contextual queries, and provide an interactive terminal persona.",
    highlights: [
      "Real-time voice synthesis and command parsing pipeline",
      "System automation hooks for workspace window orchestration",
      "Vision module prototyping for desktop context recognition",
      "Interactive status HUD with telemetry status indicators"
    ],
    techStack: ["Python", "Local LLM Tooling", "Voice Synthesis", "OS Automation", "Electron / Node.js"],
    accentColor: "#3b82f6",
    featured: true,
    visualType: "jarvis",
    links: [
      { label: "Inquire Architecture", url: "#contact" }
    ]
  },
  {
    id: "ai-browser",
    title: "AI-Based Browser",
    subtitle: "Contextual Intelligent Web Client",
    category: "AI & Software",
    status: "EXPERIMENTAL",
    year: "2024",
    summary: "Kabir's first custom browser client built from scratch with embedded contextual intelligence and page synthesis.",
    description: "An experimental web browsing interface that understands active page semantics, synthesizes multi-tab research simultaneously, and strips web clutter while providing an inline AI co-pilot.",
    highlights: [
      "Custom DOM extraction & content parsing engine",
      "Context-aware summarization & citation graph builder",
      "Tab clustering by research intent rather than URL domains"
    ],
    techStack: ["TypeScript", "Chromium Engine APIs", "AI Prompting Pipelines", "Tailwind CSS"],
    accentColor: "#f59e0b",
    featured: true,
    visualType: "browser",
    links: [
      { label: "Experiment Log", url: "#projects" }
    ]
  },
  {
    id: "farmverse",
    title: "FarmVerse",
    subtitle: "Agri Mitra — Autonomous AI Farming Rover (TechnoXian)",
    category: "Robotics & Hardware",
    status: "ACTIVE",
    year: "2024–2025",
    summary: "Autonomous solar-assisted farming rover engineered for TechnoXian. Combines dual Arduino microcontrollers, AI crop vision, precision spraying, and soil telemetry.",
    description: "FarmVerse powers Agri Mitra, an autonomous field-robotics platform designed to make soil smarter and harvests stronger. Engineered for the TechnoXian robotics competition and real-world agricultural plots, Agri Mitra runs a dual-microcontroller architecture (Navigation Arduino for obstacle-avoiding field kinematics + Task Arduino for soil sampling and precision solenoids). The system features on-device computer vision for disease detection, LoRa mesh soil sensing without internet reliance, and a multilingual conversational voice interface allowing farmers to speak to their farm in their regional dialect.",
    highlights: [
      "Agri Mitra Autonomous Rover with Dual-Arduino kinematics and concurrent task execution",
      "AI Soil Analysis & Crop Health Vision for spot-targeted micro-spraying",
      "Multilingual Voice Control Interface: 'Speak to your farm in your language'",
      "LoRa & ESP-NOW wireless sensor mesh transmitting NPK and moisture telemetry without internet",
      "Regenerative agriculture alignment: 40% water reduction & zero guesswork cultivation"
    ],
    techStack: ["Dual Arduino (Nav + Task)", "Computer Vision & Edge AI", "IoT Sensors & Solenoids", "LoRa / ESP-NOW", "TypeScript & React"],
    accentColor: "#10b981",
    featured: true,
    visualType: "farmverse",
    liveUrl: "https://farmverse-technoxian.lovable.app/",
    embed3dUrl: "https://sketchfab.com/models/406708b87ebe4f29a77d5ccb17e68378/embed?autostart=1&autospin=0.3&ui_infos=0&ui_controls=1&ui_stop=0&ui_watermark=0&ui_watermark_link=0",
    links: [
      { label: "Launch Live Platform (farmverse-technoxian.lovable.app)", url: "https://farmverse-technoxian.lovable.app/", isExternal: true },
      { label: "Explore TechnoXian Showcase", url: "https://farmverse-technoxian.lovable.app/#features", isExternal: true },
      { label: "Inquire About Agri Mitra", url: "#contact" }
    ],
    clips: [
      {
        tag: "3D ROVER",
        title: "Agri Mitra AI Rover",
        caption: "Autonomous multi-terrain rover with dual-Arduino electronics, tracked drive system, and precision spray boom.",
        imageUrl: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/24ee4793-860f-4f98-8e22-4d59a6192a4a/id-preview-6fc93ac1--2051cc84-6201-4cde-a4e2-2e3e85b72331.lovable.app-1784254633213.png",
        source: "TechnoXian Competition Prototype"
      },
      {
        tag: "ECOSYSTEM",
        title: "The FarmVerse Field Scene",
        caption: "Autonomous field navigation, real-time micro-climate monitoring, and automated irrigation loops.",
        imageUrl: "https://farmverse-technoxian.lovable.app/__l5e/assets-v1/6fddf9e9-033d-4756-ae3b-728074eefc46/farm-scene.png",
        source: "FarmVerse Architecture & Field Telemetry"
      },
      {
        tag: "DUAL-MCU",
        title: "Navigation & Task Hardware Stack",
        caption: "Dedicated Navigation Arduino handles wheel encoders & collision avoidance; Task Arduino drives soil probes, drill depth, and solenoid valves.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
        source: "Embedded Firmware Architecture"
      },
      {
        tag: "INTELLIGENCE",
        title: "AI Soil & Crop Vision Telemetry",
        caption: "Real-time edge classification for pest hotspots, nitrogen deficiency, and automated micro-irrigation scheduling without internet reliance.",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
        source: "Agri Mitra Edge AI Model"
      }
    ]
  },
  {
    id: "personal-ai",
    title: "Personal AI Core",
    subtitle: "Custom Multi-Agent Thought & Knowledge Laboratory",
    category: "Experimental",
    status: "IN DEVELOPMENT",
    year: "2025",
    summary: "A private, bespoke neural reasoning engine trained to index Kabir's notes, codebases, and experimental ideas.",
    description: "An ongoing effort to build an authentic personal AI engine that mirrors Kabir's reasoning patterns, indexes project blueprints, drafts robotics code, and assists in creative exploration.",
    highlights: [
      "Private vectorized knowledge repository for projects and code",
      "Multi-agent reasoning loops for hardware debugging",
      "Zero cloud leakage option for offline experimental tinkering"
    ],
    techStack: ["PyTorch", "Vector Embeddings", "Agentic Pipelines", "TypeScript"],
    accentColor: "#ec4899",
    featured: false,
    visualType: "jarvis",
    links: [
      { label: "Lab Roadmap", url: "#lab" }
    ]
  },
  {
    id: "student-web-agency",
    title: "Student Web Agency",
    subtitle: "Affordable High-Performance Websites for Peers & Creators",
    category: "Web & Products",
    status: "COMPLETED",
    year: "2023–2025",
    summary: "Commercial initiative building fast, bespoke web applications for students, clubs, and youth businesses at honest, accessible rates.",
    description: "Rejecting bloated enterprise fees, Kabir created an independent web design & engineering service for fellow student entrepreneurs, clubs, and local projects to obtain bespoke, production-ready web presences.",
    highlights: [
      "Crafted bespoke UI/UX designs tailored to student budgets",
      "Built with high-speed modern tech (React, Vite, Tailwind)",
      "Helped kickstart multiple student initiatives and portfolios"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "UI/UX Architecture"],
    accentColor: "#06b6d4",
    featured: false,
    visualType: "web",
    links: [
      { label: "Contact for Builds", url: "#contact" }
    ]
  }
];
