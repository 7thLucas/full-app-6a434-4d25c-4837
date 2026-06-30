# Terbangin — Design Guidelines

## Brand identity
- **Name:** Terbangin (set in extrabold, tight tracking).
- **Logo:** minimalist upward-soaring paper airplane — a flat, single-color sky-blue vector mark. Render it inline as a clean SVG (a simple angular paper plane pointing up-right). Keep it geometric and minimal.
- **Tone:** clean, trustworthy, fast to read, Indonesian travel feel. Confident and calm — the product gives an answer, so the UI should feel decisive, not busy.

## Color palette (sky-blue, drawn from the blueprint)
- **Primary:** sky-blue — Tailwind `sky-600` (#0284c7) for primary actions, brand wordmark, key accents; `sky-700` for emphasis text; `sky-50` / `sky-100` for soft tinted surfaces and chips; `sky-300` for accents on dark.
- **Neutrals:** `slate-900` (#0f172a) for headlines and dark feature blocks, `slate-700` body text, `slate-600` / `slate-500` secondary text, `slate-200` hairline borders/rings, `white` base background.
- **Semantic accents (use sparingly):**
  - Problem / non-refundable / warning: `rose-50` surface, `rose-600` label text.
  - Savings / best-value flag: a clear positive accent (emerald/green) for "saves Rp X" badges and the recommended pick highlight; keep it tasteful.
  - "Assumption / sample data" notes: `amber-100` surface, `amber-700` text — used only for the small sample-data disclaimer.

## Typography
- Extrabold, tight-tracking headlines (`text-3xl`/`text-5xl font-extrabold tracking-tight`).
- Body in relaxed leading `text-slate-600` / `text-slate-700`.
- Prices prominent and bold; IDR formatted with thousands separators (Rp 1,250,000).
- Uppercase tracked micro-labels (`text-xs font-bold uppercase tracking-widest`) for section eyebrows / metric labels (as in the blueprint).

## Components & elevation
- **Cards:** generous radius (`rounded-2xl`), thin rings (`ring-1 ring-slate-200`) over hard shadows; soft tinted cards (`bg-sky-50 ring-sky-200`) for highlighted/recommended content. Comfortable padding (`p-6`/`p-7`).
- **Hero recommendation card:** visually distinct — sky-tinted or subtly elevated, with a clear "Best decision · Buy here" label, the explanation, and the primary redirect CTA. Savings flag shown as a positive badge.
- **Comparison rows/cards:** scannable, each showing price, source logo/name, direct-vs-transit pill, aircraft model, onboard-service icons (Wi-Fi, IFE, USB, meal), terms pill (refundable/non-refundable), and a "Book on [site]" button.
- **Chips / pills:** rounded-full, small, semibold — sky-600 filled for active, slate-100 for inactive (mirrors blueprint persona chips). Use for flight-type toggle (direct / transit / both) and terms badges.
- **Buttons:** primary `bg-sky-600 text-white` rounded; clear hover state; redirect CTAs read like "Book on Traveloka ↗".
- **Dark callout block:** `bg-slate-900` with `sky-300` eyebrow for the core-promise / trust statement (mirrors blueprint payoff slide).

## Layout
- Spacious, editorial, lots of whitespace. Two-column hero on wide screens (headline + visual), single column stacked on mobile. Results page: hero recommendation full-width on top, comparison list below.
- Fully responsive (mobile-first; many Indonesian travelers are on phones). Generous `p-12`-scale section padding on desktop, comfortable on mobile.

## Imagery
- Optional tasteful hero imagery of Indonesian aerial/archipelago travel feel (golden-hour, premium editorial), with a subtle dark gradient overlay for legibility — consistent with the cover blueprint. Keep it minimal; the data/recommendation is the star.

## Iconography
- Simple line/emoji-free-leaning icons for onboard amenities (Wi-Fi, in-flight entertainment, USB power, meal, legroom) and flight type. Keep them small, monochrome, and legible.

## Consistency
Match the existing creative blueprint exactly: sky-blue + slate + white, rounded-2xl ring-bordered cards, extrabold tight headlines, uppercase tracked eyebrows, the paper-airplane brand mark, and the decisive "one answer" voice.
