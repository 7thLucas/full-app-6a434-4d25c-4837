/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type THowItWorksStep = {
  icon?: string;
  title: string;
  description: string;
};

export type TEngineWeights = {
  price?: number;
  terms?: number;
  comfort?: number;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;
  // Brand copy
  tagline: string;
  heroEyebrow?: string;
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  sampleDataNotice?: string;
  footerNote?: string;
  // How it works
  howItWorksHeading?: string;
  howItWorksSteps?: THowItWorksStep[];
  // Promise / trust
  promiseEyebrow?: string;
  promiseText?: string;
  // Decision engine
  engineWeights?: TEngineWeights;
  transitSavingsThreshold?: number;
  currencyLabel?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Terbangin",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#ffffff",
    foreground:        "#0f172a",
    // Card
    card:              "#ffffff",
    cardForeground:    "#0f172a",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#0f172a",
    // Primary — sky-blue
    primary:           "#0284c7",
    primaryForeground: "#ffffff",
    // Secondary — soft sky tint
    secondary:           "#e0f2fe",
    secondaryForeground: "#075985",
    // Muted
    muted:           "#f1f5f9",
    mutedForeground: "#64748b",
    // Accent — emerald for savings/positive
    accent:           "#059669",
    accentForeground: "#ffffff",
    // Destructive — rose
    destructive:           "#e11d48",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#e2e8f0",
    input:  "#e2e8f0",
    ring:   "#0284c7",
    // Charts
    chart1: "#0284c7",
    chart2: "#059669",
    chart3: "#0ea5e9",
    chart4: "#f59e0b",
    chart5: "#0f172a",
    // Navbar
    navbarBackground: "#ffffff",
    // Sidebar
    sidebarBackground:        "#f8fafc",
    sidebarForeground:        "#334155",
    sidebarPrimary:           "#0284c7",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#e0f2fe",
    sidebarAccentForeground:  "#075985",
    sidebarBorder:            "#e2e8f0",
    sidebarRing:              "#0284c7",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },
  // ── Brand copy ───────────────────────────────────────────────────────
  tagline: "Stop comparing tabs. Get the answer.",
  heroEyebrow: "Asia & Nearby Flights · Decision Engine",
  heroHeadlineLine1: "Stop comparing tabs.",
  heroHeadlineLine2: "Get the answer.",
  heroSubtitle:
    "One trusted “buy here” call for flights across Asia and nearby gateways — we compare the booking sites, you book the best one.",
  heroImageUrl:
    "https://api.qb-deck.quantumbyte.ai/common/image-generation?prompt=cinematic%20aerial%20view%20of%20an%20airplane%20wing%20over%20Asia%20at%20golden%20hour%2C%20tropical%20coastlines%20and%20city%20skylines%20below%2C%20warm%20premium%20editorial%20photography",
  sampleDataNotice:
    "Demo data. Fares shown are realistic samples for routes across Asia and nearby destinations — not live prices. A real fare feed plugs in later.",
  footerNote:
    "Terbangin compares fares and recommends where to buy. It does not sell or issue tickets — you complete the purchase on the partner site.",
  // ── How it works ─────────────────────────────────────────────────────
  howItWorksHeading: "How it works",
  howItWorksSteps: [
    {
      icon: "🔎",
      title: "Search your way",
      description:
        "Enter origin, destination and date for any flight across Asia or to a nearby gateway — and pick direct, transit, or both.",
    },
    {
      icon: "⚖️",
      title: "Compare what matters",
      description:
        "Fares from multiple sites side by side — direct and cheaper transit options, plus each plane’s model and onboard services.",
    },
    {
      icon: "✅",
      title: "Get the best decision",
      description:
        "One recommendation — price weighed with terms and comfort — telling you exactly which site to buy from.",
    },
    {
      icon: "↗️",
      title: "Redirect to book",
      description:
        "One tap takes you to the chosen site to complete the purchase — no extra steps.",
    },
  ],
  // ── Promise / trust ──────────────────────────────────────────────────
  promiseEyebrow: "The core promise",
  promiseText:
    "Turn a wall of flight options into one trusted decision — and never wonder if you overpaid on a flight across Asia again.",
  // ── Decision engine ──────────────────────────────────────────────────
  engineWeights: { price: 60, terms: 25, comfort: 15 },
  transitSavingsThreshold: 150000,
  currencyLabel: "Rp",
};
