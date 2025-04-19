import { prisma } from '@/lib/prisma'
import { Category } from '@/types'
import { NextResponse } from 'next/server'


/**
 * Get all books
 * @param req Get all books
 * @returns 
 */
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
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.book.count(),
    ])

    const transformedBooks = books.map(book => ({
      ...book,
      categories: book.categories.map(bc => bc.category),
    }));

    return NextResponse.json({
      books: transformedBooks,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Create new book
 * @param req Create new book
 * @returns 
 */
export async function POST(req: Request) {
  const { title, author, status = 'to_read', categories } = await req.json()
  console.log(`Create Categories: ${categories}`)
  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      status,
      categories: {
        create: categories.map((cat: Category) => ({
          category: { connect: { id: cat.id } },
        })),
      },
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  })
  
  return NextResponse.json(newBook, { status: 201 })
}