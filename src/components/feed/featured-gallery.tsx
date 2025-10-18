"use client";

import PhotoCard from "./photo-card";
import type { PexelsPhoto } from "@/services/pexels";

type FeaturedGalleryProps = {
  photos: PexelsPhoto[];
  favorites: Record<number, PexelsPhoto>;
  activePhotoId?: number;
  onSelect: (photo: PexelsPhoto) => void;
  onToggleFavorite: (photo: PexelsPhoto) => void;
};

const FeaturedGallery = ({ photos, favorites, activePhotoId, onSelect, onToggleFavorite }: FeaturedGalleryProps) => {
  if (photos.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="featured-heading" aria-describedby="featured-subheading" className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 id="featured-heading" className="text-3xl font-semibold text-hero-heading transition-colors">
            Top Photos Today
          </h2>
          <p id="featured-subheading" className="text-sm text-hero-muted transition-colors">
            Fresh picks curated by the Pexels team—tap any photo for photographer details, dimensions, and download links.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {photos.map((photo) => (
          <PhotoCard
            key={`featured-${photo.id}`}
            photo={photo}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
            isFavorite={Boolean(favorites[photo.id])}
            isActive={activePhotoId === photo.id}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGallery;
