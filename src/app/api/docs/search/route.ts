import { NextRequest, NextResponse } from "next/server";
import { DocsService } from "@/lib/docsService";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const locale = (searchParams.get("locale") || "fa") as "en" | "fa";

  const results = DocsService.search(query, locale);

  return NextResponse.json(results);
}
