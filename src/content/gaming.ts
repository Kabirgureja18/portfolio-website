export interface GameItem {
  id: string;
  title: string;
  genre: string;
  hoursNote: string;
  tagline: string;
  iconType: string;
}

export const gamingContent = {
  headline: "THE GAMING SANCTUARY",
  description: "When not writing code or wiring microcontrollers, Kabir decompresses inside competitive battlegrounds and expansive sandbox universes.",
  status: "ONLINE / CASUAL COMPETITIVE",
  games: [
    {
      id: "minecraft",
      title: "Minecraft & Sandbox",
      genre: "Creative Sandbox / Redstone Logic",
      hoursNote: "Countless engineering hours",
      tagline: "Building complex automated redstone contraptions before writing real Python code.",
      iconType: "cube"
    },
    {
      id: "sim-racing",
      title: "Sim Racing & Track Driving",
      genre: "Physics Simulation & Time Trials",
      hoursNote: "Apex Precision",
      tagline: "Mastering weight transfer, brake bias, and optimal racing lines across virtual circuits.",
      iconType: "wheel"
    },
    {
      id: "tactical-shooters",
      title: "Tactical Shooters & Esports",
      genre: "High-APM Reflex & Squad Strategy",
      hoursNote: "Ranked Competitive",
      tagline: "Precision crosshair placement, clutch team communications, and instant tactical adjustments.",
      iconType: "crosshair"
    },
    {
      id: "story-rpgs",
      title: "Narrative & Sci-Fi RPGs",
      genre: "Immersive Worldbuilding",
      hoursNote: "Lore Enthusiast",
      tagline: "Studying rich game economies, branching dialogues, and interactive storytelling.",
      iconType: "sword"
    }
  ]
};
