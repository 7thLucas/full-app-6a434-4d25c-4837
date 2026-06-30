import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

/**
 * Brand mark — a minimalist upward-soaring paper airplane.
 * Uses the owner-configured logoUrl when present; otherwise renders the
 * built-in geometric paper-plane SVG tinted with the primary brand color.
 */
export function Logo({ className }: { className?: string }) {
  const { config } = useConfigurables();
  const logoUrl = config?.logoUrl;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${config?.appName ?? "App"} logo`}
        className={cn("h-9 w-9 object-contain", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-primary-foreground"
        fill="none"
      >
        {/* angular paper plane pointing up-right */}
        <path
          d="M21 3 3 10.5l6.2 2.3L21 3ZM21 3 9.2 12.8l2.3 6.2L21 3Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  const { config } = useConfigurables();
  return (
    <span
      className={cn(
        "text-xl font-extrabold tracking-tight text-primary",
        className,
      )}
    >
      {config?.appName ?? "Terbangin"}
    </span>
  );
}
