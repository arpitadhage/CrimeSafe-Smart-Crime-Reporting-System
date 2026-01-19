import { spawn } from "child_process"
import { join } from "path"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.crimes || !Array.isArray(body.crimes)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input: crimes array required",
          hotspots: [],
          clustered_crimes: [],
        },
        { status: 400 },
      )
    }

    // Call Python script
    const result = await runPythonScript(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[API] Error in predict-hotspots:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        hotspots: [],
        clustered_crimes: [],
      },
      { status: 500 },
    )
  }
}

async function runPythonScript(input: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonPath = join(process.cwd(), "scripts", "crime-hotspot-prediction.py")

    const python = spawn("python3", [pythonPath], {
      cwd: process.cwd(),
    })

    let output = ""
    let errorOutput = ""

    python.stdout.on("data", (data) => {
      output += data.toString()
    })

    python.stderr.on("data", (data) => {
      errorOutput += data.toString()
    })

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed: ${errorOutput}`))
        return
      }

      try {
        const result = JSON.parse(output)
        resolve(result)
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${output}`))
      }
    })

    python.on("error", (err) => {
      reject(new Error(`Failed to spawn Python process: ${err.message}`))
    })

    // Send input to Python script
    python.stdin.write(JSON.stringify(input))
    python.stdin.end()
  })
}
