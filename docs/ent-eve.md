# ENT-EVE — Entity Evening

The Tensor / ENTITY folio design language. Codifies the look first realised in the
**x402 folio** (`public/tir/x402-folio.html`) so every folio, report, and feature page
speaks the same visual language.

> **Canonical implementation:** [`public/ent-eve.css`](../public/ent-eve.css) — link it,
> don't re-derive it. This doc is the spec; the CSS is the source of truth for values.

---

## 1. The idea

A **late-evening operator console**. Dark, precise, quietly futuristic. Space-grey
panels lit by a thin neon edge. Mono type for instrumentation, a geometric display
face for headlines. Information dense but never noisy — whitespace and hairlines do
the framing, colour is rationed.

Two modes share one foundation:

| Mode | Where | Accent |
|------|-------|--------|
| **Signature** | Folios, `/tir`, feature pages, the x402 standard | Vivid teal → cyan → violet |
| **Muted** | Daily reports (`/dir`) | Monochrome black / white / grey + one teal hairline |

Muted is not a different theme — it's Signature with the chroma drained. DIR is the
quiet monochrome sibling of TIR. Same grey, same rhythm, the neon turned down to a
single thread so the family resemblance survives.

---

## 2. Foundation — Space Grey

Never pure `#000`. The base is a cool near-black that lets borders read.

```
--bg-void     #0c0d0f   page
--bg-base     #111318   code wells
--bg-surface  #171b22   cards, table headers
--bg-raised   #1e2330   inline chips
--bg-hover    #242a38
--border-dim  #252c3a   default hairline
--border-mid  #2e3748   card borders
--border-hi   #3d4a62   emphasised edges
```

## 3. Accent — Entity Eve palette (Signature)

```
teal    #00c9b1   primary — links, section numbers, active state, the "ENTITY" mark
cyan    #00d9f5   secondary — code identifiers, table keys, gradients
purple  #a259ff   tertiary — keywords, the third orb
violet  #6e3fff
amber   #f0a05a   numerics / mild warning only
danger  #ff5050   high-severity only
```

Gradients run **teal → cyan** (stats, titles) at `135deg`. Purple is a guest, not a
lead. Colour marks *meaning* (a number, a key, a severity), never decoration.

## 4. Text

```
--text-primary    #e8ecf4   headings, strong
--text-secondary  #8b96ac   body
--text-muted      #505a6e   labels, captions, eyebrows
```

## 5. Type

| Role | Face | Notes |
|------|------|-------|
| Display | **Syne** 700–800 | headlines, stat values, section titles; tracking `-0.03em` |
| Mono | **IBM Plex Mono** 300–500 | code, table keys, badges |
| Body | **Space Mono** 400/700 | running copy — yes, the body is mono; that's the instrument-readout feel |

Eyebrows & labels: mono, 9–10px, `letter-spacing 0.15–0.25em`, `text-transform: uppercase`.
Headlines: `clamp()` fluid, near-black line-height (0.9–1.1) for the poster feel.
Two-line cover titles clip a `text-primary → teal` gradient.

## 6. Components (the "touches")

All shipped in `ent-eve.css`, prefixed `eve-`:

- **`.eve-callout`** — surfaced card, 3px coloured left bar (`.teal/.cyan/.purple`), mono uppercase label.
- **`.eve-stat-grid` / `.eve-stat-cell`** — 1px-gapped grid on a border-coloured bg; values are Syne 800 with a teal→cyan gradient clip.
- **`.eve-table`** — mono uppercase header, hairline rows, first column is a cyan mono key, row hover lifts to surface.
- **`.eve-code-wrap`** — titlebar with three dots + uppercase lang tag; tokens `.eve-kw/.eve-fn/.eve-str/.eve-cm/.eve-num`.
- **`.eve-tag` / `.eve-pill`** — status chips; `.active` fills with the accent glow.
- **`.eve-section`** — top hairline + numbered header (`.eve-section-num` mono teal, `.eve-section-title` Syne with `<em>` accent words).
- **`.eve-orb`** — blurred radial ambient lights on covers; hidden in muted mode.

Geometry: radius `4px` (cards) / `2px` (chips). Borders are `1px` hairlines, never heavy.
Motion is slow and ambient — 6–10s orb pulses, 0.8–1s `fadeUp` on cover entrance. No bounce.

## 7. Muted mode (daily reports)

Set `data-eve="muted"` on `<html>` (or inject the equivalent overrides — see
`REPORT_THEME_CSS` in `src/app/dir/page.tsx`). It re-points the accent indirection:

```
--accent     → #e8ecf4  (white becomes the accent)
--accent-2   → #b9c2d4
--hairline   → #009e8c  (the one surviving teal thread)
```

Rules for muted:
1. **No vivid hue carries meaning.** Severity/keys fall back to weight and white.
2. **Exactly one teal hairline** — a section underline or rule — and nothing else chromatic.
3. Grid wash and orbs **off**. Keep it flat and calm; these are read daily.
4. Links are a desaturated teal-dim, not the bright teal.

The DIR report theme is markdown-export driven, so muted styling targets *generic
semantic tags* (`h1–h3, table, blockquote, code, pre, hr, a`) rather than `eve-`
classes. Treat `src/app/dir/page.tsx › REPORT_THEME_CSS` as the muted reference render.

## 8. Using it

**New standalone folio** (signature):
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/ent-eve.css">
```
Compose with `eve-` classes. The x402 folio is the worked reference example.

**Routine-generated report** (muted): emit clean semantic markdown/HTML; `/dir` injects
the muted theme. Don't hand-style — let the injected theme own the look so every edition
stays consistent.

---

*Footers sign **ENTITY / EVE**. The mark is always teal (`#00c9b1`), even in muted mode.*
