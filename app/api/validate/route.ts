import { type NextRequest, NextResponse } from "next/server";
import { parse } from "vague-lang";

interface ValidationError {
  line: number;
  column: number;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: true, errors: [] });
    }

    try {
      parse(code);
      return NextResponse.json({ valid: true, errors: [] });
    } catch (error) {
      const errors: ValidationError[] = [];

      if (error instanceof Error) {
        // Parse error message format: "Parse error at line X, column Y: message"
        const match = error.message.match(/at line (\d+), column (\d+): (.+)/);
        if (match) {
          errors.push({
            line: parseInt(match[1], 10),
            column: parseInt(match[2], 10),
            message: match[3],
          });
        } else {
          // Fallback for other error formats
          errors.push({
            line: 1,
            column: 1,
            message: error.message,
          });
        }
      }

      return NextResponse.json({ valid: false, errors });
    }
  } catch (error) {
    console.error("Validate error:", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
