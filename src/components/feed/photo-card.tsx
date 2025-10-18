"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import type { PexelsPhoto } from "@/services/pexels";
import { MODAL_ID } from "./constants";
import { cn } from "@/lib/cn";

type PhotoCardProps = {
  photo: PexelsPhoto;
  isFavorite: boolean;
  isActive: boolean;
  onSelect: (photo: PexelsPhoto) => void;
  onToggleFavorite: (photo: PexelsPhoto) => void;
};

const PhotoCard = ({ photo, isFavorite, isActive, onSelect, onToggleFavorite }: PhotoCardProps) => {
  const description = photo.alt || `Photo by ${photo.photographer}`;

  const handleFavoriteClick = useCallback(() => {
    onToggleFavorite(photo);
  }, [onToggleFavorite, photo]);

  const handleSelect = useCallback(() => {
    onSelect(photo);
  }, [onSelect, photo]);

  return (
    <figure className="card-panel group mb-6 flex break-inside-avoid flex-col overflow-hidden rounded-2xl shadow-xl shadow-black/10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-transparent">
      <button
        type="button"
        onClick={handleSelect}
        className="relative block w-full overflow-hidden rounded-t-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
        aria-haspopup="dialog"
        aria-expanded={isActive}
        aria-controls={MODAL_ID}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      >
        <span className="sr-only">Open quick look for {description}</span>
        <Image
          alt={description}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
          loading="lazy"
          sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
          src={photo.src.large2x}
          width={photo.width}
          height={photo.height}
          priority={false}
        />
      </button>

      <figcaption className="flex flex-col gap-4 border-t border-transparent px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-medium text-hero-heading transition-colors">{photo.photographer}</p>
          <p className="text-card-muted text-xs transition-colors">
            {photo.width} × {photo.height}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              isFavorite ? "btn-primary" : "btn-secondary",
            )}
            type="button"
            onClick={handleFavoriteClick}
          >
            <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
          </button>

          <button
            type="button"
            onClick={handleSelect}
            className="btn-secondary cursor-pointer rounded-full px-3 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-haspopup="dialog"
            aria-controls={MODAL_ID}
            aria-expanded={isActive}
          >
            Quick look
          </button>

          <a
            className="btn-secondary inline-flex rounded-full px-3 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            href={photo.url}
            rel="noreferrer"
            target="_blank"
          >
            View on Pexels
          </a>
        </div>
      </figcaption>
    </figure>
  );
};

export default memo(PhotoCard);
