# Redesign: design direction and scroll choreography

Phase 2 of the cinematic rebuild. Content stays in `src/data/*` (verified against the career dossier);
this document covers the visual layer only.

## Concept: the Architect's Residence (replaces the engine, 20 Oct 2026)

The portfolio is a contemporary house at dusk. The visitor reads a nameplate, watches a walnut pivot door open,
walks a gallery of five framed skill areas, reaches an atrium with four doors (one per kind of project), enters
each room, sits in the study, and leaves through a courtyard whose wall sinks and whose roof lifts away.
Architecture is the frame; every fact is ordinary HTML from `src/data`.

| Token | Hex | Role |
|---|---|---|
| Soot | `#0D0C0B` | Page background |
| Char / Plinth | `#171614` / `#211F1C` | Panels, frames, doorways |
| Joint | `#34302B` | Rules and borders |
| Bone | `#EFE9DF` | Primary text (16.4:1 on Soot) |
| Stone | `#A49E95` | Secondary text (7.4:1) |
| Brass | `#C9A46A` | Warm light, primary buttons, code-decides marks |
| Walnut | `#8A5C3B` | Frames, the door |
| Glass | `#7CC6D2` | The one cool accent: model-proposes marks, ML room |

Type: Source Serif 4 at its display optical size for headings; Archivo for interface and body; Archivo
expanded caps only for the nameplate and door signs (lettering on a wall). Fonts are self-hosted.

## Scroll choreography

`src/scene/Residence.ts` is one procedural three.js scene (boxes with canvas-drawn concrete, walnut and stone
textures; no downloaded assets). It is driven by a single station number `s` (`src/scene/chapters.ts`), and
everything is a pure function of `s`, so scrolling back reverses it: camera along a Catmull-Rom path through 14
stations, the door angle and light spill, frame lighting, room glow, the courtyard unfolding. The gallery's
station comes from where its HTML frames sit on screen, so the camera stands at the frame being read.

```
 chapter          station   scene                                   HTML
 arrival           0        dusk exterior, nameplate wall, glass    nameplate (h1), role, Open the door, résumé
 entrance          0 → 1    pivot door opens, light spills          directory of every room (direct links)
 gallery           2 → 6    hallway, five frames light in turn      five framed domains: skills, result, projects
 corridor          7        atrium, four lit doorways               four door links with counts and previews
 rooms             8 → 11   camera at each doorway, room glows      featured projects with their own evidence
 study             12       desk, lamp, shelves, frames             role, timeline, education, certificates
 courtyard         13       wall sinks, roof lifts, pool, sky       availability, email, résumé, profiles
```

Fallbacks: a prerendered SVG elevation shows first and stays without WebGL2 or on slow devices (pixel ratio and
shadows drop first, then the scene stops). Phones: no shadows, no antialiasing, pixel ratio capped at 1.5.
Reduced motion: no camera travel; the scene cuts to the station of each chapter. Navigation: header, a room list
on the right (a Rooms button on phones), the entrance directory and door links all use ordinary anchors.

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
