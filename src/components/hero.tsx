"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/theme/theme-toggle";
import { titleCase } from "@/lib/strings";

type HeroProps = {
  query: string;
  trendingTags: readonly string[];
  trendingId: string;
};

const Hero = ({ query, trendingTags, trendingId }: HeroProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const [term, setTerm] = useState(query);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTerm(query);
  }, [query]);

  const updateQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(currentParams?.toString() ?? "");
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        params.set("query", trimmed);
      } else {
        params.delete("query");
      }
      const queryString = params.toString();
      return queryString.length > 0 ? `${pathname}?${params.toString()}` : pathname;
    },
    [currentParams, pathname],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextUrl = updateQueryString(term);
      startTransition(() => {
        router.push(nextUrl);
      });
    },
    [router, term, updateQueryString],
  );

  const isSubmitDisabled = useMemo(() => term.trim().length === 0 || isPending, [isPending, term]);

  return (
    <header className="theme-hero">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-16 pt-20 md:px-6 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-6 md:max-w-3xl">
            <p className="text-xs uppercase tracking-[0.4em] text-hero-muted">Pexels Showcase</p>
            <h1 className="text-4xl font-semibold leading-tight text-hero-heading transition-colors md:text-5xl lg:text-6xl">
              Discover royalty-free photography, inspired by Unsplash.
            </h1>
            <p className="text-base text-hero-subheading transition-colors md:text-lg">
              Explore a curated feed of Pexels images. Start with our featured search below, or try your own keywords to
              see what’s trending. Hover for quick looks, save favorites locally, and keep scrolling for fresh inspiration.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <form
          className="surface-panel flex w-full flex-col gap-3 rounded-2xl p-4 shadow-lg shadow-slate-950/10 backdrop-blur-sm transition md:flex-row md:items-end md:gap-4 md:p-5"
          aria-describedby={trendingId}
          onSubmit={handleSubmit}
        >
          <div className="flex-1">
            <label className="text-sm font-medium text-hero-muted" htmlFor="hero-search">
              Search the Pexels catalog
            </label>
            <input
              aria-label="Search photos"
              className="input-surface mt-2 w-full rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
              value={term}
              id="hero-search"
              name="query"
              placeholder="Search for beaches, portraits, minimal..."
              type="text"
              onChange={(event) => setTerm(event.target.value)}
            />
          </div>
          <div className="md:w-auto md:self-stretch">
            <button
              className="btn-primary w-full cursor-pointer rounded-xl px-5 py-3 text-sm font-semibold md:px-6 md:text-base disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitDisabled}
              aria-busy={isPending}
            >
              {isPending ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        <nav aria-labelledby={trendingId} className="border-t border-transparent pt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-hero-muted md:text-base">
            <p className="text-hero-muted" id={trendingId}>
              Try one of these trending topics:
            </p>
            <ul className="flex flex-wrap items-center gap-2">
              {trendingTags.map((tag) => (
                <li key={tag}>
                  <Link
                    className="tag-pill inline-flex cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition"
                    href={`/?query=${encodeURIComponent(tag)}`}
                  >
                    {titleCase(tag)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Hero;
