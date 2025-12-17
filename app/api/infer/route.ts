import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { data, format } = await request.json()

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    const inferredCode = inferSchema(data, format)

    return NextResponse.json({ code: inferredCode })
  } catch (error) {
    console.error("[v0] Infer error:", error)
    return NextResponse.json({ error: "Failed to infer schema from data" }, { status: 500 })
  }
}

function inferSchema(data: string, format: "json" | "csv"): string {
  if (format === "json") {
    try {
      const parsed = JSON.parse(data)
      return inferFromJSON(parsed)
    } catch {
      throw new Error("Invalid JSON data")
    }
  } else {
    return inferFromCSV(data)
  }
}

function inferFromJSON(data: any): string {
  const schemas: string[] = []
  const datasets: string[] = []

  if (Array.isArray(data)) {
    // Array of objects
    if (data.length > 0) {
      const schemaName = "Item"
      const schema = generateSchemaFromObject(data[0], schemaName)
      schemas.push(schema)
      datasets.push(`  items: ${data.length} of ${schemaName}`)
    }
  } else if (typeof data === "object") {
    // Object with collections
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value) && value.length > 0) {
        const schemaName = capitalize(singular(key))
        const schema = generateSchemaFromObject(value[0], schemaName)
        schemas.push(schema)
        datasets.push(`  ${key}: ${value.length} of ${schemaName}`)
      }
    }
  }

  return `${schemas.join("\n\n")}\n\ndataset InferredData {\n${datasets.join(",\n")}\n}`
}

function inferFromCSV(data: string): string {
  const lines = data.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim())
  const firstRow = lines[1].split(",").map((v) => v.trim())

  const fields = headers
    .map((header, i) => {
      const value = firstRow[i]
      const type = inferType(value)
      return `  ${header}: ${type}`
    })
    .join(",\n")

  return `schema Item {\n${fields}\n}\n\ndataset InferredData {\n  items: ${lines.length - 1} of Item\n}`
}

function generateSchemaFromObject(obj: any, name: string): string {
  const fields = Object.entries(obj)
    .map(([key, value]) => {
      const type = inferType(value)
      return `  ${key}: ${type}`
    })
    .join(",\n")

  return `schema ${name} {\n${fields}\n}`
}

function inferType(value: any): string {
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return "date"
    }
    return "string"
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int in 0..1000" : "decimal in 0..1000"
  }
  if (typeof value === "boolean") {
    return '"true" | "false"'
  }
  return "string"
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function singular(str: string): string {
  if (str.endsWith("ies")) return str.slice(0, -3) + "y"
  if (str.endsWith("s")) return str.slice(0, -1)
  return str
}
