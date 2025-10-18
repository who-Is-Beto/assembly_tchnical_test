const PEXELS_API_BASE_URL = "https://api.pexels.com/v1";

const ensureServerEnvironment = () => {
  if (typeof window !== "undefined") {
    throw new Error("The Pexels service can only be used in a server environment.");
  }
};

const getApiKey = (): string => {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    throw new Error("PEXELS_API_KEY is not set. Add it to your environment before using the Pexels service.");
  }

  return apiKey;
};

type QueryParams = Record<string, string | number | boolean | undefined>;

const buildUrl = (endpoint: string, params?: QueryParams) => {
  const url = new URL(`${PEXELS_API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url;
};

interface PexelsResponseError {
  error?: string;
}

const fetchFromPexels = async <TResponse>(endpoint: string, params?: QueryParams) => {
  ensureServerEnvironment();
  const apiKey = getApiKey();
  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    let message = `Pexels request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as PexelsResponseError;

      if (errorBody?.error) {
        message += `: ${errorBody.error}`;
      }
    } catch {
      // Ignore JSON parse errors and fall back to the default message.
    }

    throw new Error(message);
  }

  return (await response.json()) as TResponse;
};

export interface PexelsPhotoSource {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string | null;
  src: PexelsPhotoSource;
  liked: boolean;
  alt: string;
}

export interface PexelsPagination<T> {
  page: number;
  per_page: number;
  total_results?: number;
  next_page?: string;
  prev_page?: string;
  photos: T[];
}

export type Orientation = "landscape" | "portrait" | "square";
export type Size = "large" | "medium" | "small";

export interface SearchPhotosParams {
  query: string;
  perPage?: number;
  page?: number;
  orientation?: Orientation;
  size?: Size;
  color?: string;
  locale?: string;
}

export const searchPhotos = (params: SearchPhotosParams) => {
  const { query, perPage, page, orientation, size, color, locale } = params;

  return fetchFromPexels<PexelsPagination<PexelsPhoto>>("/search", {
    query,
    per_page: perPage,
    page,
    orientation,
    size,
    color,
    locale,
  });
};

export interface CuratedPhotosParams {
  page?: number;
  perPage?: number;
}

export const listCuratedPhotos = (params: CuratedPhotosParams = {}) => {
  const { page, perPage } = params;

  return fetchFromPexels<PexelsPagination<PexelsPhoto>>("/curated", {
    page,
    per_page: perPage,
  });
};

export const getPhoto = (photoId: number) => fetchFromPexels<PexelsPhoto>(`/photos/${photoId}`);
