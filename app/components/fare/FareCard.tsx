import { ArrowUpRight, Plane } from "lucide-react";
import type { ScoredOption } from "~/data/types";
import { formatPrice, formatDuration } from "~/data/format";
import { AmenityIcons } from "./AmenityIcons";
import { FlightTypePill, TermsPill, ReschedulePill } from "./Pills";

interface FareCardProps {
  scored: ScoredOption;
  rank: number;
  currencyLabel: string;
}

/** A single ranked comparison row/card on the results page. */
export function FareCard({ scored, rank, currencyLabel }: FareCardProps) {
  const o = scored.option;
  const firstLeg = o.legs[0];
  const lastLeg = o.legs[o.legs.length - 1];

  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:justify-between">
        {/* Left: itinerary */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
              {rank}
            </span>
            <FlightTypePill option={o} />
            <TermsPill refund={o.terms.refund} />
            <ReschedulePill option={o} />
          </div>

          {/* time row */}
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <div className="text-xl font-extrabold text-foreground">
                {firstLeg.departTime}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                {o.legs[0].origin}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div className="text-xs font-medium text-muted-foreground">
                {formatDuration(o.totalDurationMinutes)}
              </div>
              <div className="my-1 flex w-full items-center gap-1">
                <span className="h-px flex-1 bg-border" />
                <Plane className="h-3.5 w-3.5 rotate-90 text-primary" />
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {o.isDirect
                  ? "Direct"
                  : `via ${o.connectionAirports.join(", ")} · ${formatDuration(o.layoverMinutes)} layover`}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-foreground">
                {lastLeg.arriveTime}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                {lastLeg.destination}
              </div>
            </div>
          </div>

          {/* airline + aircraft per leg */}
          <div className="mt-4 space-y-2">
            {o.legs.map((leg, i) => (
              <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold text-foreground">
                  {leg.airline.name}
                </span>
                <span className="text-muted-foreground">{leg.flightNumber}</span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {leg.aircraft.model}
                </span>
              </div>
            ))}
          </div>

          {/* amenities of the operating aircraft (show first leg's plane) */}
          <div className="mt-3">
            <AmenityIcons services={firstLeg.aircraft.services} />
          </div>

          {/* engine reason */}
          <p className="mt-3 text-sm text-muted-foreground">{scored.reason}</p>
        </div>

        {/* Right: price + CTA */}
        <div className="flex shrink-0 flex-col items-stretch justify-between gap-3 border-t border-border pt-4 sm:w-48 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              on {o.source}
            </div>
            <div className="mt-1 text-2xl font-extrabold text-foreground">
              {formatPrice(o.priceIdr, currencyLabel)}
            </div>
          </div>
          <a
            href={o.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-foreground ring-1 ring-border transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Book on {o.source}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
