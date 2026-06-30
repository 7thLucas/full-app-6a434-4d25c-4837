import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Info, PlaneTakeoff } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { SiteHeader } from "~/components/SiteHeader";
import { SearchForm } from "~/components/SearchForm";
import { BestPickCard } from "~/components/fare/BestPickCard";
import { FareCard } from "~/components/fare/FareCard";
import { fareProvider } from "~/data/provider";
import { decide } from "~/data/engine";
import { AIRPORT_BY_CODE } from "~/data/reference";
import type {
  DecisionResult,
  EngineConfig,
  FareSearchResult,
  FlightType,
} from "~/data/types";

export function meta() {
  return [{ title: "Results — Terbangin" }];
}

export default function ResultsPage() {
  const [params] = useSearchParams();
  const { config } = useConfigurables();

  const from = params.get("from") ?? "CGK";
  const to = params.get("to") ?? "DPS";
  const date = params.get("date") ?? new Date().toISOString().slice(0, 10);
  const type = (params.get("type") as FlightType) ?? "both";

  const currencyLabel = config?.currencyLabel ?? "Rp";

  const engineConfig: EngineConfig = useMemo(
    () => ({
      weights: {
        price: config?.engineWeights?.price ?? 60,
        terms: config?.engineWeights?.terms ?? 25,
        comfort: config?.engineWeights?.comfort ?? 15,
      },
      transitSavingsThreshold: config?.transitSavingsThreshold ?? 150000,
    }),
    [config?.engineWeights, config?.transitSavingsThreshold],
  );

  const [result, setResult] = useState<FareSearchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fareProvider
      .search({ origin: from, destination: to, date, flightType: type })
      .then((r) => {
        if (!cancelled) {
          setResult(r);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [from, to, date, type]);

  const decision: DecisionResult | null = useMemo(() => {
    if (!result) return null;
    return decide(result.options, engineConfig);
  }, [result, engineConfig]);

  const originAirport = AIRPORT_BY_CODE[from];
  const destAirport = AIRPORT_BY_CODE[to];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          New search
        </Link>

        {/* route header */}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {originAirport?.city ?? from} → {destAirport?.city ?? to}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {from} · {to} · {date} ·{" "}
              {type === "both"
                ? "Direct + transit"
                : type === "direct"
                  ? "Direct only"
                  : "Transit only"}
            </p>
          </div>
        </div>

        {/* search form (re-search) */}
        <div className="mt-5">
          <SearchForm
            compact
            initial={{ origin: from, destination: to, date, flightType: type }}
          />
        </div>

        {config?.sampleDataNotice && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-chart-4/10 px-3 py-2 text-xs text-foreground/70">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chart-4" />
            <span>{config.sampleDataNotice}</span>
          </div>
        )}

        {/* body */}
        <div className="mt-8">
          {loading ? (
            <LoadingState />
          ) : !decision || decision.ranked.length === 0 ? (
            <EmptyState from={from} to={to} />
          ) : (
            <div className="space-y-8">
              <BestPickCard decision={decision} currencyLabel={currencyLabel} />

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    All {decision.ranked.length} options, ranked
                  </h2>
                  <span className="text-xs font-medium text-muted-foreground">
                    Price {engineConfig.weights.price}% · Terms{" "}
                    {engineConfig.weights.terms}% · Comfort{" "}
                    {engineConfig.weights.comfort}%
                  </span>
                </div>
                <div className="space-y-4">
                  {decision.ranked.map((s, i) => (
                    <FareCard
                      key={s.option.id}
                      scored={s}
                      rank={i + 1}
                      currencyLabel={currencyLabel}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-48 animate-pulse rounded-3xl bg-muted" />
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function EmptyState({ from, to }: { from: string; to: string }) {
  return (
    <div className="rounded-3xl bg-card p-10 text-center ring-1 ring-border">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        <PlaneTakeoff className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-foreground">
        No sample fares for {from} → {to} yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This MVP runs on sample data for popular routes across Asia and nearby
        destinations. Try one of the popular routes from the home page, or pick a
        different flight type.
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to search
      </Link>
    </div>
  );
}
