# Product Overview — Core Truth: Terbangin

> Single source of truth for the product. Some details (data source, pricing) are still
> provisional and marked TBD; they will be confirmed during scoping and reconciled here.

## What it is

**Terbangin** — a flight **decision engine** for travel across Asia and nearby destinations — a web app
that compares fares for the
same route across multiple booking sites and tells the traveler the single best place to
buy. It is not just a meta-search that lists options and links out; the differentiating
value is the **recommendation**: "buy this flight on Site X — it's cheaper and the terms are
better." Once the call is made, the app redirects the user to that site to complete the
purchase.

## The core workflow

1. Traveler enters a route (origin → destination) and date for a flight anywhere across Asia
   or nearby destinations, and
   chooses a **flight type — direct, transit (connecting), or both**.
2. The app gathers comparable fares for that route from several booking sources, including
   transit (connecting) itineraries, which are often cheaper than direct flights.
3. The app compares price (and supporting factors such as refund/change terms and direct vs.
   transit where available) and ranks the options, flagging when a transit option saves real
   money over flying direct.
4. Each option also displays the **aircraft model** and the **onboard services / entertainment**
   for that specific plane, so comfort and amenities factor into the decision — not price alone.
5. The app surfaces a single **best-decision recommendation** plus the comparison behind it.
6. The traveler is redirected to the chosen site to book.

## Scope

- **Geography:** all of Asia — Southeast, East, South, Central, and West Asia (Middle East) —
  plus nearby destinations just outside the region (Australia, New Zealand, and bridge
  gateways such as Istanbul and Cairo). Indonesia remains the home market and brand anchor.
- **Function:** compare + recommend + redirect, across both direct and transit flights (user
  picks the type). The app does not sell or issue tickets itself; purchase happens on the
  partner booking site.
- The real strength is the **decision engine**, not a narrow map: broad pan-Asian coverage
  makes Terbangin useful for far more trips, while the single trusted recommendation keeps
  the answer sharp no matter how wide the route options get.

## Who it's for

Price-sensitive travelers flying across Asia and to nearby destinations — anchored in
Indonesian travelers and trips to/from Indonesia, but now extending to anyone booking
pan-Asian and regional long-haul routes. They currently
open several booking tabs to compare fares and are unsure which site is actually the best
deal. They want a confident answer, not more tabs.

## Why it's different

The market has plenty of places to *list* flights. The wedge here is the **best-decision
recommendation** — turning a wall of options into one trusted "buy here" call, scoped tightly
to Indonesia so the answer is sharp.

## Honest constraints (must stay true)

- **The product lives or dies on fare data.** Real-time prices come from external data feeds
  (airline / aggregator APIs) or structured data sources. The interface is the easy part; the
  honest hard part is where comparable, current fares come from. Scoping must name a concrete
  data approach for the MVP rather than assume live prices appear for free.
- The recommendation logic (how "best" is decided — price weighted with refund/change terms
  and comfort, plus transit-savings detection) is the real intellectual property and the
  reason a user returns. "Best" deliberately is not always "cheapest."

## Branding

- **Name:** Terbangin (casual Indonesian — "let's fly"). Confirmed.
- **Logo:** minimalist upward-soaring paper airplane, flat sky-blue vector mark.
- **Palette / tone:** clean sky-blue, trustworthy, fast to read; Indonesian travel feel.
- **Tagline:** "Stop comparing tabs. Get the answer." — one trusted "buy here" pick.

## Current build status

- **MVP is built and live.** The full experience works end-to-end: route search with a
  direct / transit / both toggle, side-by-side fare comparison across booking sites, each
  option showing aircraft model + onboard amenities, the single best-decision recommendation
  (with "why this pick"), transit-savings flagging, and the redirect-to-book step.
- **Runs on sample fare data**, not a live feed: real Indonesian airports/airlines/aircraft
  across 8 popular routes, with the data layer built behind a swappable provider seam so a
  real fare feed can replace it without touching the engine or UI.

## Status / TBD

- **Data source for live fares:** to be decided — next goal ("Plug in live flight fares").
  Concrete approach (airline / aggregator API) required before prices are real-time.
- **Monetization:** not yet defined (likely affiliate/referral on redirect, TBD).
