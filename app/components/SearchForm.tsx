import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeftRight, Search } from "lucide-react";
import { AIRPORTS } from "~/data/reference";
import type { FlightType } from "~/data/types";
import { cn } from "~/lib/utils";

const FLIGHT_TYPES: { value: FlightType; label: string }[] = [
  { value: "both", label: "Both" },
  { value: "direct", label: "Direct" },
  { value: "transit", label: "Transit" },
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface SearchFormProps {
  initial?: {
    origin?: string;
    destination?: string;
    date?: string;
    flightType?: FlightType;
  };
  compact?: boolean;
}

export function SearchForm({ initial, compact }: SearchFormProps) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState(initial?.origin ?? "CGK");
  const [destination, setDestination] = useState(initial?.destination ?? "DPS");
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [flightType, setFlightType] = useState<FlightType>(
    initial?.flightType ?? "both",
  );

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      date,
      type: flightType,
    });
    navigate(`/results?${params.toString()}`);
  }

  const fieldCls =
    "w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring";
  const labelCls =
    "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground";

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-3xl bg-card p-5 ring-1 ring-border sm:p-6",
        compact ? "" : "shadow-sm",
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr]">
        <div>
          <label className={labelCls} htmlFor="origin">
            From
          </label>
          <select
            id="origin"
            className={fieldCls}
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          >
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-center">
          <button
            type="button"
            onClick={swap}
            aria-label="Swap origin and destination"
            className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground ring-1 ring-border transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        <div>
          <label className={labelCls} htmlFor="destination">
            To
          </label>
          <select
            id="destination"
            className={fieldCls}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="date">
            Departure
          </label>
          <input
            id="date"
            type="date"
            className={fieldCls}
            value={date}
            min={todayIso()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className={labelCls}>Flight type</span>
          <div className="inline-flex rounded-xl bg-muted p-1">
            {FLIGHT_TYPES.map((ft) => (
              <button
                key={ft.value}
                type="button"
                onClick={() => setFlightType(ft.value)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
                  flightType === ft.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {ft.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Search className="h-4 w-4" />
          Find the best fare
        </button>
      </div>
    </form>
  );
}
