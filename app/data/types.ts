// ───────────────────────────────────────────────────────────────────────────
// Terbangin domain types — the typed contract for the fare data layer.
//
// This contract is deliberately decoupled from the (currently mock) data
// source. A real fare feed can be plugged in later by implementing
// `FareProvider.search()` against the same shapes — the UI and decision
// engine never need to change.
// ───────────────────────────────────────────────────────────────────────────

export type FlightType = "direct" | "transit" | "both";

/** What the searcher asks for. */
export interface FareQuery {
  origin: string; // IATA code, e.g. "CGK"
  destination: string; // IATA code, e.g. "DPS"
  date: string; // ISO date "YYYY-MM-DD"
  flightType: FlightType;
}

export interface Airport {
  code: string; // IATA
  city: string;
  name: string;
  country: string; // "Indonesia" or intl endpoint connected to Indonesia
}

export interface Airline {
  code: string;
  name: string;
}

/** Onboard amenities for the specific aircraft serving a fare. */
export interface OnboardServices {
  ife: boolean; // seatback in-flight entertainment
  wifi: boolean;
  usbPower: boolean;
  mealIncluded: boolean;
  legroomNote: string; // e.g. "Standard 29in", "Extra legroom 32in"
}

export interface Aircraft {
  model: string; // e.g. "Airbus A320neo"
  services: OnboardServices;
}

export type RefundPolicy = "refundable" | "partial" | "non-refundable";

export interface FareTerms {
  refund: RefundPolicy;
  rescheduleAllowed: boolean;
  rescheduleFeeNote: string; // e.g. "Free reschedule", "Reschedule fee Rp 150,000"
}

/** A single leg of an itinerary. */
export interface FlightLeg {
  airline: Airline;
  flightNumber: string;
  origin: string; // IATA
  destination: string; // IATA
  departTime: string; // "HH:mm" local
  arriveTime: string; // "HH:mm" local
  durationMinutes: number;
  aircraft: Aircraft;
}

/** A bookable option for the searched route, from one booking source. */
export interface FareOption {
  id: string;
  source: string; // booking site, e.g. "Traveloka"
  bookingUrl: string; // where the one-tap redirect goes
  priceIdr: number;
  isDirect: boolean;
  legs: FlightLeg[];
  /** For transit itineraries: connection airport code(s). */
  connectionAirports: string[];
  /** Total layover minutes across all stops (0 for direct). */
  layoverMinutes: number;
  stops: number; // 0 = direct
  totalDurationMinutes: number;
  terms: FareTerms;
}

/** The contract a real fare feed would implement later. */
export interface FareProvider {
  search(query: FareQuery): Promise<FareSearchResult>;
}

export interface FareSearchResult {
  query: FareQuery;
  origin: Airport;
  destination: Airport;
  options: FareOption[];
  /** True when the dataset is sample/mock rather than a live feed. */
  isSample: boolean;
}

// ── Decision engine output ─────────────────────────────────────────────────

export interface ScoredOption {
  option: FareOption;
  /** 0–100 composite score (higher is better). */
  score: number;
  priceScore: number;
  termsScore: number;
  comfortScore: number;
  /** Human-readable reason this option ranks where it does. */
  reason: string;
}

export interface DecisionResult {
  ranked: ScoredOption[];
  best: ScoredOption | null;
  cheapestDirect: FareOption | null;
  cheapestTransit: FareOption | null;
  /** Set when a transit option beats the cheapest direct by the threshold. */
  transitSavings: {
    amountIdr: number;
    viaAirports: string[];
    option: FareOption;
  } | null;
}

export interface EngineConfig {
  weights: { price: number; terms: number; comfort: number };
  transitSavingsThreshold: number;
}
