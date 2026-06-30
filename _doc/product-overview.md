# Product Overview — Core Truth: Terbangin

> Single source of truth for the product. Some details (data source, pricing) are still
> provisional and marked TBD; they will be confirmed during scoping and reconciled here.

## What it is

**Terbangin** — a flight **decision engine** for Indonesian travel — a web app that compares fares for the
same route across multiple booking sites and tells the traveler the single best place to
buy. It is not just a meta-search that lists options and links out; the differentiating
value is the **recommendation**: "buy this flight on Site X — it's cheaper and the terms are
better." Once the call is made, the app redirects the user to that site to complete the
purchase.

## The core workflow

1. Traveler enters a route (origin → destination) and date for an Indonesian flight, and
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

- **Geography:** Indonesia only — flights departing from and arriving to Indonesia.
- **Function:** compare + recommend + redirect, across both direct and transit flights (user
  picks the type). The app does not sell or issue tickets itself; purchase happens on the
  partner booking site.
- Deliberately narrow scope is a strength: focusing on Indonesian routes makes the
  comparison sharper and the recommendation more trustworthy.

## Who it's for

Price-sensitive Indonesian travelers (and people flying to/from Indonesia) who currently
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
- The recommendation logic (how "best" is decided — price weighted with terms/trust) is the
  real intellectual property and the reason a user returns.

## Branding

- **Name:** Terbangin (casual Indonesian — "let's fly"). Confirmed.
- **Logo:** minimalist upward-soaring paper airplane, flat sky-blue vector mark.
- **Palette / tone:** clean sky-blue, trustworthy, fast to read; Indonesian travel feel.
- **Tagline:** "Stop comparing tabs. Get the answer." — one trusted "buy here" pick.

## Status / TBD

- **Data source for MVP fares:** to be decided — concrete approach required before live
  fares. MVP will run on sensible sample fare data to prove the end-to-end experience.
- **Monetization:** not yet defined (likely affiliate/referral on redirect, TBD).
