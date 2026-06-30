// ───────────────────────────────────────────────────────────────────────────
// Mock fare dataset — realistic SAMPLE fares for real Indonesian routes.
//
// This is the swappable data source. A real fare feed replaces ONLY this file
// (and `provider.ts`'s call into it); types, engine, and UI stay unchanged.
// ───────────────────────────────────────────────────────────────────────────

import type {
  FareOption,
  FareTerms,
  FlightLeg,
  RefundPolicy,
} from "./types";
import { AIRCRAFT, AIRLINES, SOURCE_URL } from "./reference";

type AirlineKey = keyof typeof AIRLINES;
type AircraftKey = keyof typeof AIRCRAFT;

interface LegSeed {
  airline: AirlineKey;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  durationMinutes: number;
  aircraft: AircraftKey;
}

interface OptionSeed {
  source: keyof typeof SOURCE_URL;
  priceIdr: number;
  refund: RefundPolicy;
  rescheduleAllowed: boolean;
  rescheduleFeeNote: string;
  legs: LegSeed[];
  /** layover minutes between legs (for transit); omit/0 for direct */
  layoverMinutes?: number;
}

/** Routes are keyed "ORIGIN-DEST". */
type RouteSeeds = Record<string, OptionSeed[]>;

function buildLeg(s: LegSeed): FlightLeg {
  return {
    airline: AIRLINES[s.airline],
    flightNumber: s.flightNumber,
    origin: s.origin,
    destination: s.destination,
    departTime: s.departTime,
    arriveTime: s.arriveTime,
    durationMinutes: s.durationMinutes,
    aircraft: AIRCRAFT[s.aircraft],
  };
}

function buildOption(routeKey: string, idx: number, s: OptionSeed): FareOption {
  const legs = s.legs.map(buildLeg);
  const isDirect = legs.length === 1;
  const layover = isDirect ? 0 : s.layoverMinutes ?? 0;
  const flightMinutes = legs.reduce((sum, l) => sum + l.durationMinutes, 0);
  const connectionAirports = isDirect
    ? []
    : legs.slice(0, -1).map((l) => l.destination);
  const terms: FareTerms = {
    refund: s.refund,
    rescheduleAllowed: s.rescheduleAllowed,
    rescheduleFeeNote: s.rescheduleFeeNote,
  };
  return {
    id: `${routeKey}-${idx}`,
    source: s.source,
    bookingUrl: SOURCE_URL[s.source] ?? "#",
    priceIdr: s.priceIdr,
    isDirect,
    legs,
    connectionAirports,
    layoverMinutes: layover,
    stops: legs.length - 1,
    totalDurationMinutes: flightMinutes + layover,
    terms,
  };
}

// ── Seed data ──────────────────────────────────────────────────────────────
// Each route has several direct AND transit options across multiple sources,
// with deliberate price/terms/comfort tradeoffs so the engine has real
// decisions to make (including transit-saves-money cases).

