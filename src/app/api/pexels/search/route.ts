import { NextResponse } from "next/server";
import { searchPhotos } from "@/services/pexels";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");
  const pageParam = searchParams.get("page");
  const perPageParam = searchParams.get("perPage");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
  }

  const page = pageParam ? Number(pageParam) : 1;
  const perPage = perPageParam ? Number(perPageParam) : 24;

  if (Number.isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Page must be a positive integer." }, { status: 400 });
  }

  if (Number.isNaN(perPage) || perPage < 1 || perPage > 80) {
    return NextResponse.json({ error: "perPage must be between 1 and 80." }, { status: 400 });
  }

  try {
    const data = await searchPhotos({
      query: query.trim(),
      page,
      perPage,
    });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch photos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
