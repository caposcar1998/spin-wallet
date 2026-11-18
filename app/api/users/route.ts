import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const response = await apiGet(id ? `/user/${id}` : "/users");

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to retrieve users" },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "API unavailable" }, { status: 500 });
  }
}
