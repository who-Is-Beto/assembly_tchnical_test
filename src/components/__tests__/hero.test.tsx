import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "@/components/hero";
import { ThemeProvider } from "@/components/theme/theme-provider";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Hero", () => {
  const trendingTags = ["mountains", "city"];

  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renders heading, description, and search form", () => {
    render(
      <ThemeProvider>
        <Hero query="nature" trendingId="trend-nav" trendingTags={trendingTags} />
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: /discover royalty-free photography/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/search the pexels catalog/i)).toHaveValue("nature");
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("lists trending tags with links", () => {
    render(
      <ThemeProvider>
        <Hero query="city" trendingId="trend-nav" trendingTags={trendingTags} />
      </ThemeProvider>,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(trendingTags.length);
    expect(links[0]).toHaveAttribute("href", "/?query=mountains");
  });

  it("pushes the typed query when submitting", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Hero query="nature" trendingId="trend-nav" trendingTags={trendingTags} />
      </ThemeProvider>,
    );

    const input = screen.getByLabelText(/search photos/i) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "mountain lakes");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(pushMock).toHaveBeenCalledWith("/?query=mountain+lakes");
  });
});
