import { ArrowUpRight, BadgeCheck, Plane, TrendingDown } from "lucide-react";
import type { DecisionResult } from "~/data/types";
import { formatPrice, formatDuration } from "~/data/format";
import { AmenityIcons } from "./AmenityIcons";
import { FlightTypePill, TermsPill, ReschedulePill } from "./Pills";

interface BestPickCardProps {
  decision: DecisionResult;
  currencyLabel: string;
}

/** The full-width hero "Best decision · Buy here" card on the results page. */
export function BestPickCard({ decision, currencyLabel }: BestPickCardProps) {
  const best = decision.best;
  if (!best) return null;
  const o = best.option;
  const firstLeg = o.legs[0];
  const lastLeg = o.legs[o.legs.length - 1];

  return (
    <div className="overflow-hidden rounded-3xl bg-secondary/60 ring-1 ring-primary/20">
      {/* transit savings banner */}
      {decision.transitSavings && (
        <div className="flex items-center gap-2 bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground sm:px-7">
          <TrendingDown className="h-4 w-4 shrink-0" />
          Transit via {decision.transitSavings.viaAirports.join(", ")} saves{" "}
          {formatPrice(decision.transitSavings.amountIdr, currencyLabel)} vs the
          cheapest direct.
        </div>
      )}

      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
            <BadgeCheck className="h-3.5 w-3.5" />
            Best decision · Buy here
          </span>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          {/* itinerary */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <FlightTypePill option={o} />
              <TermsPill refund={o.terms.refund} />
              <ReschedulePill option={o} />
            </div>

            <div className="mt-5 flex items-center gap-5">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-foreground">
                  {firstLeg.departTime}
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {o.legs[0].origin}
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <div className="text-xs font-medium text-muted-foreground">
                  {formatDuration(o.totalDurationMinutes)}
                </div>
                <div className="my-1 flex w-full items-center gap-1">
                  <span className="h-px flex-1 bg-primary/30" />
                  <Plane className="h-4 w-4 rotate-90 text-primary" />
                  <span className="h-px flex-1 bg-primary/30" />
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  {o.isDirect
                    ? "Direct"
                    : `via ${o.connectionAirports.join(", ")} · ${formatDuration(o.layoverMinutes)} layover`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-foreground">
                  {lastLeg.arriveTime}
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {lastLeg.destination}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              {o.legs.map((leg, i) => (
                <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-semibold text-foreground">
                    {leg.airline.name}
                  </span>
                  <span className="text-muted-foreground">{leg.flightNumber}</span>
                  <span className="rounded-md bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
                    {leg.aircraft.model}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <AmenityIcons services={firstLeg.aircraft.services} />
            </div>
          </div>

          {/* price + reason + CTA */}
          <div className="rounded-2xl bg-card p-5 ring-1 ring-border">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recommended on {o.source}
            </div>
            <div className="mt-1 text-4xl font-extrabold text-foreground">
              {formatPrice(o.priceIdr, currencyLabel)}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Why this pick: </span>
              {best.reason}.
            </p>
            <a
              href={o.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book on {o.source}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              You complete the purchase on {o.source}. Terbangin doesn’t issue
              tickets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
