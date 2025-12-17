import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, format } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    // Mock execution - In production, this would call the actual Vague interpreter
    // For now, we'll return sample data based on the schema
    const mockOutput = generateMockOutput(code, format)

    return NextResponse.json({ output: mockOutput })
  } catch (error) {
    console.error("[v0] Execute error:", error)
    return NextResponse.json({ error: "Failed to execute Vague code" }, { status: 500 })
  }
}

function generateMockOutput(code: string, format: "json" | "csv"): string {
  // Parse the code to extract dataset name
  const datasetMatch = code.match(/dataset\s+(\w+)/)
  const datasetName = datasetMatch ? datasetMatch[1] : "TestData"

  if (format === "json") {
    const mockData = {
      customers: [
        { name: "John Doe", status: "active" },
        { name: "Jane Smith", status: "active" },
        { name: "Bob Johnson", status: "inactive" },
      ],
      invoices: [
        {
          customer: "John Doe",
          amount: 1250.5,
          status: "paid",
        },
        {
          customer: "Jane Smith",
          amount: 3420.75,
          status: "sent",
        },
        {
          customer: "Bob Johnson",
          amount: 890.25,
          status: "draft",
        },
      ],
    }

    return JSON.stringify(mockData, null, 2)
  } else {
    // CSV format
    return `customer,amount,status
John Doe,1250.50,paid
Jane Smith,3420.75,sent
Bob Johnson,890.25,draft`
  }
}
