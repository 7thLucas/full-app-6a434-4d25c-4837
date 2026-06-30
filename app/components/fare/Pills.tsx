import { cn } from "~/lib/utils";
import type { FareOption, RefundPolicy } from "~/data/types";

export function TermsPill({ refund }: { refund: RefundPolicy }) {
  const map: Record<RefundPolicy, { label: string; cls: string }> = {
    refundable: {
      label: "Refundable",
      cls: "bg-accent/10 text-accent ring-1 ring-accent/30",
    },
    partial: {
      label: "Partial refund",
      cls: "bg-secondary text-secondary-foreground ring-1 ring-border",
    },
    "non-refundable": {
      label: "Non-refundable",
      cls: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
    },
  };
  const m = map[refund];
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", m.cls)}>
      {m.label}
    </span>
  );
}

export function FlightTypePill({ option }: { option: FareOption }) {
  if (option.isDirect) {
    return (
      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
        Direct
      </span>
    );
  }
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-border">
      {option.stops} stop{option.stops > 1 ? "s" : ""} · via{" "}
      {option.connectionAirports.join(", ")}
    </span>
  );
}

export function ReschedulePill({ option }: { option: FareOption }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {option.terms.rescheduleAllowed
        ? option.terms.rescheduleFeeNote
        : "No reschedule"}
    </span>
  );
}
