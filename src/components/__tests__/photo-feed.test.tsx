import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PexelsPhoto } from "@/services/pexels";
import PhotoFeed from "../feed/photo-feed";

const createPhoto = (overrides: Partial<PexelsPhoto> = {}): PexelsPhoto => ({
  id: overrides.id ?? Math.floor(Math.random() * 10_000),
  width: overrides.width ?? 1200,
  height: overrides.height ?? 800,
  url: overrides.url ?? "https://pexels.example/photo",
  photographer: overrides.photographer ?? "John Doe",
  photographer_url: overrides.photographer_url ?? "https://pexels.example/photographer",
  photographer_id: overrides.photographer_id ?? 123,
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
  alt: overrides.alt ?? "Sample photo",
});

describe("PhotoFeed", () => {
  const perPage = 2;
  const initialPhotos = [createPhoto({ id: 1, photographer: "Alice" }), createPhoto({ id: 2, photographer: "Bob" })];

  let intersectionCallback: IntersectionObserverCallback | null = null;
  const observeMock = jest.fn();
  const disconnectMock = jest.fn();

  beforeEach(() => {
    intersectionCallback = null;
    observeMock.mockReset();
    disconnectMock.mockReset();
    (globalThis as any).IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        observe: observeMock,
        disconnect: disconnectMock,
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
      };
    });
    global.fetch = jest.fn() as unknown as typeof fetch;
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial photos and sentinel", () => {
    render(
      <PhotoFeed
        initialPage={1}
        initialPhotos={initialPhotos}
        perPage={perPage}
        query="nature"
        totalResults={48}
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByTestId("feed-sentinel")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fetches and appends more photos when sentinel intersects", async () => {
    const nextPhotos = [createPhoto({ id: 3, photographer: "Charlie", alt: "New photo" })];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        photos: nextPhotos,
        page: 2,
        per_page: perPage,
        next_page: null,
      }),
    });

    render(
      <PhotoFeed
        initialPage={1}
        initialPhotos={initialPhotos}
        perPage={perPage}
        query="nature"
        totalResults={48}
      />,
    );

    const sentinel = screen.getByTestId("feed-sentinel");
    expect(observeMock).toHaveBeenCalledWith(sentinel);
    expect(intersectionCallback).not.toBeNull();

    await act(async () => {
      intersectionCallback?.([{ isIntersecting: true, target: sentinel } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    await waitFor(() => {
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(`/api/pexels/search?query=nature&page=2&perPage=${perPage}`);
  });

  it("shows an error if the fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(
      <PhotoFeed
        initialPage={1}
        initialPhotos={initialPhotos}
        perPage={perPage}
        query="nature"
        totalResults={48}
      />,
    );

    const sentinel = screen.getByTestId("feed-sentinel");

    await act(async () => {
      intersectionCallback?.([{ isIntersecting: true, target: sentinel } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("allows toggling favorites and persists selection", async () => {
    const user = userEvent.setup();
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <PhotoFeed
        initialPage={1}
        initialPhotos={initialPhotos}
        perPage={perPage}
        query="nature"
        totalResults={48}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    setItemSpy.mockClear();

    const favoriteButtons = screen.getAllByRole("button", { name: /favorite/i });
    await user.click(favoriteButtons[0]);

    await waitFor(() => {
      expect(favoriteButtons[0]).toHaveAttribute("aria-pressed", "true");
    });

    expect(screen.getByRole("heading", { name: "Favorites" })).toBeInTheDocument();
    expect(setItemSpy).toHaveBeenCalledWith(
      "pexels-favorites",
      expect.stringContaining('"id":1'),
    );

    setItemSpy.mockRestore();
  });

  it("renders featured gallery when provided", () => {
    render(
      <PhotoFeed
        initialPage={1}
        initialPhotos={initialPhotos}
        perPage={perPage}
        query="nature"
        totalResults={48}
        featuredPhotos={[createPhoto({ id: 99, photographer: "Zoe" })]}
      />,
    );

    expect(screen.getByRole("heading", { name: /top photos today/i })).toBeInTheDocument();
    expect(screen.getByText("Zoe")).toBeInTheDocument();
  });

  it("surfaces a featured error when provided", () => {
    render(
      <PhotoFeed
        initialPage={1}
        initialPhotos={initialPhotos}
        perPage={perPage}
        query="nature"
        totalResults={48}
        featuredError="Daily feed offline"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Daily feed offline");
  });
});
