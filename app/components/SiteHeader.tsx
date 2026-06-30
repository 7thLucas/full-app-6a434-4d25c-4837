import { Link } from "react-router";
import { Logo, BrandWordmark } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-navbar/80 backdrop-blur supports-[backdrop-filter]:bg-navbar/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <BrandWordmark />
        </Link>
        <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground sm:inline-flex">
          Indonesia flights · decision engine
        </span>
      </div>
    </header>
  );
}
