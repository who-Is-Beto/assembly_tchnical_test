import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoCard from "@/components/feed/photo-card";
import type { PexelsPhoto } from "@/services/pexels";

const makePhoto = (overrides: Partial<PexelsPhoto> = {}): PexelsPhoto => ({
  id: overrides.id ?? 1,
  width: overrides.width ?? 1200,
  height: overrides.height ?? 800,
  url: overrides.url ?? "https://pexels.example/photo",
  photographer: overrides.photographer ?? "Pat Photographer",
  photographer_url: overrides.photographer_url ?? "https://pexels.example/photographer",
  photographer_id: overrides.photographer_id ?? 321,
  avg_color: overrides.avg_color ?? "#ffffff",
  src: overrides.src ?? {
    original: "https://pexels.example/photo-original.jpg",
    large2x: "https://pexels.example/photo-large2x.jpg",
    large: "https://pexels.example/photo-large.jpg",
    medium: "https://pexels.example/photo-medium.jpg",
    small: "https://pexels.example/photo-small.jpg",
    portrait: "https://pexels.example/photo-portrait.jpg",
    landscape: "https://pexels.example/photo-landscape.jpg",
    tiny: "https://pexels.example/photo-tiny.jpg",
  },
  liked: overrides.liked ?? false,
  alt: overrides.alt ?? "Sample alt",
});

describe("PhotoCard", () => {
  it("calls callbacks for favorite and quick look actions", async () => {
    const user = userEvent.setup();
    const photo = makePhoto();
    const handleSelect = jest.fn();
    const handleToggle = jest.fn();

    render(
      <PhotoCard
        photo={photo}
        isFavorite={false}
        isActive={false}
        onSelect={handleSelect}
        onToggleFavorite={handleToggle}
      />,
    );

    const favoriteButton = screen.getByRole("button", { name: /add to favorites/i });
    const quickLookButton = screen.getByRole("button", { name: /^quick look$/i });

    await user.click(favoriteButton);
    await user.click(quickLookButton);

    expect(handleToggle).toHaveBeenCalledWith(photo);
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(photo);
  });

  it("marks favorite state when active", () => {
    const photo = makePhoto();

    render(
      <PhotoCard
        photo={photo}
        isFavorite
        isActive
        onSelect={jest.fn()}
        onToggleFavorite={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /remove from favorites/i })).toHaveAttribute("aria-pressed", "true");
  });
});
