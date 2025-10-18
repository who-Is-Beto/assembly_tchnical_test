import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoritesRail from "@/components/feed/favorites-rail";
import type { PexelsPhoto } from "@/services/pexels";

const samplePhoto: PexelsPhoto = {
  id: 10,
  width: 1000,
  height: 800,
  url: "https://pexels.example/10",
  photographer: "Taylor Lens",
  photographer_url: "https://pexels.example/taylor",
  photographer_id: 77,
  avg_color: "#111111",
  src: {
    original: "https://pexels.example/10/original.jpg",
    large2x: "https://pexels.example/10/large2x.jpg",
    large: "https://pexels.example/10/large.jpg",
    medium: "https://pexels.example/10/medium.jpg",
    small: "https://pexels.example/10/small.jpg",
    portrait: "https://pexels.example/10/portrait.jpg",
    landscape: "https://pexels.example/10/landscape.jpg",
    tiny: "https://pexels.example/10/tiny.jpg",
  },
  liked: false,
  alt: "Sample favorite photo",
};

describe("FavoritesRail", () => {
  it("renders nothing when there are no favorites", () => {
    const { container } = render(<FavoritesRail photos={[]} onSelect={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders favorite cards and responds to selection", async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(<FavoritesRail photos={[samplePhoto]} onSelect={handleSelect} />);

    expect(screen.getByRole("heading", { name: /favorites/i })).toBeInTheDocument();
    const favoriteItems = screen.getAllByRole("listitem", { name: /open favorite photo by taylor lens/i });
    expect(favoriteItems).toHaveLength(1);
    await user.click(favoriteItems[0]);
    expect(handleSelect).toHaveBeenCalledWith(samplePhoto);
  });
});
