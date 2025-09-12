import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Verify route called")

    const token = request.cookies.get("auth-token")?.value
    console.log("[v0] Token found:", !!token)

    if (!token) {
      console.log("[v0] No token found in cookies")
      return NextResponse.json({ error: "No token found" }, { status: 401 })
    }

    const jwtSecret = process.env.JWT_SECRET
    console.log("[v0] JWT_SECRET exists:", !!jwtSecret)

    if (!jwtSecret) {
      console.log("[v0] JWT_SECRET environment variable is missing")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const decoded = jwt.verify(token, jwtSecret) as any
    console.log("[v0] Token decoded successfully for user:", decoded.email)

    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        fullName: decoded.fullName,
      },
    })
  } catch (error) {
    console.error("[v0] Token verification failed:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
