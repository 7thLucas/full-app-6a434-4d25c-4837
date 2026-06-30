// ───────────────────────────────────────────────────────────────────────────
// Reference data — real Indonesian airports, airlines, aircraft and the
// booking sources Terbangin compares across. Used to build the mock dataset
// and to power the search autocompletes.
// ───────────────────────────────────────────────────────────────────────────

import type { Airport, Airline, Aircraft, OnboardServices } from "./types";

export const AIRPORTS: Airport[] = [
  { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta Intl", country: "Indonesia" },
  { code: "DPS", city: "Denpasar (Bali)", name: "Ngurah Rai Intl", country: "Indonesia" },
  { code: "SUB", city: "Surabaya", name: "Juanda Intl", country: "Indonesia" },
  { code: "UPG", city: "Makassar", name: "Sultan Hasanuddin Intl", country: "Indonesia" },
  { code: "KNO", city: "Medan", name: "Kualanamu Intl", country: "Indonesia" },
  { code: "JOG", city: "Yogyakarta", name: "Adisutjipto", country: "Indonesia" },
  { code: "YIA", city: "Yogyakarta", name: "Yogyakarta Intl (Kulon Progo)", country: "Indonesia" },
  { code: "BPN", city: "Balikpapan", name: "Sultan Aji Muhammad Sulaiman", country: "Indonesia" },
  { code: "PKU", city: "Pekanbaru", name: "Sultan Syarif Kasim II", country: "Indonesia" },
  { code: "BDO", city: "Bandung", name: "Husein Sastranegara", country: "Indonesia" },
  { code: "LOP", city: "Lombok", name: "Lombok Intl", country: "Indonesia" },
  { code: "PNK", city: "Pontianak", name: "Supadio", country: "Indonesia" },
  { code: "SRG", city: "Semarang", name: "Ahmad Yani Intl", country: "Indonesia" },
  // International endpoints connected to Indonesia
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur Intl", country: "Malaysia" },
];

export const AIRPORT_BY_CODE: Record<string, Airport> = Object.fromEntries(
  AIRPORTS.map((a) => [a.code, a]),
);

export const AIRLINES = {
  GA: { code: "GA", name: "Garuda Indonesia" },
  JT: { code: "JT", name: "Lion Air" },
  QG: { code: "QG", name: "Citilink" },
  ID: { code: "ID", name: "Batik Air" },
  QZ: { code: "QZ", name: "AirAsia Indonesia" },
  IU: { code: "IU", name: "Super Air Jet" },
  IP: { code: "IP", name: "Pelita Air" },
  IW: { code: "IW", name: "Wings Air" },
  SQ: { code: "SQ", name: "Singapore Airlines" },
} as const satisfies Record<string, Airline>;

export const BOOKING_SOURCES = [
  "Traveloka",
  "Tiket.com",
  "Pegipegi",
  "Garuda.com",
  "Citilink.co.id",
  "AirAsia.com",
  "Lionair.co.id",
] as const;

export type BookingSource = (typeof BOOKING_SOURCES)[number];

/** Realistic deep-link-ish booking URLs (MVP redirects to the site home). */
export const SOURCE_URL: Record<string, string> = {
  Traveloka: "https://www.traveloka.com/en-id/flight",
  "Tiket.com": "https://www.tiket.com/pesawat",
  Pegipegi: "https://www.pegipegi.com/flight/",
  "Garuda.com": "https://www.garuda-indonesia.com/",
  "Citilink.co.id": "https://www.citilink.co.id/",
  "AirAsia.com": "https://www.airasia.com/",
  "Lionair.co.id": "https://www.lionair.co.id/",
};

// ── Aircraft catalog with realistic onboard amenities ──────────────────────

function svc(p: Partial<OnboardServices>): OnboardServices {
  return {
    ife: false,
    wifi: false,
    usbPower: false,
    mealIncluded: false,
    legroomNote: "Standard 29in",
    ...p,
  };
}

export const AIRCRAFT: Record<string, Aircraft> = {
  // Full-service / wide cabin
  "A330-900neo": {
    model: "Airbus A330-900neo",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 32in" }),
  },
  "B737-800-GA": {
    model: "Boeing 737-800 (full service)",
    services: svc({ ife: true, usbPower: true, mealIncluded: true, legroomNote: "Standard 31in" }),
  },
  "A320neo-GA": {
    model: "Airbus A320neo (full service)",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Standard 30in" }),
  },
  // Batik Air — full service narrow-body
  "A320-Batik": {
    model: "Airbus A320 (Batik)",
    services: svc({ usbPower: true, mealIncluded: true, legroomNote: "Standard 30in" }),
  },
  // LCC narrow-body
  "A320neo-LCC": {
    model: "Airbus A320neo",
    services: svc({ usbPower: true, legroomNote: "Standard 29in" }),
  },
  "B737-800-LCC": {
    model: "Boeing 737-800",
    services: svc({ legroomNote: "Standard 29in" }),
  },
  "A320-LCC": {
    model: "Airbus A320",
    services: svc({ legroomNote: "Standard 29in" }),
  },
  // Pelita — newer narrow-body
  "A320-Pelita": {
    model: "Airbus A320",
    services: svc({ usbPower: true, legroomNote: "Standard 30in" }),
  },
  // Turboprop for short regional hops
  "ATR72-600": {
    model: "ATR 72-600",
    services: svc({ legroomNote: "Regional 29in" }),
  },
  // SQ widebody for intl
  "B787-10": {
    model: "Boeing 787-10 Dreamliner",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 32in" }),
  },
};
