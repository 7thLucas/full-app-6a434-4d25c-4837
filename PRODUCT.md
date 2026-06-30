# Terbangin — Product Specification

## What it is
Terbangin (casual Indonesian: "let's fly") is a flight **decision engine** web app for Indonesian travel. It compares fares for the same route across multiple booking sites and tells the traveler the single best place to buy. The wedge is the **recommendation** — not another meta-search list, but one trusted "buy here" answer. After the call is made, the app redirects the user to that booking site to complete the purchase. **Terbangin does not sell or issue tickets itself.**

Tagline: **"Stop comparing tabs. Get the answer."**

## Geographic scope (STRICT)
Indonesia ONLY — flights departing FROM and/or arriving TO Indonesia. Real Indonesian airports must anchor the data: CGK (Jakarta Soekarno-Hatta), DPS (Bali Denpasar), SUB (Surabaya), UPG (Makassar), KNO (Medan Kualanamu), JOG/YIA (Yogyakarta), BPN (Balikpapan), PKU (Pekanbaru), BDO (Bandung), LOP (Lombok), and a few international endpoints connected to Indonesia (e.g. SIN Singapore, KUL Kuala Lumpur) for to/from-Indonesia routes.

## Core day-one workflow (must work end-to-end, demoable)
1. **Search one route**: traveler enters origin, destination, and date, then picks a **flight type — direct, transit (connecting), or both**.
2. **Compare fares side by side**: the app shows comparable fares for that route gathered from MULTIPLE booking sites, including transit/connecting itineraries (which are often cheaper than direct).
3. **Each option displays**:
   - Price (in IDR, e.g. Rp 1,250,000)
   - The booking site / source (e.g. Traveloka, Tiket.com, airline direct, Pegipegi)
   - Refund / change terms where available (refundable, partially refundable, non-refundable; reschedule allowed/fee)
   - Direct vs. transit (and for transit: connection airport + layover duration + number of stops)
   - The **aircraft model** (e.g. Airbus A320neo, Boeing 737-800, ATR 72-600)
   - The **onboard services / entertainment** for that specific plane (e.g. seatback IFE, Wi-Fi, USB power, meal included, legroom note)
4. **Ranking + ONE best-decision recommendation**: the engine ranks options weighing PRICE with TERMS/COMFORT and surfaces ONE clear "buy here" recommendation. It explicitly FLAGS when a transit option saves real money over direct (e.g. "Transit via UPG saves Rp 480,000 vs the cheapest direct").
5. **One-tap redirect**: a button sends the traveler to the chosen booking site to complete the purchase.

## MVP data approach (CRITICAL)
There is NO live fare API yet. Build the entire experience on realistic SAMPLE / MOCK fare data using real Indonesian routes, airlines (Garuda Indonesia, Lion Air, Citilink, Batik Air, AirAsia Indonesia, Super Air Jet, Pelita Air, Singapore Airlines for intl legs), aircraft models, and airports — so the whole flow works and is demoable. **Structure the data layer cleanly (a typed mock fare provider / service module) so a real fare feed can be plugged in later** without rewriting the UI. Seed several popular routes (CGK→DPS, CGK→SUB, DPS→UPG, CGK→SIN, SUB→KNO, etc.) each with multiple priced options across direct and transit, and across multiple booking sources.

## The recommendation logic (the real IP)
"Best" is decided by price weighted with terms and comfort — not price alone. The ranking must be deterministic and explainable: show WHY the top pick won (e.g. "cheapest refundable option" or "Rp 200k more but refundable + Wi-Fi"). Surface a runner-up or two beneath the hero recommendation, plus the full comparison.

## Who it's for
Price-sensitive Indonesian travelers (and people flying to/from Indonesia) who currently open several booking tabs (Traveloka, Tiket, airline sites) to compare fares and are unsure which is the best deal. They want a confident answer, not more tabs.

## Honest constraints (keep true in the UI copy)
- Be honest that the app compares and recommends but does not sell tickets — purchase happens on the partner site after redirect.
- For the MVP, fares are sample data; do not imply live real-time pricing. A small, tasteful "sample data — demo" note is acceptable.

## Pages / structure for the MVP
- **Landing / Home**: brand hero ("Stop comparing tabs. Get the answer."), the search form (origin, destination, date, flight type: direct / transit / both), and a short "how it works" + trust framing consistent with the blueprint.
- **Results page**: the hero best-decision recommendation card ("Buy here") with the explanation and transit-savings flag, then the ranked comparison of all options with full detail (price, source, terms, direct/transit + layover, aircraft model, onboard services), each with a redirect-to-book button.
- Empty / no-results and loading states handled gracefully.

## Monetization (context only, not built)
Likely affiliate/referral fee on the redirect — TBD, not part of the MVP build.
