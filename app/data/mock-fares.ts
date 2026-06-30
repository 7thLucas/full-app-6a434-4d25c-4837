// ───────────────────────────────────────────────────────────────────────────
// Mock fare dataset — realistic SAMPLE fares for real routes across Asia and
// nearby gateways just outside Asia (Australia, the Gulf, New Zealand).
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

  // ───────────────────────────────────────────────────────────────────────
  // SOUTHEAST ASIA
  // ───────────────────────────────────────────────────────────────────────

  "CGK-BKK": [
    {
      source: "Garuda.com",
      priceIdr: 3150000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA864", origin: "CGK", destination: "BKK", departTime: "08:00", arriveTime: "11:25", durationMinutes: 215, aircraft: "A330-300" },
      ],
    },
    {
      source: "AirAsia.com",
      priceIdr: 1850000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 450,000",
      legs: [
        { airline: "FD", flightNumber: "FD399", origin: "CGK", destination: "BKK", departTime: "12:40", arriveTime: "16:05", durationMinutes: 215, aircraft: "A320-LCC" },
      ],
    },
    {
      source: "AirAsia.com",
      priceIdr: 1690000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 450,000",
      legs: [
        { airline: "QZ", flightNumber: "QZ254", origin: "CGK", destination: "BKK", departTime: "19:30", arriveTime: "22:55", durationMinutes: 215, aircraft: "A320neo-LCC" },
      ],
    },
    {
      // Transit via KUL on AirAsia — cheaper than direct
      source: "Trip.com",
      priceIdr: 1480000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 400,000",
      layoverMinutes: 95,
      legs: [
        { airline: "AK", flightNumber: "AK387", origin: "CGK", destination: "KUL", departTime: "06:10", arriveTime: "09:05", durationMinutes: 115, aircraft: "A320neo-LCC" },
        { airline: "AK", flightNumber: "AK884", origin: "KUL", destination: "BKK", departTime: "10:40", arriveTime: "11:55", durationMinutes: 135, aircraft: "A320neo-LCC" },
      ],
    },
  ],

  "CGK-KUL": [
    {
      source: "Garuda.com",
      priceIdr: 2050000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA820", origin: "CGK", destination: "KUL", departTime: "09:00", arriveTime: "11:55", durationMinutes: 115, aircraft: "B737-800-GA" },
      ],
    },
    {
      source: "AirAsia.com",
      priceIdr: 980000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 350,000",
      legs: [
        { airline: "AK", flightNumber: "AK389", origin: "CGK", destination: "KUL", departTime: "14:20", arriveTime: "17:15", durationMinutes: 115, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 1320000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 250,000",
      legs: [
        { airline: "MH", flightNumber: "MH724", origin: "CGK", destination: "KUL", departTime: "18:05", arriveTime: "21:00", durationMinutes: 115, aircraft: "B737-800-GA" },
      ],
    },
  ],

  "SIN-BKK": [
    {
      source: "SingaporeAir.com",
      priceIdr: 2480000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ706", origin: "SIN", destination: "BKK", departTime: "08:00", arriveTime: "09:25", durationMinutes: 145, aircraft: "B787-10" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 1180000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 300,000",
      legs: [
        { airline: "TR", flightNumber: "TR610", origin: "SIN", destination: "BKK", departTime: "11:30", arriveTime: "12:55", durationMinutes: 145, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Skyscanner",
      priceIdr: 1390000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 250,000",
      legs: [
        { airline: "TG", flightNumber: "TG404", origin: "SIN", destination: "BKK", departTime: "16:10", arriveTime: "17:35", durationMinutes: 145, aircraft: "A350-900" },
      ],
    },
  ],

  "SIN-MNL": [
    {
      source: "SingaporeAir.com",
      priceIdr: 3120000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ918", origin: "SIN", destination: "MNL", departTime: "09:10", arriveTime: "13:05", durationMinutes: 235, aircraft: "B787-10" },
      ],
    },
    {
      source: "Agoda",
      priceIdr: 1690000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 400,000",
      legs: [
        { airline: "TR", flightNumber: "TR380", origin: "SIN", destination: "MNL", departTime: "14:40", arriveTime: "18:35", durationMinutes: 235, aircraft: "A321neo-LCC" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 2240000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 300,000",
      legs: [
        { airline: "PR", flightNumber: "PR502", origin: "SIN", destination: "MNL", departTime: "19:55", arriveTime: "23:50", durationMinutes: 235, aircraft: "A321neo-FS" },
      ],
    },
  ],

  "BKK-SGN": [
    {
      source: "Trip.com",
      priceIdr: 1290000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 250,000",
      legs: [
        { airline: "VJ", flightNumber: "VJ802", origin: "BKK", destination: "SGN", departTime: "07:45", arriveTime: "09:20", durationMinutes: 95, aircraft: "A321neo-LCC" },
      ],
    },
    {
      source: "Skyscanner",
      priceIdr: 1620000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "VN", flightNumber: "VN602", origin: "BKK", destination: "SGN", departTime: "13:10", arriveTime: "14:45", durationMinutes: 95, aircraft: "A321neo-FS" },
      ],
    },
    {
      source: "AirAsia.com",
      priceIdr: 1090000,
      refund: "non-refundable",
      rescheduleAllowed: false,
      rescheduleFeeNote: "No reschedule",
      legs: [
        { airline: "FD", flightNumber: "FD650", origin: "BKK", destination: "SGN", departTime: "18:25", arriveTime: "20:00", durationMinutes: 95, aircraft: "A320-LCC" },
      ],
    },
  ],

  "CGK-SGN": [
    {
      // Transit via SIN — cheaper than the direct
      source: "Trip.com",
      priceIdr: 2180000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 400,000",
      layoverMinutes: 110,
      legs: [
        { airline: "TR", flightNumber: "TR281", origin: "CGK", destination: "SIN", departTime: "07:30", arriveTime: "10:15", durationMinutes: 105, aircraft: "A320neo-LCC" },
        { airline: "TR", flightNumber: "TR304", origin: "SIN", destination: "SGN", departTime: "12:05", arriveTime: "13:10", durationMinutes: 125, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Garuda.com",
      priceIdr: 3450000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA888", origin: "CGK", destination: "SGN", departTime: "11:20", arriveTime: "14:50", durationMinutes: 210, aircraft: "A330-300" },
      ],
    },
    {
      source: "Skyscanner",
      priceIdr: 2890000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 300,000",
      legs: [
        { airline: "VN", flightNumber: "VN632", origin: "CGK", destination: "SGN", departTime: "16:30", arriveTime: "20:00", durationMinutes: 210, aircraft: "A321neo-FS" },
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // EAST ASIA
  // ───────────────────────────────────────────────────────────────────────

  "CGK-HND": [
    {
      source: "Garuda.com",
      priceIdr: 7850000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA874", origin: "CGK", destination: "HND", departTime: "23:10", arriveTime: "08:35", durationMinutes: 445, aircraft: "B777-300ER" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 6980000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 600,000",
      legs: [
        { airline: "NH", flightNumber: "NH872", origin: "CGK", destination: "HND", departTime: "21:55", arriveTime: "07:20", durationMinutes: 445, aircraft: "B787-9" },
      ],
    },
    {
      // Transit via SIN on SQ — cheaper widebody routing
      source: "SingaporeAir.com",
      priceIdr: 5990000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      layoverMinutes: 130,
      legs: [
        { airline: "SQ", flightNumber: "SQ957", origin: "CGK", destination: "SIN", departTime: "08:30", arriveTime: "11:15", durationMinutes: 105, aircraft: "B787-10" },
        { airline: "SQ", flightNumber: "SQ634", origin: "SIN", destination: "HND", departTime: "13:25", arriveTime: "21:35", durationMinutes: 420, aircraft: "A350-900" },
      ],
    },
  ],

  "SIN-NRT": [
    {
      source: "SingaporeAir.com",
      priceIdr: 6450000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ632", origin: "SIN", destination: "NRT", departTime: "09:30", arriveTime: "17:35", durationMinutes: 425, aircraft: "A350-900" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 4280000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 500,000",
      legs: [
        { airline: "TR", flightNumber: "TR808", origin: "SIN", destination: "NRT", departTime: "23:55", arriveTime: "08:05", durationMinutes: 425, aircraft: "B787-9" },
      ],
    },
    {
      source: "Skyscanner",
      priceIdr: 5320000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 400,000",
      legs: [
        { airline: "JL", flightNumber: "JL712", origin: "SIN", destination: "NRT", departTime: "11:15", arriveTime: "19:20", durationMinutes: 425, aircraft: "B787-9" },
      ],
    },
  ],

  "ICN-PVG": [
    {
      source: "Skyscanner",
      priceIdr: 2380000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 250,000",
      legs: [
        { airline: "KE", flightNumber: "KE893", origin: "ICN", destination: "PVG", departTime: "08:50", arriveTime: "10:05", durationMinutes: 135, aircraft: "A330-300" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 1740000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "MU", flightNumber: "MU5042", origin: "ICN", destination: "PVG", departTime: "14:20", arriveTime: "15:35", durationMinutes: 135, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Agoda",
      priceIdr: 2050000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "OZ", flightNumber: "OZ361", origin: "ICN", destination: "PVG", departTime: "19:00", arriveTime: "20:15", durationMinutes: 135, aircraft: "A321neo-FS" },
      ],
    },
  ],

  "HKG-TPE": [
    {
      source: "Cathaypacific.com",
      priceIdr: 1980000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "CX", flightNumber: "CX474", origin: "HKG", destination: "TPE", departTime: "10:05", arriveTime: "11:50", durationMinutes: 105, aircraft: "A330-300" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 1450000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 250,000",
      legs: [
        { airline: "BR", flightNumber: "BR856", origin: "HKG", destination: "TPE", departTime: "15:30", arriveTime: "17:15", durationMinutes: 105, aircraft: "A321neo-FS" },
      ],
    },
    {
      source: "Skyscanner",
      priceIdr: 1620000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "CI", flightNumber: "CI904", origin: "HKG", destination: "TPE", departTime: "20:10", arriveTime: "21:55", durationMinutes: 105, aircraft: "A350-900" },
      ],
    },
  ],

  "SIN-HKG": [
    {
      source: "Cathaypacific.com",
      priceIdr: 3450000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "CX", flightNumber: "CX710", origin: "SIN", destination: "HKG", departTime: "08:20", arriveTime: "12:15", durationMinutes: 235, aircraft: "A350-900" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 2180000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 350,000",
      legs: [
        { airline: "TR", flightNumber: "TR982", origin: "SIN", destination: "HKG", departTime: "13:40", arriveTime: "17:35", durationMinutes: 235, aircraft: "A321neo-LCC" },
      ],
    },
    {
      source: "SingaporeAir.com",
      priceIdr: 3190000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ860", origin: "SIN", destination: "HKG", departTime: "18:00", arriveTime: "21:55", durationMinutes: 235, aircraft: "B787-10" },
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // SOUTH ASIA
  // ───────────────────────────────────────────────────────────────────────

  "SIN-DEL": [
    {
      source: "SingaporeAir.com",
      priceIdr: 4980000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ402", origin: "SIN", destination: "DEL", departTime: "08:55", arriveTime: "12:25", durationMinutes: 330, aircraft: "B787-10" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 3450000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 500,000",
      legs: [
        { airline: "AI", flightNumber: "AI381", origin: "SIN", destination: "DEL", departTime: "13:50", arriveTime: "17:20", durationMinutes: 330, aircraft: "B787-9" },
      ],
    },
    {
      // Transit via KUL on AirAsia X — cheapest
      source: "AirAsia.com",
      priceIdr: 2790000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 450,000",
      layoverMinutes: 120,
      legs: [
        { airline: "AK", flightNumber: "AK708", origin: "SIN", destination: "KUL", departTime: "07:10", arriveTime: "08:15", durationMinutes: 65, aircraft: "A320neo-LCC" },
        { airline: "D7", flightNumber: "D7182", origin: "KUL", destination: "DEL", departTime: "10:15", arriveTime: "13:05", durationMinutes: 290, aircraft: "A330-300" },
      ],
    },
  ],

  "BKK-DEL": [
    {
      source: "Skyscanner",
      priceIdr: 2980000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 300,000",
      legs: [
        { airline: "TG", flightNumber: "TG315", origin: "BKK", destination: "DEL", departTime: "08:30", arriveTime: "11:30", durationMinutes: 270, aircraft: "B787-9" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 2120000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 350,000",
      legs: [
        { airline: "FD", flightNumber: "FD138", origin: "BKK", destination: "DEL", departTime: "14:05", arriveTime: "17:05", durationMinutes: 270, aircraft: "A321neo-LCC" },
      ],
    },
    {
      source: "Agoda",
      priceIdr: 2680000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 300,000",
      legs: [
        { airline: "AI", flightNumber: "AI333", origin: "BKK", destination: "DEL", departTime: "19:40", arriveTime: "22:40", durationMinutes: 270, aircraft: "A321neo-FS" },
      ],
    },
  ],

  "BOM-CMB": [
    {
      source: "Skyscanner",
      priceIdr: 2240000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 250,000",
      legs: [
        { airline: "UL", flightNumber: "UL142", origin: "BOM", destination: "CMB", departTime: "09:15", arriveTime: "11:45", durationMinutes: 150, aircraft: "A330-300" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 1690000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 200,000",
      legs: [
        { airline: "AI", flightNumber: "AI271", origin: "BOM", destination: "CMB", departTime: "16:00", arriveTime: "18:30", durationMinutes: 150, aircraft: "A320neo-LCC" },
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // NEARBY GATEWAYS JUST OUTSIDE ASIA — Australia, Gulf, New Zealand
  // ───────────────────────────────────────────────────────────────────────

  "DPS-SYD": [
    {
      source: "Qantas.com",
      priceIdr: 5980000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "QF", flightNumber: "QF44", origin: "DPS", destination: "SYD", departTime: "14:35", arriveTime: "23:45", durationMinutes: 370, aircraft: "A330-300" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 3890000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 600,000",
      legs: [
        { airline: "JQ", flightNumber: "JQ38", origin: "DPS", destination: "SYD", departTime: "00:25", arriveTime: "09:35", durationMinutes: 370, aircraft: "B787-9" },
      ],
    },
    {
      // Transit via DRW on Jetstar — cheapest
      source: "Skyscanner",
      priceIdr: 3290000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 500,000",
      layoverMinutes: 115,
      legs: [
        { airline: "JQ", flightNumber: "JQ72", origin: "DPS", destination: "DRW", departTime: "10:10", arriveTime: "13:30", durationMinutes: 140, aircraft: "A320neo-LCC" },
        { airline: "JQ", flightNumber: "JQ673", origin: "DRW", destination: "SYD", departTime: "15:25", arriveTime: "20:10", durationMinutes: 225, aircraft: "A321neo-LCC" },
      ],
    },
  ],

  "DPS-PER": [
    {
      source: "Trip.com",
      priceIdr: 2480000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 450,000",
      legs: [
        { airline: "JQ", flightNumber: "JQ116", origin: "DPS", destination: "PER", departTime: "13:50", arriveTime: "19:25", durationMinutes: 215, aircraft: "A320neo-LCC" },
      ],
    },
    {
      source: "Garuda.com",
      priceIdr: 3680000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "GA", flightNumber: "GA728", origin: "DPS", destination: "PER", departTime: "09:30", arriveTime: "15:05", durationMinutes: 215, aircraft: "B737-800-GA" },
      ],
    },
    {
      source: "Qantas.com",
      priceIdr: 3990000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "QF", flightNumber: "QF926", origin: "DPS", destination: "PER", departTime: "16:40", arriveTime: "22:15", durationMinutes: 215, aircraft: "B737-MAX8" },
      ],
    },
  ],

  "SIN-DXB": [
    {
      source: "Emirates.com",
      priceIdr: 5980000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "EK", flightNumber: "EK433", origin: "SIN", destination: "DXB", departTime: "02:00", arriveTime: "05:35", durationMinutes: 455, aircraft: "A380-800" },
      ],
    },
    {
      source: "SingaporeAir.com",
      priceIdr: 5640000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ494", origin: "SIN", destination: "DXB", departTime: "09:25", arriveTime: "13:00", durationMinutes: 455, aircraft: "B777-300ER" },
      ],
    },
    {
      // Transit via DOH on Qatar — cheaper
      source: "Qatarairways.com",
      priceIdr: 4980000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 500,000",
      layoverMinutes: 105,
      legs: [
        { airline: "QR", flightNumber: "QR945", origin: "SIN", destination: "DOH", departTime: "20:05", arriveTime: "23:35", durationMinutes: 450, aircraft: "A350-900" },
        { airline: "QR", flightNumber: "QR1006", origin: "DOH", destination: "DXB", departTime: "01:20", arriveTime: "02:40", durationMinutes: 80, aircraft: "A320neo-LCC" },
      ],
    },
  ],

  "CGK-DXB": [
    {
      source: "Emirates.com",
      priceIdr: 7240000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "EK", flightNumber: "EK357", origin: "CGK", destination: "DXB", departTime: "00:35", arriveTime: "05:55", durationMinutes: 555, aircraft: "B777-300ER" },
      ],
    },
    {
      // Transit via SIN — cheaper widebody connection
      source: "Qatarairways.com",
      priceIdr: 6180000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 600,000",
      layoverMinutes: 125,
      legs: [
        { airline: "QR", flightNumber: "QR957", origin: "CGK", destination: "SIN", departTime: "07:40", arriveTime: "10:25", durationMinutes: 105, aircraft: "A320neo-LCC" },
        { airline: "QR", flightNumber: "QR945", origin: "SIN", destination: "DXB", departTime: "12:30", arriveTime: "16:05", durationMinutes: 450, aircraft: "A350-900" },
      ],
    },
    {
      source: "Skyscanner",
      priceIdr: 6890000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "EY", flightNumber: "EY471", origin: "CGK", destination: "DXB", departTime: "18:50", arriveTime: "00:10", durationMinutes: 555, aircraft: "B787-9" },
      ],
    },
  ],

  "SIN-AKL": [
    {
      source: "SingaporeAir.com",
      priceIdr: 7980000,
      refund: "refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Free reschedule",
      legs: [
        { airline: "SQ", flightNumber: "SQ285", origin: "SIN", destination: "AKL", departTime: "20:25", arriveTime: "11:45", durationMinutes: 575, aircraft: "A350-900" },
      ],
    },
    {
      source: "Skyscanner",
      priceIdr: 7320000,
      refund: "partial",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 600,000",
      legs: [
        { airline: "NZ", flightNumber: "NZ283", origin: "SIN", destination: "AKL", departTime: "23:55", arriveTime: "15:10", durationMinutes: 575, aircraft: "B787-9" },
      ],
    },
    {
      source: "Trip.com",
      priceIdr: 5980000,
      refund: "non-refundable",
      rescheduleAllowed: true,
      rescheduleFeeNote: "Reschedule fee Rp 700,000",
      legs: [
        { airline: "TR", flightNumber: "TR2", origin: "SIN", destination: "AKL", departTime: "21:30", arriveTime: "12:50", durationMinutes: 575, aircraft: "B787-9" },
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
