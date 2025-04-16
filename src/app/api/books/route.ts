import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1)
    const limit = Math.max(parseInt(url.searchParams.get('limit') || '10', 10), 1)

    const skip = (page - 1) * limit

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      prisma.book.count(),
    ])

    return NextResponse.json({
      books,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { title, author, status = 'TO_READ' } = await req.json()
  const newBook = await prisma.book.create({
      data: { title, author, status },
  })

  return NextResponse.json(newBook, { status: 201 })
}