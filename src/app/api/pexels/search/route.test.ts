/**
 * @jest-environment node
 */

import { GET } from "./route";
import { searchPhotos } from "@/services/pexels";

jest.mock("@/services/pexels", () => ({
  searchPhotos: jest.fn(),
}));

const mockedSearchPhotos = searchPhotos as jest.MockedFunction<typeof searchPhotos>;

describe("GET /api/pexels/search", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when query parameter is missing", async () => {
    const response = await GET(new Request("http://localhost/api/pexels/search"));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "Query parameter is required." });
  });

  it("returns 400 for invalid pagination params", async () => {
    const response = await GET(new Request("http://localhost/api/pexels/search?query=test&page=0&perPage=200"));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  it("proxies to searchPhotos and returns results", async () => {
    const mockData = {
      page: 1,
      per_page: 24,
      photos: [],
      total_results: 100,
    };
    mockedSearchPhotos.mockResolvedValueOnce(mockData);

    const response = await GET(
      new Request("http://localhost/api/pexels/search?query=nature&page=2&perPage=12"),
    );

    expect(mockedSearchPhotos).toHaveBeenCalledWith({
      query: "nature",
      page: 2,
      perPage: 12,
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockData);
  });

  it("returns 500 when the service throws", async () => {
    mockedSearchPhotos.mockRejectedValueOnce(new Error("Pexels error"));

    const response = await GET(new Request("http://localhost/api/pexels/search?query=nature"));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Pexels error" });
  });
});
