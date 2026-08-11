import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Inngest endpoint inactive' }, { status: 200 })
}

export async function PUT() {
  return new NextResponse(null, { status: 204 })
}

export async function POST() {
  return new NextResponse(null, { status: 204 })
}
