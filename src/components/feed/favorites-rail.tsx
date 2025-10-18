import Image from "next/image";
import type { PexelsPhoto } from "@/services/pexels";

type FavoritesRailProps = {
  photos: PexelsPhoto[];
  onSelect: (photo: PexelsPhoto) => void;
};

const FavoritesRail = ({ photos, onSelect }: FavoritesRailProps) => {
  if (photos.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="favorites-heading" className="rail-panel mt-10 rounded-2xl p-6 shadow-lg shadow-black/5">
      <header className="flex flex-wrap items-center justify-between gap-3 text-sm text-hero-muted">
        <h3 className="text-lg font-semibold text-hero-heading" id="favorites-heading">
          Favorites
        </h3>
        <p className="text-xs uppercase tracking-[0.3em] text-hero-muted" role="status">
          Saved locally
        </p>
      </header>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2" role="list">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            className="card-panel group relative flex min-w-[180px] flex-col gap-2 rounded-xl p-2 text-left text-sm transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer"
            onClick={() => onSelect(photo)}
            role="listitem"
            aria-label={`Open favorite photo by ${photo.photographer}`}
          >
            <div className="relative h-28 w-full overflow-hidden rounded-lg">
              <Image
                alt={photo.alt || `Photo by ${photo.photographer}`}
                src={photo.src.medium}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="180px"
              />
            </div>
            <p className="font-medium text-hero-heading transition-colors">{photo.photographer}</p>
            <span className="text-xs text-card-muted transition-colors">Tap to reopen</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FavoritesRail;