const ROUTE_SEEDS: RouteSeeds = {
  "CGK-DPS": [
    {
      source: "Garuda.com",
      priceIdr: 1480000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA406", origin: "CGK", destination: "DPS", departTime: "07:10", arriveTime: "10:00", durationMinutes: 110, aircraft: "B737-800-GA" },
      ],
    },
    {
      source: "Traveloka",
      priceIdr: 1015000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 150,000",
      legs: [
        { airline: "ID", flightNumber: "ID7510", origin: "CGK", destination: "DPS", departTime: "09:25", arriveTime: "12:10", durationMinutes: 105, aircraft: "A320-Batik" },
      ],
    },
    {
      source: "Tiket.com",
      priceIdr: 845000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "QG", flightNumber: "QG690", origin: "CGK", destination: "DPS", departTime: "13:40", arriveTime: "16:25", durationMinutes: 105, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Lionair.co.id",
      priceIdr: 789000,
      refund: "non-refundable",
      rescheduleAllowed: false,
      rescheduleFeeNote: "No reschedule",
      legs: [
        { airline: "JT", flightNumber: "JT016", origin: "CGK", destination: "DPS", departTime: "05:00", arriveTime: "07:50", durationMinutes: 110, aircraft: "B737-800-LCC" },
      ],
    },
    {
      // Transit via SUB — slightly cheaper than the cheapest direct
      source: "Traveloka",
      priceIdr: 712000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      layoverMinutes: 70,
      legs: [
        { airline: "QG", flightNumber: "QG412", origin: "CGK", destination: "SUB", departTime: "08:00", arriveTime: "09:30", durationMinutes: 90, aircraft: "A320neo-LCC" },
        { airline: "QG", flightNumber: "QG620", origin: "SUB", destination: "DPS", departTime: "10:40", arriveTime: "11:40", durationMinutes: 60, aircraft: "A320-LCC" },
      ],
    },
  ],

  "CGK-SUB": [
    {
      source: "Garuda.com",
      priceIdr: 1120000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA312", origin: "CGK", destination: "SUB", departTime: "06:30", arriveTime: "08:00", durationMinutes: 90, aircraft: "A320neo-GA" },
      ],
    },
    {
      source: "Tiket.com",
      priceIdr: 735000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 100,000",
      legs: [
        { airline: "QG", flightNumber: "QG420", origin: "CGK", destination: "SUB", departTime: "11:15", arriveTime: "12:45", durationMinutes: 90, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Pegipegi",
      priceIdr: 689000,
      refund: "non-refundable",
      rescheduleAllowed: false,
      rescheduleFeeNote: "No reschedule",
      legs: [
        { airline: "IU", flightNumber: "IU734", origin: "CGK", destination: "SUB", departTime: "14:50", arriveTime: "16:20", durationMinutes: 90, aircraft: "A320-LCC" },
      ],
    },
    {
      source: "Lionair.co.id",
      priceIdr: 652000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "JT", flightNumber: "JT566", origin: "CGK", destination: "SUB", departTime: "19:05", arriveTime: "20:35", durationMinutes: 90, aircraft: "B737-800-LCC" },
      ],
    },
  ],

  "DPS-UPG": [
    {
      source: "Garuda.com",
      priceIdr: 1340000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA610", origin: "DPS", destination: "UPG", departTime: "08:20", arriveTime: "10:00", durationMinutes: 100, aircraft: "B737-800-GA" },
      ],
    },
    {
      source: "Citilink.co.id",
      priceIdr: 905000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 150,000",
      legs: [
        { airline: "QG", flightNumber: "QG800", origin: "DPS", destination: "UPG", departTime: "12:10", arriveTime: "13:50", durationMinutes: 100, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Traveloka",
      priceIdr: 868000,
      refund: "non-refundable",
      rescheduleAllowed: false,
      rescheduleFeeNote: "No reschedule",
      legs: [
        { airline: "JT", flightNumber: "JT900", origin: "DPS", destination: "UPG", departTime: "16:30", arriveTime: "18:10", durationMinutes: 100, aircraft: "B737-800-LCC" },
      ],
    },
  ],

  "SUB-KNO": [
    {
      // Transit via CGK — much cheaper than direct on this thin route
      source: "Traveloka",
      priceIdr: 1180000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      layoverMinutes: 85,
      legs: [
        { airline: "QG", flightNumber: "QG421", origin: "SUB", destination: "CGK", departTime: "07:00", arriveTime: "08:30", durationMinutes: 90, aircraft: "A320neo-LCC" },
        { airline: "QG", flightNumber: "QG140", origin: "CGK", destination: "KNO", departTime: "09:55", arriveTime: "12:15", durationMinutes: 140, aircraft: "A320-LCC" },
      ],
    },
    {
      source: "Garuda.com",
      priceIdr: 1990000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA286", origin: "SUB", destination: "KNO", departTime: "13:10", arriveTime: "16:10", durationMinutes: 180, aircraft: "A320neo-GA" },
      ],
    },
    {
      source: "Lionair.co.id",
      priceIdr: 1660000,
      refund: "non-refundable",
      rescheduleAllowed: false,
      rescheduleFeeNote: "No reschedule",
      legs: [
        { airline: "JT", flightNumber: "JT388", origin: "SUB", destination: "KNO", departTime: "10:40", arriveTime: "13:40", durationMinutes: 180, aircraft: "B737-800-LCC" },
      ],
    },
    {
      // Another transit via CGK on Batik — comfortable, mid price
      source: "Tiket.com",
      priceIdr: 1395000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 150,000",
      layoverMinutes: 75,
      legs: [
        { airline: "ID", flightNumber: "ID7321", origin: "SUB", destination: "CGK", departTime: "06:15", arriveTime: "07:45", durationMinutes: 90, aircraft: "A320-Batik" },
        { airline: "ID", flightNumber: "ID6880", origin: "CGK", destination: "KNO", departTime: "09:00", arriveTime: "11:20", durationMinutes: 140, aircraft: "A320-Batik" },
      ],
    },
  ],

  "CGK-SIN": [
    {
      source: "Garuda.com",
      priceIdr: 2350000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA826", origin: "CGK", destination: "SIN", departTime: "08:40", arriveTime: "11:30", durationMinutes: 110, aircraft: "A330-900neo" },
      ],
    },
    {
      source: "Traveloka",
      priceIdr: 1980000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ957", origin: "CGK", destination: "SIN", departTime: "12:20", arriveTime: "15:05", durationMinutes: 105, aircraft: "B787-10" },
      ],
    },
    {
      source: "AirAsia.com",
      priceIdr: 1120000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 350,000",
      legs: [
        { airline: "QZ", flightNumber: "QZ258", origin: "CGK", destination: "SIN", departTime: "17:00", arriveTime: "19:45", durationMinutes: 105, aircraft: "A320-LCC" },
      ],
    },
    {
      source: "Tiket.com",
      priceIdr: 1395000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 250,000",
      legs: [
        { airline: "ID", flightNumber: "ID7150", origin: "CGK", destination: "SIN", departTime: "20:10", arriveTime: "22:55", durationMinutes: 105, aircraft: "A320-Batik" },
      ],
    },
  ],

  "CGK-KNO": [
    {
      source: "Garuda.com",
      priceIdr: 1720000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA180", origin: "CGK", destination: "KNO", departTime: "07:30", arriveTime: "09:50", durationMinutes: 140, aircraft: "A320neo-GA" },
      ],
    },
    {
      source: "Citilink.co.id",
      priceIdr: 1085000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 150,000",
      legs: [
        { airline: "QG", flightNumber: "QG142", origin: "CGK", destination: "KNO", departTime: "11:00", arriveTime: "13:20", durationMinutes: 140, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Lionair.co.id",
      priceIdr: 998000,
      refund: "non-refundable",
      rescheduleAllowed: false,
      rescheduleFeeNote: "No reschedule",
      legs: [
        { airline: "JT", flightNumber: "JT302", origin: "CGK", destination: "KNO", departTime: "15:25", arriveTime: "17:45", durationMinutes: 140, aircraft: "B737-800-LCC" },
      ],
    },
    {
      source: "Pegipegi",
      priceIdr: 1045000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "IP", flightNumber: "IP206", origin: "CGK", destination: "KNO", departTime: "19:40", arriveTime: "22:00", durationMinutes: 140, aircraft: "A320-Pelita" },
      ],
    },
  ],

  "CGK-LOP": [
    {
      source: "Citilink.co.id",
      priceIdr: 1290000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 150,000",
      legs: [
        { airline: "QG", flightNumber: "QG640", origin: "CGK", destination: "LOP", departTime: "09:10", arriveTime: "11:55", durationMinutes: 105, aircraft: "A320neo-LCC" },
      ],
    },
    {
      // Transit via DPS — cheaper than the only direct
      source: "Traveloka",
      priceIdr: 985000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      layoverMinutes: 65,
      legs: [
        { airline: "QG", flightNumber: "QG690", origin: "CGK", destination: "DPS", departTime: "06:00", arriveTime: "08:45", durationMinutes: 105, aircraft: "A320neo-LCC" },
        { airline: "IW", flightNumber: "IW1830", origin: "DPS", destination: "LOP", departTime: "09:50", arriveTime: "10:30", durationMinutes: 40, aircraft: "ATR72-600" },
      ],
    },
    {
      source: "Garuda.com",
      priceIdr: 1610000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA430", origin: "CGK", destination: "LOP", departTime: "13:30", arriveTime: "16:15", durationMinutes: 105, aircraft: "B737-800-GA" },
      ],
    },
  ],

  "CGK-BPN": [
    {
      source: "Garuda.com",
      priceIdr: 1550000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA510", origin: "CGK", destination: "BPN", departTime: "06:50", arriveTime: "09:55", durationMinutes: 125, aircraft: "B737-800-GA" },
      ],
    },
    {
      source: "Tiket.com",
      priceIdr: 1010000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 150,000",
      legs: [
        { airline: "QG", flightNumber: "QG740", origin: "CGK", destination: "BPN", departTime: "10:30", arriveTime: "13:35", durationMinutes: 125, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Lionair.co.id",
      priceIdr: 945000,
      refund: "non-refundable",
      rescheduleAllowed: false,
      rescheduleFeeNote: "No reschedule",
      legs: [
        { airline: "JT", flightNumber: "JT740", origin: "CGK", destination: "BPN", departTime: "14:15", arriveTime: "17:20", durationMinutes: 125, aircraft: "B737-800-LCC" },
      ],
    },
  ],
};

/** Public: build all FareOptions for a route key, or [] if unknown. */
export function getRouteOptions(originCode: string, destCode: string): FareOption[] {
  const key = `${originCode}-${destCode}`;
  const seeds = ROUTE_SEEDS[key];
  if (!seeds) return [];
  return seeds.map((s, i) => buildOption(key, i, s));
}

/** Routes we have sample data for — used to suggest popular searches. */
export const SAMPLE_ROUTES: { origin: string; destination: string }[] =
  Object.keys(ROUTE_SEEDS).map((k) => {
    const [origin, destination] = k.split("-");
    return { origin, destination };
  });
