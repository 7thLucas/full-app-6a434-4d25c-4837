import { Wifi, Tv, Plug, UtensilsCrossed, ArmchairIcon, Check, X } from "lucide-react";
import type { OnboardServices } from "~/data/types";

const ICON_CLASS = "h-4 w-4 shrink-0";

/**
 * Renders the onboard amenities present on a plane as readable text labels
 * (each paired with an icon), so a traveler can tell at a glance exactly what
 * the operating aircraft offers — not icon-only. Amenities that are NOT
 * available are still listed, struck through, so the comparison is explicit.
 */
export function AmenityIcons({ services }: { services: OnboardServices }) {
  const items: { key: string; on: boolean; icon: React.ReactNode; label: string }[] = [
    {
      key: "ife",
      on: services.ife,
      icon: <Tv className={ICON_CLASS} />,
      label: "Personal entertainment screen",
    },
    { key: "wifi", on: services.wifi, icon: <Wifi className={ICON_CLASS} />, label: "Wi-Fi" },
    { key: "usb", on: services.usbPower, icon: <Plug className={ICON_CLASS} />, label: "USB charging" },
    {
      key: "meal",
      on: services.mealIncluded,
      icon: <UtensilsCrossed className={ICON_CLASS} />,
      label: "Meal included",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((it) => (
        <span
          key={it.key}
          className={
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium " +
            (it.on
              ? "bg-secondary text-secondary-foreground ring-1 ring-border"
              : "bg-muted text-muted-foreground/60")
          }
        >
          {it.icon}
          <span className={it.on ? "" : "line-through"}>{it.label}</span>
          {it.on ? (
            <Check className="h-3 w-3 shrink-0 text-primary" />
          ) : (
            <X className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          )}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <ArmchairIcon className={ICON_CLASS} />
        <span>{services.legroomNote}</span>
      </span>
    </div>
  );
}
