import { Link } from "react-router";
import { Info } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { SiteHeader } from "~/components/SiteHeader";
import { SearchForm } from "~/components/SearchForm";
import { SAMPLE_ROUTES } from "~/data/mock-fares";
import { AIRPORT_BY_CODE } from "~/data/reference";

export function meta() {
  return [
    { title: "Terbangin — Stop comparing tabs. Get the answer." },
    {
      name: "description",
      content:
        "A flight decision engine for Indonesia. Compare fares across booking sites and get one trusted 'buy here' recommendation.",
    },
  ];
}

export default function IndexPage() {
  const { config } = useConfigurables();

  const heroImage = config?.heroImageUrl;
  const steps = config?.howItWorksSteps ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div>
            {config?.heroEyebrow && (
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground ring-1 ring-border">
                {config.heroEyebrow}
              </span>
            )}
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              {config?.heroHeadlineLine1 ?? "Stop comparing tabs."}
              <br />
              <span className="text-primary">
                {config?.heroHeadlineLine2 ?? "Get the answer."}
              </span>
            </h1>
            {config?.heroSubtitle && (
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                {config.heroSubtitle}
              </p>
            )}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-border lg:aspect-auto lg:h-80">
            {heroImage ? (
              <>
                <img
                  src={heroImage}
                  alt="Flight over the Indonesian archipelago"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-secondary" />
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="mx-auto -mt-2 max-w-6xl px-5 pb-4 sm:px-8">
          <SearchForm />
          {config?.sampleDataNotice && (
            <div className="mx-auto mt-3 flex max-w-3xl items-start gap-2 rounded-xl bg-chart-4/10 px-3 py-2 text-xs text-foreground/70">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chart-4" />
              <span>{config.sampleDataNotice}</span>
            </div>
          )}

          {/* popular routes */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Popular:
            </span>
            {SAMPLE_ROUTES.slice(0, 6).map((r) => {
              const o = AIRPORT_BY_CODE[r.origin];
              const d = AIRPORT_BY_CODE[r.destination];
              return (
                <Link
                  key={`${r.origin}-${r.destination}`}
                  to={`/results?from=${r.origin}&to=${r.destination}&type=both`}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
                >
                  {o?.city ?? r.origin} → {d?.city ?? r.destination}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {config?.howItWorksHeading ?? "How it works"}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-card p-6 ring-1 ring-border"
            >
              <div className="text-2xl">{s.icon}</div>
              <h3 className="mt-3 text-lg font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROMISE */}
      {config?.promiseText && (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="rounded-3xl bg-foreground p-8 sm:p-10">
            {config?.promiseEyebrow && (
              <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground/60">
                {config.promiseEyebrow}
              </div>
            )}
            <p className="mt-3 max-w-3xl text-xl font-semibold leading-relaxed text-background">
              {config.promiseText}
            </p>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  const { config } = useConfigurables();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="text-sm font-extrabold tracking-tight text-primary">
          {config?.appName ?? "Terbangin"}
        </div>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {config?.footerNote}
        </p>
      </div>
    </footer>
  );
}
