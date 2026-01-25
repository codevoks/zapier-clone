import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export default async function authmiddleware(request: NextRequest) {
  return NextResponse.next()
}
