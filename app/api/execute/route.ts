import { type NextRequest, NextResponse } from "next/server";
import {
  compile,
  datasetToSingleCSV,
  registerPlugin,
  fakerPlugin,
  fakerShorthandPlugin,
  issuerPlugin,
  datePlugin,
} from "vague-lang";

// Register plugins once on module load
registerPlugin(fakerPlugin);
registerPlugin(fakerShorthandPlugin);
registerPlugin(issuerPlugin);
registerPlugin(datePlugin);

export async function POST(request: NextRequest) {
  try {
    const { code, format } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const result = await compile(code);

    let output: string;
    if (format === "csv") {
      output = datasetToSingleCSV(result);
    } else {
      output = JSON.stringify(result, null, 2);
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Execute error:", error);
    const message = error instanceof Error ? error.message : "Failed to execute Vague code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
