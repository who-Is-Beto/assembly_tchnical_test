"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import PhotoModal from "@/components/feed/photo-modal";
import type { PexelsPhoto } from "@/services/pexels";

const modalPhoto: PexelsPhoto = {
  id: 55,
  width: 1600,
  height: 900,
  url: "https://pexels.example/55",
  photographer: "Jordan Frame",
  photographer_url: "https://pexels.example/jordan",
  photographer_id: 88,
  avg_color: "#abcdef",
  src: {
    original: "https://pexels.example/55/original.jpg",
    large2x: "https://pexels.example/55/large2x.jpg",
    large: "https://pexels.example/55/large.jpg",
    medium: "https://pexels.example/55/medium.jpg",
    small: "https://pexels.example/55/small.jpg",
    portrait: "https://pexels.example/55/portrait.jpg",
    landscape: "https://pexels.example/55/landscape.jpg",
    tiny: "https://pexels.example/55/tiny.jpg",
  },
  liked: false,
  alt: "Sunset ridge",
};

describe("PhotoModal", () => {
  it("renders metadata and handles favorite toggling", async () => {
    const user = userEvent.setup();
    const mockClose = jest.fn();
    const mockBackdrop = jest.fn();
    const mockToggle = jest.fn();
    const closeButtonRef = createRef<HTMLButtonElement>();

    render(
      <PhotoModal
        photo={modalPhoto}
        isFavorite={false}
        closeButtonRef={closeButtonRef}
        onBackdropClick={mockBackdrop}
        onClose={mockClose}
        onToggleFavorite={mockToggle}
      />,
    );

    expect(screen.getByRole("heading", { name: modalPhoto.photographer })).toBeInTheDocument();
    expect(screen.getByText(modalPhoto.alt!)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /save to favorites/i }));
    expect(mockToggle).toHaveBeenCalledWith(modalPhoto);

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(mockClose).toHaveBeenCalled();

    const overlay = screen.getByRole("dialog").parentElement as HTMLElement;
    await user.click(overlay);

    expect(mockBackdrop).toHaveBeenCalled();
  });
});
