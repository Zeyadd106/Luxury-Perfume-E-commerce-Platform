// Generates the site's visual assets as local SVG "photography".
// Run: node scripts/generate-assets.mjs
// Deterministic — same output every run. Safe to re-run.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p) => join(root, "public", "images", p);

function ensure(p) {
  mkdirSync(dirname(p), { recursive: true });
  return p;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* ---------------------------------- bottle --------------------------------- */

// Elegant flacon rendered on a moody editorial backdrop.
// variant: "front" | "detail" | "side"
function bottle({
  bgTop,
  bgBottom,
  glow,
  glass,
  glassDark,
  cap,
  label,
  serif,
  sans,
  variant = "front",
  name,
}) {
  const W = 800;
  const H = 1000;
  const isDetail = variant === "detail";
  const isSide = variant === "side";

  // backdrop
  const bg = `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${bgTop}"/>
        <stop offset="1" stop-color="${bgBottom}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="${isDetail ? 0.62 : 0.42}" r="0.55">
        <stop offset="0" stop-color="${glow}" stop-opacity="0.5"/>
        <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${glassDark}"/>
        <stop offset="0.18" stop-color="${glass}"/>
        <stop offset="0.5" stop-color="${glass}" stop-opacity="0.85"/>
        <stop offset="0.82" stop-color="${glassDark}"/>
        <stop offset="1" stop-color="${glassDark}"/>
      </linearGradient>
      <linearGradient id="liquidG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${glass}" stop-opacity="0.95"/>
        <stop offset="1" stop-color="${glassDark}"/>
      </linearGradient>
      <linearGradient id="capG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${cap}" stop-opacity="0.7"/>
        <stop offset="0.5" stop-color="${cap}"/>
        <stop offset="1" stop-color="${cap}" stop-opacity="0.65"/>
      </linearGradient>
      <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </linearGradient>
      <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="18"/>
      </filter>
      <filter id="soft2" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="6"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${[...Array(9)]
      .map((_, i) => {
        const x = 60 + i * 90;
        return `<line x1="${x}" y1="0" x2="${x - 160}" y2="${H}" stroke="#fff" stroke-opacity="0.025" stroke-width="1"/>`;
      })
      .join("")}
  `;

  // bottle geometry — centered; detail variant zooms into upper half
  const scale = isDetail ? 1.9 : isSide ? 0.92 : 1;
  const cx = isDetail ? 560 : 400;
  const baseY = isDetail ? 1120 : 830;

  const bottleBody = `
    <g transform="translate(${cx} ${baseY}) scale(${scale})">
      <!-- shadow -->
      <ellipse cx="0" cy="14" rx="150" ry="26" fill="#000" opacity="0.5" filter="url(#soft)"/>
      <!-- body -->
      <path d="M -118 0 L -118 -300 Q -118 -330 -88 -330 L 88 -330 Q 118 -330 118 -300 L 118 0 Q 118 26 92 26 L -92 26 Q -118 26 -118 0 Z"
        fill="url(#liquidG)" opacity="0.92"/>
      <path d="M -118 0 L -118 -300 Q -118 -330 -88 -330 L -60 -330 L -60 26 L -92 26 Q -118 26 -118 0 Z"
        fill="${glassDark}" opacity="0.55"/>
      <!-- glass highlight -->
      <rect x="-96" y="-318" width="26" height="330" rx="13" fill="#fff" opacity="0.28" filter="url(#soft2)"/>
      <rect x="58" y="-300" width="10" height="300" rx="5" fill="#fff" opacity="0.12" filter="url(#soft2)"/>
      <!-- shoulder/neck -->
      <rect x="-34" y="-430" width="68" height="104" fill="url(#glassG)"/>
      <rect x="-34" y="-430" width="14" height="104" fill="#fff" opacity="0.2" filter="url(#soft2)"/>
      <!-- collar -->
      <rect x="-46" y="-452" width="92" height="26" rx="6" fill="url(#capG)"/>
      <!-- cap -->
      <rect x="-52" y="-640" width="104" height="192" rx="10" fill="url(#capG)"/>
      <rect x="-52" y="-640" width="16" height="192" rx="8" fill="#fff" opacity="0.22" filter="url(#soft2)"/>
      <rect x="-52" y="-560" width="104" height="4" fill="#000" opacity="0.18"/>
      <rect x="-52" y="-470" width="104" height="4" fill="#000" opacity="0.18"/>
      <!-- label -->
      <rect x="-84" y="-240" width="168" height="150" fill="#f4efe6" opacity="0.96"/>
      <rect x="-84" y="-240" width="168" height="150" fill="none" stroke="${cap}" stroke-opacity="0.4" stroke-width="1"/>
      <text x="0" y="-196" text-anchor="middle" font-family="${serif}" font-size="26" letter-spacing="6" fill="#1c1a17">${esc(name)}</text>
      <line x1="-52" y1="-176" x2="52" y2="-176" stroke="${cap}" stroke-width="1" opacity="0.7"/>
      <text x="0" y="-158" text-anchor="middle" font-family="${sans}" font-size="11" letter-spacing="4" fill="#6b6459">EAU DE PARFUM</text>
      <text x="0" y="-120" text-anchor="middle" font-family="${sans}" font-size="9" letter-spacing="2" fill="#8a8172">${esc(label)}</text>
    </g>
  `;

  // floor fade + vignette
  const floor = `
    <rect x="0" y="880" width="${W}" height="120" fill="url(#floorG)"/>
    <rect width="${W}" height="${H}" fill="none" stroke="#000" stroke-opacity="0.25"/>
    <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#fff" stroke-opacity="0.06"/>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${bg}${bottleBody}${floor}</svg>`;
}

/* ---------------------------------- scenes --------------------------------- */

function scene({
  bgTop,
  bgBottom,
  accent,
  motif, // "bottle" | "waves" | "columns" | "arch" | "petals" | "minimal"
  bottleSvg,
  text,
}) {
  const W = 1600;
  const H = 1100;
  let deco = "";

  if (motif === "waves") {
    deco = [...Array(7)]
      .map((_, i) => {
        const y = 220 + i * 120;
        return `<path d="M -50 ${y} C 400 ${y - 90}, 1100 ${y + 90}, 1650 ${y - 30}" fill="none" stroke="${accent}" stroke-opacity="${0.1 - i * 0.008}" stroke-width="1.5"/>`;
      })
      .join("");
  } else if (motif === "columns") {
    deco = [...Array(6)]
      .map((_, i) => {
        const x = 140 + i * 260;
        return `<rect x="${x}" y="120" width="70" height="860" fill="#fff" opacity="0.03"/><rect x="${x}" y="120" width="70" height="860" fill="none" stroke="#fff" stroke-opacity="0.07"/>`;
      })
      .join("");
  } else if (motif === "arch") {
    deco = `
      <path d="M 380 980 L 380 420 Q 800 120 1220 420 L 1220 980 Z" fill="#fff" opacity="0.04"/>
      <path d="M 380 980 L 380 420 Q 800 120 1220 420 L 1220 980" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="1.5"/>
      <path d="M 440 980 L 440 450 Q 800 190 1160 450 L 1160 980" fill="none" stroke="#fff" stroke-opacity="0.12"/>`;
  } else if (motif === "petals") {
    deco = [...Array(14)]
      .map((_, i) => {
        const x = (i * 173) % 1600;
        const y = (i * 97) % 1100;
        const r = 6 + (i % 4) * 4;
        return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" fill="${accent}" opacity="${0.08 + (i % 3) * 0.05}" transform="rotate(${i * 31} ${x} ${y})"/>`;
      })
      .join("");
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${bgTop}"/><stop offset="1" stop-color="${bgBottom}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stop-color="${accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="30"/></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${deco}
    ${bottleSvg ? `<g opacity="0.95">${bottleSvg}</g>` : ""}
    ${text || ""}
    <rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="#fff" stroke-opacity="0.08"/>
  </svg>`;
}

/* ---------------------------------- palette -------------------------------- */

const GOLD = "#c6a46c";

const products = [
  { slug: "noir-absolu", name: "NOIR", variant: "front", bgTop: "#1d1a17", bgBottom: "#0c0b0a", glow: "#8a6d3b", glass: "#3a3129", glassDark: "#171310", cap: GOLD, label: "Bois · Ambre · Vanille", serif: "Georgia", sans: "Arial" },
  { slug: "noir-absolu", name: "NOIR", variant: "detail", bgTop: "#241f1a", bgBottom: "#100e0c", glow: "#a8843f", glass: "#4a3d2c", glassDark: "#1c1712", cap: GOLD, label: "Extrait de Parfum", serif: "Georgia", sans: "Arial" },
  { slug: "fleur-de-lune", name: "LUNE", variant: "front", bgTop: "#221f24", bgBottom: "#0f0e11", glow: "#9d8bb8", glass: "#8d8296", glassDark: "#2a2630", cap: "#d8cfc0", label: "Rose · Jasmin · Musc", serif: "Georgia", sans: "Arial" },
  { slug: "fleur-de-lune", name: "LUNE", variant: "side", bgTop: "#2a2630", bgBottom: "#121016", glow: "#b7a8cc", glass: "#a396ad", glassDark: "#332e3a", cap: "#d8cfc0", label: "Eau de Parfum", serif: "Georgia", sans: "Arial" },
  { slug: "oud-royal", name: "OUD", variant: "front", bgTop: "#241a12", bgBottom: "#0e0a07", glow: "#b07840", glass: "#5e4326", glassDark: "#241a10", cap: "#8a5a2b", label: "Oud · Safran · Cuir", serif: "Georgia", sans: "Arial" },
  { slug: "oud-royal", name: "OUD", variant: "detail", bgTop: "#2c2015", bgBottom: "#120d08", glow: "#c98d4e", glass: "#6e4d2c", glassDark: "#2a1e12", cap: "#8a5a2b", label: "Collection Privée", serif: "Georgia", sans: "Arial" },
  { slug: "citrus-eternel", name: "ZESTE", variant: "front", bgTop: "#e9e4d8", bgBottom: "#cfc7b4", glow: "#d9b36a", glass: "#d9d2c0", glassDark: "#a89f8a", cap: "#3a352c", label: "Bergamote · Cédrat · Neroli", serif: "Georgia", sans: "Arial" },
  { slug: "citrus-eternel", name: "ZESTE", variant: "side", bgTop: "#efeadd", bgBottom: "#d8d0bc", glow: "#e3c078", glass: "#e4ddcc", glassDark: "#b5ac97", cap: "#3a352c", label: "Eau de Toilette", serif: "Georgia", sans: "Arial" },
  { slug: "vanille-gourmande", name: "DOUCEUR", variant: "front", bgTop: "#2b211b", bgBottom: "#120e0b", glow: "#c98d5a", glass: "#7a5b40", glassDark: "#2e2318", cap: "#6e4a2f", label: "Vanille · Caramel · Fève", serif: "Georgia", sans: "Arial" },
  { slug: "vanille-gourmande", name: "DOUCEUR", variant: "detail", bgTop: "#33271e", bgBottom: "#151009", glow: "#d9a06b", glass: "#8a6a4c", glassDark: "#352a1d", cap: "#6e4a2f", label: "Extrait de Parfum", serif: "Georgia", sans: "Arial" },
  { slug: "fougere-sauvage", name: "FLEUR", variant: "front", bgTop: "#1c2420", bgBottom: "#0b0f0d", glow: "#7d9b6a", glass: "#5c7057", glassDark: "#1a241e", cap: "#3f4a3d", label: "Lavande · Géranium · Chêne", serif: "Georgia", sans: "Arial" },
  { slug: "fougere-sauvage", name: "FLEUR", variant: "side", bgTop: "#222c26", bgBottom: "#0d130f", glow: "#8fae7d", glass: "#6c8267", glassDark: "#202c24", cap: "#3f4a3d", label: "Eau de Parfum", serif: "Georgia", sans: "Arial" },
  { slug: "ambre-dore", name: "AMBRE", variant: "front", bgTop: "#2a2118", bgBottom: "#120e08", glow: "#d9a75e", glass: "#a8813f", glassDark: "#3a2c17", cap: GOLD, label: "Ambre · Ciste · Benjoin", serif: "Georgia", sans: "Arial" },
  { slug: "ambre-dore", name: "AMBRE", variant: "detail", bgTop: "#33291b", bgBottom: "#161009", glow: "#e8b96e", glass: "#b98f4a", glassDark: "#42331b", cap: GOLD, label: "Collection Signature", serif: "Georgia", sans: "Arial" },
  { slug: "rose-imperiale", name: "ROSE", variant: "front", bgTop: "#2e1f22", bgBottom: "#130c0e", glow: "#c07d8a", glass: "#8a5f68", glassDark: "#331f26", cap: "#d9c8b4", label: "Rose · Pivoine · Patchouli", serif: "Georgia", sans: "Arial" },
  { slug: "rose-imperiale", name: "ROSE", variant: "side", bgTop: "#381f25", bgBottom: "#170c0f", glow: "#d18d9a", glass: "#96616d", glassDark: "#3d232b", cap: "#d9c8b4", label: "Eau de Parfum", serif: "Georgia", sans: "Arial" },
  { slug: "santal-blanc", name: "SANTAL", variant: "front", bgTop: "#efe9dc", bgBottom: "#d6cdb8", glow: "#cbb287", glass: "#cfc4ab", glassDark: "#a3977d", cap: "#4a4238", label: "Santal · Cuir · Mousse", serif: "Georgia", sans: "Arial" },
  { slug: "santal-blanc", name: "SANTAL", variant: "detail", bgTop: "#f6f1e6", bgBottom: "#ddd4c0", glow: "#dcc99b", glass: "#ddd2ba", glassDark: "#b3a68c", cap: "#4a4238", label: "Extrait de Parfum", serif: "Georgia", sans: "Arial" },
  { slug: "bergamote-verte", name: "VERVE", variant: "front", bgTop: "#e7ecdf", bgBottom: "#cdd6c2", glow: "#a9bd8f", glass: "#dfe4d2", glassDark: "#aab59a", cap: "#55604c", label: "Bergamote · Basilic · Thé", serif: "Georgia", sans: "Arial" },
  { slug: "bergamote-verte", name: "VERVE", variant: "side", bgTop: "#eef1e7", bgBottom: "#d4dcc9", glow: "#bcd0a4", glass: "#e8ecdc", glassDark: "#b8c2a6", cap: "#55604c", label: "Eau de Toilette", serif: "Georgia", sans: "Arial" },
  { slug: "jasmin-de-minuit", name: "JASMIN", variant: "front", bgTop: "#262019", bgBottom: "#100d09", glow: "#d9b878", glass: "#6e5a38", glassDark: "#241d12", cap: "#7a5c2e", label: "Jasmin · Tuberose · Vanille", serif: "Georgia", sans: "Arial" },
  { slug: "jasmin-de-minuit", name: "JASMIN", variant: "detail", bgTop: "#2e261b", bgBottom: "#14100a", glow: "#e5c684", glass: "#7d6840", glassDark: "#2a2115", cap: "#7a5c2e", label: "Collection Privée", serif: "Georgia", sans: "Arial" },
  { slug: "encens-sacré", name: "ENCENS", variant: "front", bgTop: "#211d1b", bgBottom: "#0d0b0a", glow: "#a08a70", glass: "#5f5648", glassDark: "#1e1a17", cap: "#8a7a5c", label: "Encens · Ciste · Labdanum", serif: "Georgia", sans: "Arial" },
  { slug: "encens-sacré", name: "ENCENS", variant: "side", bgTop: "#2a2522", bgBottom: "#110f0d", glow: "#b09c80", glass: "#6e6455", glassDark: "#26211d", cap: "#8a7a5c", label: "Eau de Parfum", serif: "Georgia", sans: "Arial" },
];

// one hero bottle (large) for scenes
const heroBottle = bottle({
  bgTop: "#1a1714", bgBottom: "#0a0908", glow: "#8a6d3b",
  glass: "#4a3d2c", glassDark: "#161310", cap: GOLD,
  label: "Extrait de Parfum", serif: "Georgia", sans: "Arial", name: "ATELIER",
});
const amberBottle = bottle({
  bgTop: "#2a2118", bgBottom: "#0f0b06", glow: "#d9a75e",
  glass: "#a8813f", glassDark: "#33271a", cap: GOLD,
  label: "Collection Signature", serif: "Georgia", sans: "Arial", name: "AMBRE",
});

/* ---------------------------------- scenes --------------------------------- */

const scenes = [
  {
    file: "hero-main.svg",
    svg: scene({ bgTop: "#17140f", bgBottom: "#080706", accent: GOLD, motif: "arch", bottleSvg: heroBottle }),
  },
  {
    file: "hero-alt.svg",
    svg: scene({ bgTop: "#f1ebdd", bgBottom: "#d9d0ba", accent: "#b98d4f", motif: "columns", bottleSvg: amberBottle }),
  },
  {
    file: "campaign-1.svg",
    svg: scene({ bgTop: "#1d1712", bgBottom: "#0b0806", accent: "#c98d5a", motif: "waves", bottleSvg: amberBottle }),
  },
  {
    file: "campaign-2.svg",
    svg: scene({ bgTop: "#efe9dc", bgBottom: "#d4c9b2", accent: "#8a6d3b", motif: "petals" }),
  },
  {
    file: "story-1.svg",
    svg: scene({ bgTop: "#141210", bgBottom: "#070605", accent: "#b09c80", motif: "minimal" }),
  },
  {
    file: "story-2.svg",
    svg: scene({ bgTop: "#ece5d5", bgBottom: "#d3c8b0", accent: "#a8843f", motif: "waves" }),
  },
  {
    file: "collection-signature.svg",
    svg: scene({ bgTop: "#181410", bgBottom: "#090705", accent: GOLD, motif: "arch", bottleSvg: heroBottle }),
  },
  {
    file: "collection-private.svg",
    svg: scene({ bgTop: "#241a12", bgBottom: "#0e0906", accent: "#b07840", motif: "columns", bottleSvg: amberBottle }),
  },
  {
    file: "collection-oud.svg",
    svg: scene({ bgTop: "#1f150e", bgBottom: "#0c0705", accent: "#a05c28", motif: "waves" }),
  },
  {
    file: "collection-limited.svg",
    svg: scene({ bgTop: "#2b2118", bgBottom: "#120d08", accent: "#d9a75e", motif: "petals", bottleSvg: amberBottle }),
  },
  {
    file: "collection-summer.svg",
    svg: scene({ bgTop: "#e9e4d8", bgBottom: "#cfc5ad", accent: "#7d9b6a", motif: "waves" }),
  },
  {
    file: "collection-new.svg",
    svg: scene({ bgTop: "#221f24", bgBottom: "#0f0d11", accent: "#9d8bb8", motif: "arch" }),
  },
  ...[1, 2, 3, 4, 5, 6].map((i) => ({
    file: `social-${i}.svg`,
    svg: scene({
      bgTop: ["#181410", "#f0ead9", "#241a12", "#221f24", "#e9e4d8", "#141210"][i - 1],
      bgBottom: ["#090705", "#d5cbb6", "#0e0906", "#0f0d11", "#cfc5ad", "#070605"][i - 1],
      accent: [GOLD, "#a8843f", "#b07840", "#9d8bb8", "#7d9b6a", "#b09c80"][i - 1],
      motif: ["petals", "columns", "waves", "arch", "minimal", "waves"][i - 1],
      bottleSvg: i % 2 === 0 ? amberBottle : heroBottle,
    }),
  })),
];

/* ----------------------------------- write ---------------------------------- */

const bySlug = new Map();
for (const p of products) {
  if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
}
for (const [slug, p] of bySlug) {
  const variants = [...new Set(products.filter((x) => x.slug === slug).map((x) => x.variant))];
  for (const variant of variants) {
    writeFileSync(ensure(out(join("products", slug, `${variant}.svg`))), bottle({ ...p, variant }));
  }
}

for (const s of scenes) {
  writeFileSync(ensure(out(s.file)), s.svg);
}

console.log(`Generated ${products.length * 2} product images + ${scenes.length} scenes.`);
