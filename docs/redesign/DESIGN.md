# Redesign: design direction and scroll choreography

Phase 2 of the cinematic rebuild. Content stays in `src/data/*` (verified against the career dossier);
this document covers the visual layer only.

## Concept: the engine (replaces the night city, 20 Oct 2026)

The subject builds AI systems in which a model proposes, code decides and a person approves the risky step,
and runs a live delivery platform alone. The home page is set inside one engine: a particle structure that
changes shape as the reader scrolls. Its three hues are that rule, used everywhere a diagram shows who acts:

| Token | Hex | Meaning |
|---|---|---|
| Void | `#05070C` | Page background, clear colour of the scene |
| Carbon / Panel | `#0B0F17` / `#10151F` | Raised surfaces: map panel, chart frames |
| Seam | `#1E2635` | Rules and borders |
| Snow | `#E9EDF3` | Primary text (16.9:1 on Void) |
| Ash | `#8B95A7` | Secondary text (6.6:1) |
| Volt | `#4F8CFF` | A model proposes; primary buttons |
| Ion | `#57DBE6` | Code decides; current state, case-study rings |
| Iris | `#A78BFA` | A person approves; in-progress work |

Type stays Archivo (variable width, self-hosted) for display and interface, Source Serif 4 for long reading.
The hero name animates its width axis once as the opening scrolls away.

## Home page choreography

One fixed canvas (`src/scene/Engine.ts`, plain three.js, one draw call of points plus link and plate lines)
behind ordinary sections. `src/scene/chapters.ts` maps each chapter to a shape; each chapter holds its shape
and travels to the next in its last 30%.

```
 chapter        engine shape                         DOM
 ──────────────────────────────────────────────────────────────────────────────────────────────────
 Introduction   core: three shells, ring armature,   name, one-sentence role, project map + résumé,
                signals crossing the links            colour key
 Domains        five stacked layers; some points     five domains, software at top, data at bottom,
                rise through them                     one measured result and five projects each
 Project map    flat disc of rings, dimmed           SVG map of all 53 projects (real buttons), domain
                                                      highlight, detail panel, archive links
 Featured,      wide quiet field                     Movigo (screenshots, counts), SettleAI (pipeline,
 How I build,                                         screenshot), CricXAI (calibration), Naman
 Experience                                           (pipeline, verifier result), RouteCore (benchmark);
                                                      six steps; role, timeline, education, credentials
 Contact        a ring seen from just above          availability, email, résumé, GitHub, LinkedIn
```

### Loading and fallbacks

- A still SVG of the core (`EnginePoster.tsx`) is prerendered, so first paint never waits on WebGL.
- The engine loads as its own chunk on idle. No WebGL2, a lost context, or frames under 20 fps after
  dropping the pixel ratio: the poster stays and every chapter still reads as an ordinary section.
- Phones get 2,400 points instead of 5,600 and a pixel ratio cap of 1.5; no pointer parallax on touch.
- Reduced motion: no unfold, drift, spin or travel; the engine cuts between still shapes per chapter.
- The render loop stops while the tab is hidden.

## Pages without WebGL

- **Archive** `/projects`: a 2D skyline strip at the top (one bar per project, same colour and height
  rules as the 3D towers) dims to the filtered set. Search, area, status, technology, case-studies-only;
  state lives in the URL query; live result count; reset; empty state with a way out. Rows, not cards.
- **Project pages** `/projects/:slug` for every published project: the existing case-study template where
  one exists, otherwise a compact record (summary, status, period, stack, links, notes, related).
- **Role pages** `/roles/:slug`: the role, a two-sentence fit statement from evidence, five projects with
  2-3 lines, skills and links each, relevant experience, contact. `?ref=` is ignored by rendering and
  excluded from the canonical URL.
- **Experience, Skills, Achievements, About, Contact**: the same dark editorial system.

## Review of this plan against generic defaults

- Dark page with one neon accent: replaced by three hues that each mean an area of work, used on data.
- Floating particles or a planet hero: the scene is the subject's own domain, and the towers are data.
- Card grids: rows, ledgers and diagrams instead; the only repeated shape is the project row.
- Fade-up on every section: removed. The camera is the only scroll-driven motion.
- ALL-CAPS eyebrows, middle-dot meta strings, monospace labels, arrows on every link: not used.
  External links carry an icon because they leave the site.
