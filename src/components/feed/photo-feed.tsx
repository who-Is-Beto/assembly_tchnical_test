"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent
} from "react";
import type { PexelsPagination, PexelsPhoto } from "@/services/pexels";
import FavoritesRail from "./favorites-rail";
import FeaturedGallery from "./featured-gallery";
import PhotoCard from "./photo-card";
import PhotoModal from "./photo-modal";
import SkeletonCard from "./skeleton-card";
import { FAVORITES_STORAGE_KEY } from "./constants";

type PhotoFeedProps = {
  query: string;
  initialPhotos: PexelsPhoto[];
  initialPage: number;
  perPage: number;
  featuredPhotos?: PexelsPhoto[];
  featuredError?: string | null;
};

const PhotoFeed = ({
  query,
  initialPhotos,
  initialPage,
  perPage,
  featuredPhotos = [],
  featuredError = null
}: PhotoFeedProps) => {
  const [photos, setPhotos] = useState<PexelsPhoto[]>(initialPhotos);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(() => initialPhotos.length >= perPage);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PexelsPhoto | null>(null);
  const [favorites, setFavorites] = useState<Record<number, PexelsPhoto>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setPhotos(initialPhotos);
    setPage(initialPage);
    setHasMore(initialPhotos.length >= perPage);
    setError(null);
  }, [initialPhotos, initialPage, perPage, query]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!stored) {
        setFavorites({});
        return;
      }

      const parsed = JSON.parse(stored) as PexelsPhoto[];
      const mapped: Record<number, PexelsPhoto> = {};
      parsed.forEach((photo) => {
        mapped[photo.id] = photo;
      });
      setFavorites(mapped);
    } catch {
      setFavorites({});
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const values = Object.values(favorites);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(values));
  }, [favorites]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedPhoto]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  useEffect(() => {
    if (!selectedPhoto) return;
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [selectedPhoto]);

  const toggleFavorite = useCallback((photo: PexelsPhoto) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[photo.id]) {
        delete next[photo.id];
      } else {
        next[photo.id] = photo;
      }
      return next;
    });
  }, []);

  const favoritePhotos = useMemo(() => Object.values(favorites), [favorites]);

  const fetchNextPage = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/pexels/search?query=${encodeURIComponent(
          query
        )}&page=${nextPage}&perPage=${perPage}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load additional photos (status ${response.status}).`
        );
      }

      const data = (await response.json()) as PexelsPagination<PexelsPhoto>;

      setPhotos((prev) => [...prev, ...data.photos]);
      setPage(nextPage);

      const noMoreResults =
        !data.photos.length || data.photos.length < perPage || !data.next_page;
      setHasMore(!noMoreResults);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load additional photos."
      );
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, page, perPage, query]);

  useEffect(() => {
    if (!hasMore) {
      return undefined;
    }

    const node = sentinelRef.current;
    if (!node) {
      return undefined;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1
      }
    );

    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [fetchNextPage, hasMore]);

  const handleBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        setSelectedPhoto(null);
      }
    },
    []
  );

  const skeletonCount = Math.min(6, Math.max(3, Math.round(perPage / 4)));

  return (
    <>
      {featuredError && (
        <p
          className="mt-8 rounded-lg border border-amber-200 bg-amber-50/20 px-4 py-3 text-sm text-amber-600 dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-200"
          role="alert"
        >
          {featuredError}
        </p>
      )}

      {!featuredError && featuredPhotos.length > 0 && (
        <FeaturedGallery
          photos={featuredPhotos}
          favorites={favorites}
          activePhotoId={selectedPhoto?.id}
          onSelect={setSelectedPhoto}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {error && (
        <p
          className="mt-8 rounded-lg border border-red-300 bg-red-50/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}

      <FavoritesRail photos={favoritePhotos} onSelect={setSelectedPhoto} />

      <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onSelect={setSelectedPhoto}
            onToggleFavorite={toggleFavorite}
            isFavorite={Boolean(favorites[photo.id])}
            isActive={selectedPhoto?.id === photo.id}
          />
        ))}
        {isLoading &&
          Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-1 w-full"
          aria-hidden="true"
          data-testid="feed-sentinel"
        />
      )}

      {isLoading && (
        <div
          className="mt-6 flex items-center justify-center gap-2 text-sm text-hero-muted"
          role="status"
        >
          <span
            className="inline-flex h-2 w-2 animate-ping rounded-full bg-current"
            aria-hidden="true"
          />
          Loading more photos…
        </div>
      )}

      {!hasMore && !error && (
        <div
          className="mt-10 text-center text-sm text-hero-muted"
          role="status"
        >
          <p>You&apos;ve reached the end of available results.</p>
        </div>
      )}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isFavorite={Boolean(favorites[selectedPhoto.id])}
          closeButtonRef={closeButtonRef}
          onClose={() => setSelectedPhoto(null)}
          onToggleFavorite={toggleFavorite}
          onBackdropClick={handleBackdropClick}
        />
      )}
    </>
  );
};

export default PhotoFeed;
