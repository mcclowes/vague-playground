import { type NextRequest, NextResponse } from "next/server";
import { inferSchema, parseCSVToDataset } from "vague-lang";

export async function POST(request: NextRequest) {
  try {
    const { data, format } = await request.json();

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    let inferredCode: string;

    if (format === "json") {
      try {
        const parsed = JSON.parse(data);
        inferredCode = inferSchema(parsed);
      } catch {
        return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
      }
    } else {
      try {
        const parsed = parseCSVToDataset(data);
        inferredCode = inferSchema(parsed);
      } catch {
        return NextResponse.json({ error: "Invalid CSV data" }, { status: 400 });
      }
    }

    return NextResponse.json({ code: inferredCode });
  } catch (error) {
    console.error("Infer error:", error);
    const message = error instanceof Error ? error.message : "Failed to infer schema from data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
