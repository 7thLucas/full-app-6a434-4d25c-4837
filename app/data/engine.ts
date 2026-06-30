// ───────────────────────────────────────────────────────────────────────────
// Terbangin decision engine — the real IP.
//
// "Best" is not just cheapest. We score each option on three axes (price,
// refund/change terms, onboard comfort), combine them with owner-tunable
// weights, and produce ONE explainable recommendation. We also flag when a
// transit itinerary saves real money over the cheapest direct flight.
//
// Deterministic by design: same input + same weights → same ranking + reason.
// ───────────────────────────────────────────────────────────────────────────

import type {
  DecisionResult,
  EngineConfig,
  FareOption,
  OnboardServices,
  RefundPolicy,
  ScoredOption,
} from "./types";

const REFUND_SCORE: Record<RefundPolicy, number> = {
  refundable: 1,
  partial: 0.6,
  "non-refundable": 0.2,
};

function termsScore(o: FareOption): number {
  let s = REFUND_SCORE[o.terms.refund];
  if (o.terms.rescheduleAllowed) s += 0.25;
  if (/free/i.test(o.terms.rescheduleFeeNote)) s += 0.1;
  return Math.min(1, s);
}

function comfortFromServices(svc: OnboardServices): number {
  let s = 0;
  if (svc.ife) s += 0.3;
  if (svc.wifi) s += 0.25;
  if (svc.usbPower) s += 0.15;
  if (svc.mealIncluded) s += 0.2;
  if (/extra|32in|wide-body|31in/i.test(svc.legroomNote)) s += 0.1;
  return Math.min(1, s);
}

function comfortScore(o: FareOption): number {
  // Average comfort across legs; transit with a long layover loses a little.
  const legComfort =
    o.legs.reduce((sum, l) => sum + comfortFromServices(l.aircraft.services), 0) /
    o.legs.length;
  const layoverPenalty = o.layoverMinutes > 120 ? 0.1 : 0;
  return Math.max(0, legComfort - layoverPenalty);
}

/** Normalize price into 0..1 where cheapest = 1, most expensive = 0. */
function priceScores(options: FareOption[]): Map<string, number> {
  const prices = options.map((o) => o.priceIdr);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const m = new Map<string, number>();
  for (const o of options) {
    m.set(o.id, 1 - (o.priceIdr - min) / span);
  }
  return m;
}

function formatIdr(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function buildReason(
  o: FareOption,
  rank: number,
  cheapest: FareOption,
  mostComfortable: FareOption,
): string {
  const bits: string[] = [];
  const isCheapest = o.id === cheapest.id;
  const refundLabel =
    o.terms.refund === "refundable"
      ? "fully refundable"
      : o.terms.refund === "partial"
        ? "partially refundable"
        : "non-refundable";

  if (rank === 0) {
    if (isCheapest && o.terms.refund !== "non-refundable") {
      bits.push(`Cheapest ${refundLabel} option`);
    } else if (isCheapest) {
      bits.push("Lowest price for this route");
    } else {
      const diff = o.priceIdr - cheapest.priceIdr;
      bits.push(
        `${formatIdr(diff)} more than the cheapest, but ${refundLabel}`,
      );
    }
    if (o.id === mostComfortable.id) bits.push("best onboard comfort");
    if (!o.isDirect) bits.push(`transit via ${o.connectionAirports.join(", ")}`);
  } else {
    if (isCheapest) bits.push("Lowest price");
    bits.push(refundLabel);
    if (o.isDirect) bits.push("direct");
    else bits.push(`${o.stops} stop via ${o.connectionAirports.join(", ")}`);
  }
  return bits.join(" · ");
}

export function decide(
  options: FareOption[],
  config: EngineConfig,
): DecisionResult {
  if (options.length === 0) {
    return {
      ranked: [],
      best: null,
      cheapestDirect: null,
      cheapestTransit: null,
      transitSavings: null,
    };
  }

  const wTotal =
    config.weights.price + config.weights.terms + config.weights.comfort || 1;
  const wPrice = config.weights.price / wTotal;
  const wTerms = config.weights.terms / wTotal;
  const wComfort = config.weights.comfort / wTotal;

  const priceMap = priceScores(options);

  const cheapest = options.reduce((a, b) => (b.priceIdr < a.priceIdr ? b : a));
  const mostComfortable = options.reduce((a, b) =>
    comfortScore(b) > comfortScore(a) ? b : a,
  );

  const scored: ScoredOption[] = options.map((o) => {
    const pScore = priceMap.get(o.id) ?? 0;
    const tScore = termsScore(o);
    const cScore = comfortScore(o);
    const composite =
      (pScore * wPrice + tScore * wTerms + cScore * wComfort) * 100;
    return {
      option: o,
      score: composite,
      priceScore: pScore * 100,
      termsScore: tScore * 100,
      comfortScore: cScore * 100,
      reason: "",
    };
  });

  // Deterministic tie-break: score desc, then price asc, then id asc.
  scored.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.0001) return b.score - a.score;
    if (a.option.priceIdr !== b.option.priceIdr)
      return a.option.priceIdr - b.option.priceIdr;
    return a.option.id.localeCompare(b.option.id);
  });

  scored.forEach((s, i) => {
    s.reason = buildReason(s.option, i, cheapest, mostComfortable);
  });

  const directs = options.filter((o) => o.isDirect);
  const transits = options.filter((o) => !o.isDirect);
  const cheapestDirect =
    directs.length > 0
      ? directs.reduce((a, b) => (b.priceIdr < a.priceIdr ? b : a))
      : null;
  const cheapestTransit =
    transits.length > 0
      ? transits.reduce((a, b) => (b.priceIdr < a.priceIdr ? b : a))
      : null;

  let transitSavings: DecisionResult["transitSavings"] = null;
  if (cheapestDirect && cheapestTransit) {
    const amount = cheapestDirect.priceIdr - cheapestTransit.priceIdr;
    if (amount >= config.transitSavingsThreshold) {
      transitSavings = {
        amountIdr: amount,
        viaAirports: cheapestTransit.connectionAirports,
        option: cheapestTransit,
      };
    }
  }

  return {
    ranked: scored,
    best: scored[0] ?? null,
    cheapestDirect,
    cheapestTransit,
    transitSavings,
  };
}

export { formatIdr };
