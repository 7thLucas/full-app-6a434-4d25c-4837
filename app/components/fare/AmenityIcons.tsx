import { Wifi, Tv, Plug, UtensilsCrossed, ArmchairIcon } from "lucide-react";
import type { OnboardServices } from "~/data/types";

const ICON_CLASS = "h-4 w-4";

/** Renders the onboard amenities present on a plane as small monochrome icons. */
export function AmenityIcons({ services }: { services: OnboardServices }) {
  const items: { key: string; on: boolean; icon: React.ReactNode; label: string }[] = [
    { key: "ife", on: services.ife, icon: <Tv className={ICON_CLASS} />, label: "Seatback entertainment" },
    { key: "wifi", on: services.wifi, icon: <Wifi className={ICON_CLASS} />, label: "Wi-Fi" },
    { key: "usb", on: services.usbPower, icon: <Plug className={ICON_CLASS} />, label: "USB power" },
    { key: "meal", on: services.mealIncluded, icon: <UtensilsCrossed className={ICON_CLASS} />, label: "Meal included" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((it) => (
        <span
          key={it.key}
          title={it.label}
          className={
            "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium " +
            (it.on
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted text-muted-foreground/50 line-through")
          }
        >
          {it.icon}
        </span>
      ))}
      <span
        title="Legroom"
        className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
      >
        <ArmchairIcon className={ICON_CLASS} />
        {services.legroomNote}
      </span>
    </div>
  );
}
