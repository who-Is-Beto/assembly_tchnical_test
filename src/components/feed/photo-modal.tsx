"use client";

import Image from "next/image";
import { memo } from "react";
import type { RefObject, MutableRefObject, MouseEvent as ReactMouseEvent } from "react";
import type { PexelsPhoto } from "@/services/pexels";
import { MODAL_ID } from "./constants";

type PhotoModalProps = {
  photo: PexelsPhoto;
  isFavorite: boolean;
  closeButtonRef: RefObject<HTMLButtonElement | null> | MutableRefObject<HTMLButtonElement | null>;
  onBackdropClick: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onToggleFavorite: (photo: PexelsPhoto) => void;
};

const renderColorSwatch = (color: string) => (
  <span
    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] uppercase"
    style={{ backgroundColor: color, border: "1px solid var(--card-border)" }}
  >
    <span className="sr-only">Average color {color}</span>
  </span>
);

const PhotoModal = ({ photo, isFavorite, closeButtonRef, onBackdropClick, onClose, onToggleFavorite }: PhotoModalProps) => {
  return (
    <div
      className="overlay-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
      onClick={onBackdropClick}
      role="presentation"
    >
      <div
        aria-modal="true"
        role="dialog"
        aria-labelledby={`photo-${photo.id}-title`}
        id={MODAL_ID}
        className="modal-surface relative w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl shadow-black/40"
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary absolute right-4 top-4 z-10 cursor-pointer rounded-full px-3 py-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          ref={closeButtonRef}
        >
          Close
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
            <Image
              alt={photo.alt || `Photo by ${photo.photographer}`}
              src={photo.src.large2x}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 60vw, 90vw"
              priority
            />
          </div>

          <div className="space-y-4 px-6 pb-8 pt-12">
            <h2 id={`photo-${photo.id}-title`} className="text-2xl font-semibold text-hero-heading">
              {photo.photographer}
            </h2>
            <p className="text-sm text-card-muted">
              {photo.alt ? photo.alt : "No description provided for this photograph."}
            </p>

            <dl className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.2em] text-hero-muted">
              <div>
                <dt className="text-[10px] text-hero-muted">Dimensions</dt>
                <dd className="mt-1 text-sm text-hero-heading">
                  {photo.width} × {photo.height}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] text-hero-muted">Photo ID</dt>
                <dd className="mt-1 text-sm text-hero-heading">{photo.id}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-hero-muted">Photographer ID</dt>
                <dd className="mt-1 text-sm text-hero-heading">{photo.photographer_id}</dd>
              </div>
              <div>
                <dt className="text-[10px] text-hero-muted">Average color</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm text-hero-heading">
                  {photo.avg_color ? renderColorSwatch(photo.avg_color) : "—"}
                  {photo.avg_color ?? ""}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="button"
                onClick={() => onToggleFavorite(photo)}
                aria-pressed={isFavorite}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  isFavorite ? "btn-primary" : "btn-secondary"
                }`}
              >
                <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
                {isFavorite ? "Favorited" : "Save to favorites"}
              </button>

              <a
                className="btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                href={photo.src.original}
                download
              >
                Download
              </a>
              <a
                className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                href={photo.url}
                rel="noreferrer"
                target="_blank"
              >
                View on Pexels
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PhotoModal);
