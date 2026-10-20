# Redesign: design direction and scroll choreography

Content stays in `src/data/*` (verified against the career dossier); this document covers the visual layer. Updated
21 Oct 2026 to match the implementation on the `redesign` branch.

## Concept: the Architect's Residence in daylight

The portfolio is a contemporary house in morning light. The visitor stops at a limestone gateway with the nameplate
on its lintel, walks through the gate and a walnut pivot door, along a gallery of five skill boards, into an atrium
with four doorways (one per kind of project), through four distinct rooms, into the study, and out onto a courtyard
terrace. Architecture is the frame; every fact is ordinary HTML from `src/data`, and the 3D scene is never needed to
read or reach anything.

| Token | Hex | Role |
|---|---|---|
| Ivory | `#F6F1E7` | Page and wall colour |
| Limestone / Sand | `#EDE6D8` / `#E3D9C6` | Raised planes, inner-page bands |
| Seam | `#D2C6B1` | Rules and borders |
| Charcoal | `#221E19` | Primary text (15.6:1 on ivory) |
| Slate | `#5C5449` | Secondary text (6.6:1) |
| Brass / Brass fill | `#85632D` / `#DCC08C` | Signs, links, primary buttons |
| Oak / Walnut | `#C39A6B` / `#6B4428` | Frames, furniture |
| Sky | `#2D6C88` | AI, ML and data accents |

Area colours: amber walnut for software, brass for agents, sky blue for ML and data (`src/data/visuals.ts`).
Type: Source Serif 4 (display optical size) for headings, Archivo for interface and body, Archivo expanded caps for
the nameplate and signs. Fonts are self-hosted.

## Scene (`src/scene/Residence.ts`, `textures.ts`, `chapters.ts`)

One procedural three.js scene, no downloaded models or textures (canvas-drawn concrete, limestone, oak, walnut,
prints). Driven by one station number `s`; every transition is a pure function of `s`, so scrolling back reverses it.

- **Entrance.** Low limestone boundary wall with brass coping; two piers and a lintel carrying a pale brass
  nameplate with engraved lettering, lit by its own light; slatted walnut-and-brass gate leaves that swing open with
  `s`; bollards, olive trees, a stone door surround with a brass reveal, canopy downlights, sconces.
- **Lighting.** Hemisphere light and a low sun with shadows (desktop); a few point lights (porch, door, gallery,
  atrium, study, pergola); one follow light that slides into whichever room is being read. Fixtures are emissive
  geometry (picture lights, sconces, pendants, coves, skylights) and each throws an additive "light pool" quad on
  the wall or floor (`pool()`), which gives visible falloff cheaply. Indoors the fog turns warm and thin.
  Boards, displays and certificates are `MeshBasicMaterial` with `toneMapped: false`, so type keeps its colours.
- **Gallery.** Five boards on the right-hand wall. At each one the camera stands square to the board
  (`BOARD_X`, `BOARD_DIST` 3.45 m, `BOARD_SHIFT` 0.2 m) and holds still (pointer lean fades out), so the board sits
  right of the text column. The HTML boards are narrower (`lg:max-w-[min(38rem,44vw)]`) so the two never overlap.
- **Four rooms**, each built around its own figure from `src/data` (passed in through `SceneContent` in `Home.tsx`):
  1. Machine learning: a bright lab. Clerestory window, wide screen with the CricXAI calibration chart and the
     featured projects, oak lab bench with monitors, glass cabinet of blue binders, linear pendant.
  2. Agentic AI: a low, warm control room. Coffered oak ceiling, walnut slats, slot window, a long brass-framed
     panel showing one SettleAI run stage by stage (who acts at each step), round walnut table under a brass ring.
  3. Data and analytics: a double-height archive. Shelving on both walls, brass ladder, reading table, tall ledger
     board with one counted figure per analysis.
  4. Software: a studio. Window wall onto a tree, standing desk with the Movigo retailer screenshot and the
     RouteCore k-d tree benchmark on two screens, track lights.
  Each doorway carries a lettered sign. Room cameras stand in the atrium, framed by the doorway, turned a few
  degrees so the room sits right of the text (the turn is cancelled on tall screens).
