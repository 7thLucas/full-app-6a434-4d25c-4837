// ───────────────────────────────────────────────────────────────────────────
// Reference data — real airports, airlines, aircraft and the booking sources
// Terbangin compares across. Coverage spans all of Asia plus nearby gateways
// just outside Asia (Australia, the Gulf, New Zealand) that Asian travelers
// commonly fly. Used to build the mock dataset and to power the search
// autocompletes.
// ───────────────────────────────────────────────────────────────────────────

import type { Airport, Airline, Aircraft, OnboardServices } from "./types";

export const AIRPORTS: Airport[] = [
  // ── Indonesia (home market) ──────────────────────────────────────────────
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
  // ── Southeast Asia ───────────────────────────────────────────────────────
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur Intl", country: "Malaysia" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
  { code: "DMK", city: "Bangkok", name: "Don Mueang Intl", country: "Thailand" },
  { code: "MNL", city: "Manila", name: "Ninoy Aquino Intl", country: "Philippines" },
  { code: "SGN", city: "Ho Chi Minh City", name: "Tan Son Nhat Intl", country: "Vietnam" },
  { code: "HAN", city: "Hanoi", name: "Noi Bai Intl", country: "Vietnam" },
  { code: "RGN", city: "Yangon", name: "Yangon Intl", country: "Myanmar" },
  { code: "PNH", city: "Phnom Penh", name: "Phnom Penh Intl", country: "Cambodia" },
  { code: "BWN", city: "Bandar Seri Begawan", name: "Brunei Intl", country: "Brunei" },
  // ── East Asia ────────────────────────────────────────────────────────────
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
  { code: "NRT", city: "Tokyo", name: "Narita Intl", country: "Japan" },
  { code: "KIX", city: "Osaka", name: "Kansai Intl", country: "Japan" },
  { code: "ICN", city: "Seoul", name: "Incheon Intl", country: "South Korea" },
  { code: "PVG", city: "Shanghai", name: "Pudong Intl", country: "China" },
  { code: "PEK", city: "Beijing", name: "Capital Intl", country: "China" },
  { code: "CAN", city: "Guangzhou", name: "Baiyun Intl", country: "China" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong Intl", country: "Hong Kong" },
  { code: "TPE", city: "Taipei", name: "Taoyuan Intl", country: "Taiwan" },
  // ── South Asia ───────────────────────────────────────────────────────────
  { code: "DEL", city: "Delhi", name: "Indira Gandhi Intl", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Intl", country: "India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda Intl", country: "India" },
  { code: "CMB", city: "Colombo", name: "Bandaranaike Intl", country: "Sri Lanka" },
  { code: "DAC", city: "Dhaka", name: "Hazrat Shahjalal Intl", country: "Bangladesh" },
  // ── Nearby gateways just outside Asia ────────────────────────────────────
  // Australia
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia" },
  { code: "MEL", city: "Melbourne", name: "Melbourne (Tullamarine)", country: "Australia" },
  { code: "PER", city: "Perth", name: "Perth Intl", country: "Australia" },
  { code: "DRW", city: "Darwin", name: "Darwin Intl", country: "Australia" },
  // Gulf / Middle East
  { code: "DXB", city: "Dubai", name: "Dubai Intl", country: "United Arab Emirates" },
  { code: "DOH", city: "Doha", name: "Hamad Intl", country: "Qatar" },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed Intl", country: "United Arab Emirates" },
  // New Zealand
  { code: "AKL", city: "Auckland", name: "Auckland Intl", country: "New Zealand" },
];

export const AIRPORT_BY_CODE: Record<string, Airport> = Object.fromEntries(
  AIRPORTS.map((a) => [a.code, a]),
);

export const AIRLINES = {
  // Indonesia
  GA: { code: "GA", name: "Garuda Indonesia" },
  JT: { code: "JT", name: "Lion Air" },
  QG: { code: "QG", name: "Citilink" },
  ID: { code: "ID", name: "Batik Air" },
  QZ: { code: "QZ", name: "AirAsia Indonesia" },
  IU: { code: "IU", name: "Super Air Jet" },
  IP: { code: "IP", name: "Pelita Air" },
  IW: { code: "IW", name: "Wings Air" },
  // Southeast Asia
  SQ: { code: "SQ", name: "Singapore Airlines" },
  TR: { code: "TR", name: "Scoot" },
  MH: { code: "MH", name: "Malaysia Airlines" },
  AK: { code: "AK", name: "AirAsia" },
  D7: { code: "D7", name: "AirAsia X" },
  TG: { code: "TG", name: "Thai Airways" },
  FD: { code: "FD", name: "Thai AirAsia" },
  PR: { code: "PR", name: "Philippine Airlines" },
  VN: { code: "VN", name: "Vietnam Airlines" },
  VJ: { code: "VJ", name: "VietJet Air" },
  // East Asia
  JL: { code: "JL", name: "Japan Airlines" },
  NH: { code: "NH", name: "All Nippon Airways" },
  KE: { code: "KE", name: "Korean Air" },
  OZ: { code: "OZ", name: "Asiana Airlines" },
  CX: { code: "CX", name: "Cathay Pacific" },
  CI: { code: "CI", name: "China Airlines" },
  BR: { code: "BR", name: "EVA Air" },
  CA: { code: "CA", name: "Air China" },
  MU: { code: "MU", name: "China Eastern" },
  // South Asia
  AI: { code: "AI", name: "Air India" },
  UL: { code: "UL", name: "SriLankan Airlines" },
  // Gulf / Middle East
  EK: { code: "EK", name: "Emirates" },
  QR: { code: "QR", name: "Qatar Airways" },
  EY: { code: "EY", name: "Etihad Airways" },
  // Oceania
  QF: { code: "QF", name: "Qantas" },
  JQ: { code: "JQ", name: "Jetstar" },
  NZ: { code: "NZ", name: "Air New Zealand" },
} as const satisfies Record<string, Airline>;

export const BOOKING_SOURCES = [
  "Traveloka",
  "Tiket.com",
  "Pegipegi",
  "Garuda.com",
  "Citilink.co.id",
  "AirAsia.com",
  "Lionair.co.id",
  // Pan-Asian / global aggregators and airline sites
  "Trip.com",
  "Skyscanner",
  "Agoda",
  "Expedia",
  "SingaporeAir.com",
  "Cathaypacific.com",
  "Emirates.com",
  "Qatarairways.com",
  "Qantas.com",
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
  "Trip.com": "https://www.trip.com/flights/",
  Skyscanner: "https://www.skyscanner.net/",
  Agoda: "https://www.agoda.com/flights/",
  Expedia: "https://www.expedia.com/Flights",
  "SingaporeAir.com": "https://www.singaporeair.com/",
  "Cathaypacific.com": "https://www.cathaypacific.com/",
  "Emirates.com": "https://www.emirates.com/",
  "Qatarairways.com": "https://www.qatarairways.com/",
  "Qantas.com": "https://www.qantas.com/",
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
  // ── Wide-body long-haul (full service, premium amenities) ────────────────
  "B787-10": {
    model: "Boeing 787-10 Dreamliner",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 32in" }),
  },
  "B787-9": {
    model: "Boeing 787-9 Dreamliner",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 32in" }),
  },
  "B777-300ER": {
    model: "Boeing 777-300ER",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 32in" }),
  },
  "A350-900": {
    model: "Airbus A350-900",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 32in" }),
  },
  "A380-800": {
    model: "Airbus A380-800",
    services: svc({ ife: true, wifi: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 32in" }),
  },
  "A330-300": {
    model: "Airbus A330-300",
    services: svc({ ife: true, usbPower: true, mealIncluded: true, legroomNote: "Wide-body 31in" }),
  },
  // ── Regional / LCC for medium-haul Asian hops ────────────────────────────
  "A321neo-FS": {
    model: "Airbus A321neo (full service)",
    services: svc({ ife: true, usbPower: true, mealIncluded: true, legroomNote: "Standard 31in" }),
  },
  "A321neo-LCC": {
    model: "Airbus A321neo",
    services: svc({ usbPower: true, legroomNote: "Standard 29in" }),
  },
  "B737-MAX8": {
    model: "Boeing 737 MAX 8",
    services: svc({ usbPower: true, legroomNote: "Standard 30in" }),
  },
};
