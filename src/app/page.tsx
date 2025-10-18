import Hero from "@/components/hero";
import PhotoFeed from "@/components/feed/photo-feed";
import { searchPhotos, listCuratedPhotos } from "@/services/pexels";
import { titleCase } from "@/lib/strings";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DEFAULT_QUERY = "nature";
const FEATURED_TAGS = ["landscape", "architecture", "travel", "abstract", "forest", "aerial"] as const;
const TRENDING_ID = "trending-searches";

const getParamValue = (param?: string | string[]) => (Array.isArray(param) ? param[0] : param);

const sanitizeQuery = (value?: string) => (value && value.trim().length > 0 ? value.trim() : undefined);

const Home = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const rawQuery = getParamValue(params?.query);
  const query = sanitizeQuery(rawQuery) ?? DEFAULT_QUERY;

  type SearchResults = Awaited<ReturnType<typeof searchPhotos>>;
  type CuratedResults = Awaited<ReturnType<typeof listCuratedPhotos>>;

  let results: SearchResults | null = null;
  let error: string | null = null;
  let curated: CuratedResults | null = null;
  let curatedError: string | null = null;

  try {
    results = await searchPhotos({
      query,
      perPage: 24,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "We ran into a problem while loading photos. Try again in a bit.";
  }

  try {
    curated = await listCuratedPhotos({ perPage: 12 });
  } catch (err) {
    curatedError = err instanceof Error ? err.message : "Top photos are unavailable right now. Please retry soon.";
  }

  const photos = results?.photos ?? [];
  const total = results?.total_results;
  const displayQuery = titleCase(query);
  const featuredPhotos = curated?.photos ?? [];

  return (
    <main className="min-h-screen transition-colors duration-500" style={{ background: "var(--page-bg)", color: "var(--page-text)" }}>
      <Hero query={query} trendingId={TRENDING_ID} trendingTags={FEATURED_TAGS} />

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 text-hero-muted">
          <div>
            <h2 className="text-2xl font-semibold text-hero-heading md:text-3xl">{displayQuery} Photography</h2>
            {total ? <p className="text-sm text-hero-muted">Roughly {total.toLocaleString()} photos available.</p> : null}
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-hero-muted">Live Feed</p>
        </header>

        {error && (
          <p
            className="mt-8 rounded-lg border border-red-300 bg-red-50/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && photos.length === 0 && (
          <p className="mt-10 text-sm text-hero-muted" role="status">
            No photos found for “{displayQuery}”. Try another keyword from the trending list above.
          </p>
        )}

        {!error && photos.length > 0 && (
          <PhotoFeed
            initialPage={1}
            initialPhotos={photos}
            perPage={24}
            query={query}
            totalResults={total}
            featuredPhotos={featuredPhotos}
            featuredError={curatedError}
          />
        )}
      </section>
    </main>
  );
};

export default Home;
