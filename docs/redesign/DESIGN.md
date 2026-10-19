# Redesign: design direction and scroll choreography

Phase 2 of the cinematic rebuild. Content stays in `src/data/*` (verified against the career dossier);
this document covers the visual layer only.

## Concept: night shift

The subject's strongest evidence is a live delivery marketplace in Indore that he runs alone, plus agents
whose risky steps are decided by code or a person. The site is set in that world: a city at night, seen
from above, where one delivery is being dispatched.

The memorable element is the city itself. **Every lit tower is a published project.** Colour is its area,
height is how far it got (production tallest, coursework lowest). As the visitor scrolls the home page, the
districts light up chapter by chapter, until the whole archive is lit at the end. Everything around the city
stays quiet: dark editorial pages, few rules, no cards.

WebGL runs on the home page only. Archive, project, role and case-study pages are plain prerendered HTML.

## Tokens

### Colour

| Token | Hex | Role |
|---|---|---|
| Night | `#08111D` | Page background, fog colour of the 3D scene |
| Dusk | `#0F1C2C` | Raised surfaces: filters, figures, form |
| Kerb | `#1F3249` | Rules, borders, unlit tower faces |
| Paper | `#E8ECF1` | Primary text (16.0:1 on Night, 14.5:1 on Dusk) |
| Haze | `#9AACBF` | Secondary text (8.1:1 on Night, 7.4:1 on Dusk) |
| Sodium | `#F2B13C` | Production systems; the streetlight colour of the route |
| Signal | `#8EA8FF` | Agents and LLM applications |
| Field | `#57C99A` | Machine learning and data |
| Held | `#FF8A7A` | Limits, errors, "held" states |

Sodium, Signal and Field are the existing route/signal/field lines, raised in luminance for a dark page.
They always mean an area of work, both in the 3D city and in the DOM, and are never used as decoration.
Text never relies on them alone: every coloured mark has a text label.

### Type

- **Archivo** (variable, width 62-125). Display is ultra-condensed (width 64, weight 850). Small labels are
  expanded (width 118) in sentence case, which replaces all-caps eyebrows. The hero name animates its
  width axis once, on the scroll out of the opening scene.
- **Source Serif 4** for long-form reading on case studies and the About page, 19px, line height 1.7,
  measure 40rem.

Scale (ratio 4:3 from an 18px base): 13.5, 18, 24, 32, 42, 56, 75, then fluid display sizes for page titles
and the hero name.

### Layout

- Content sits left, in the first 5-7 of 12 columns; the 3D city fills the full viewport behind it and owns
  the right side on desktop. On phones, text sits over a scrim at the bottom of the viewport.
- 16px gutters below 640px, 32px to 1024px, 48px above. Content max width 84rem.
- Left aligned everywhere. Nothing is centred except the scroll cue.

### Motion

- One orchestrated moment: the opening, where the route draws from a retailer to a driver while the name
  settles. After that, motion is the camera following the reader's scroll; DOM content does not fade in
  section by section.
- Easing `cubic-bezier(.2,.7,.2,1)` for interface responses, 160-260ms.
- `prefers-reduced-motion`: no camera travel, the scene cuts between still compositions per chapter,
  routes are drawn in full, nothing loops.

## Home page choreography

One fixed canvas behind normal document flow. No pinned sections. The camera's position is interpolated
between chapter keyframes from the scroll position of each chapter's anchor, in a single
`requestAnimationFrame` loop outside React.

```
 chapter        camera                        world                              DOM
 ───────────────────────────────────────────────────────────────────────────────────────────────────────
 Opening        high oblique, slow drift      one dispatch: booking pin, fixed  name, one-sentence role,
                                              dispatch-radius ring, route draws  "See the work", "All N projects"
 Movigo         descends along the route      4 production towers light Sodium  lede, 4 counted facts,
                                                                                 3 optimisation lines, case study
 Agents         rises to a crossroads         gates stand on the route: Signal   SettleAI feature; ToolForge, Naman,
                                              = model, Sodium = rule, Paper =    VoiceDesk, docIQ as flow rows
                                              person. Scroll moves the route
                                              head; it stops at the person gate
 Models         swings to the east district   ML and data towers light Field    CricXAI calibration, RouteCore
                                                                                 benchmark, Refera ledger
 Archive        pulls up to near top-down     every published tower lit          "Every light is a project": real
                                                                                 counts by area and status, legend
 Career         tracks along the main avenue  route lights the avenue            Movigo title progression, timeline
 Credentials    holds, canvas dimmed          (static)                           skills summary, certificates,
                                                                                 hackathon in progress
 Close          far above, whole city lit     (static, one slow pulse)           email, form, profiles
```

```
 desktop, opening                                   phone, opening
 ┌──────────────────────────────────────────────┐   ┌────────────────────┐
 │ ■ Mokshit Sharma    Work Experience …  Résumé│   │ ■ M. Sharma     ≡  │
 │                                    ╱╲  ░░    │   │    ░░ city ░░      │
 │                         ░░  ░░ ╱╲ ░░  ╱╲ ░░ │   │  ░░  ╱╲ ░░ ╱╲      │
 │                   ░░ ╱╲ ═══route═══●  ░░    ◦ │   │ ══route══●         │
 │ Mokshit           ░░  ◎ booking  ░░  ╱╲     ◦ │   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
 │ Sharma                                      ◦ │   │ Mokshit            │
 │ Founding Engineer & Tech Lead at Movigo …   ◦ │   │ Sharma             │
 │ [See the work]  All 53 projects             ◦ │   │ Founding Engineer… │
 │                         scroll          chapter rail                    │   │ [See the work]     │
 └──────────────────────────────────────────────┘   └────────────────────┘
```

The chapter rail (right edge, desktop) lists the chapter names, marks the current one with
`aria-current`, and each entry is a link to that chapter's anchor. On phones it collapses into a
progress line under the header.

### Loading and fallbacks

- The opening text and a still poster (CSS gradient plus an inline SVG street grid) are in the
  prerendered HTML, so first paint and LCP never wait on WebGL.
- `three` loads as a separate chunk after first paint (`requestIdleCallback`, with a timeout), then the
  canvas fades in over the poster.
- No WebGL, a context loss, or a sustained frame time above 33ms for 2 seconds: the poster stays and the
  chapters keep working as ordinary sections.
- The render loop pauses when the tab is hidden and when the canvas is fully covered.
- Phones get a smaller grid, device pixel ratio capped at 1.5, no pointer parallax.

### Why plain three.js, not React Three Fiber or GSAP

The scene is one imperative object with a camera driven by scroll. A declarative scene graph and a
timeline library would add about 100 kB and a second scheduling system for what amounts to interpolating
eight keyframes and updating four shader uniforms. One rAF loop outside React keeps re-renders at zero.

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