- **Study.** A 3x3 wall of typeset frames (degree plus eight credentials), picture lights, low credenza, desk.
- **Courtyard.** An elevated limestone terrace organised on one axis: a narrow rill runs from the study to a lit
  limestone wall carrying the invitation and email in brass; planted bed on the left, oak deck under a slatted
  pergola with a linen lounge on the right; glass balustrades with a brass rail on three sides, sky beyond.

```
 chapter     station  scene                                        HTML
 arrival     0        gateway, nameplate on the lintel             nameplate (h1), role, Open the door, résumé
 entrance    0 → 1    gate opens, door opens                       directory of every room
 gallery     2 → 6    camera square to each of five boards         five domain boards with an Open action
 corridor    7        atrium, four signed doorways                 four door links with counts and previews
 rooms       8 → 11   each room through its doorway                placard, featured projects, shelf, wayfinding
 study       12       credentials wall                             role, timeline, education, framed credentials
 courtyard   13       study wall sinks, roof lifts, terrace         availability, email, résumé, message, profiles
```

## Text over the scene

No ivory cards behind ordinary text. `.read-panel` is a halo only (`text-shadow` in the wall colour, inherited by
the block). Behind the text column there is a light radial scrim, not a flat wash. A full-screen reading veil
(`dim` while a chapter opens, `read` once its content has scrolled in, per chapter in `chapters.ts`) softens the
scene under long content. Phones keep the veil at 0.5 or more while text is over the scene, except the arrival, the
courtyard, and the opening half-screen of each room (rooms open with `pt-[52svh]` on phones so the room is seen
first). Surfaces are kept for real objects only: framed boards and credentials, plaques, shelf items, figures,
dialogs, buttons and the phone Rooms menu.

Room shelves keep the rest of each room's projects in that room's furniture: binders (lab), cards (control room),
drawers (archive), screens (studio); all open the same project record. Every room ends with "Next room" and
"Back to the corridor". The chapter rail on wide screens is a column of ticks with only the current room named;
all names show on hover or keyboard focus.

## Performance and fallbacks

- The scene chunk loads after first paint (idle callback). Phones and touch screens load it only on the first
  scroll, touch or key, and draw frames on demand (no continuous loop).
- `build()` is async and yields between sections; `ready` resolves after `renderer.compileAsync`, so neither the
  build nor shader compilation blocks for seconds. Static boxes and light pools are merged per material.
- Frame-time watch: above 40 ms median the pixel ratio and shadows drop; above 60 ms after that the scene stops
  and the poster shows. (Laptops on battery cap animation at 30 fps, hence 40 rather than 34.)
- Fallback: `ResidencePoster.tsx`, a prerendered SVG elevation anchored right (`xMaxYMax slice`) so the gateway and
  nameplate sit clear of the text on wide screens. Shown before the scene loads and without WebGL2.
- Reduced motion: no camera travel, still frames per chapter; door and gate positions still follow the station.

## Pages without WebGL

Archive, project pages, role pages, Experience, Skills, Achievements, About, Contact and 404 use the same daylight
palette with HTML only. Role pages ignore `?ref=` and keep a clean canonical URL. Detail views (`Detail.tsx`) are
native modal dialogs: Escape and backdrop close them, focus returns to the object that opened them. They do not
add browser history entries, so back and forward keep moving between pages.

## Review against generic defaults

- Dark page with neon accents: not used; the house is daylit and the accents mean areas of work.
- Card grids for everything: avoided; text sits on the scene, surfaces are reserved for objects.
- Fade-up on every section: none; the camera is the only scroll-driven motion.
- External links carry an icon because they leave the site.
