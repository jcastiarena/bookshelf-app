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
    const searchParams = new URL(req.url).searchParams
    const title = searchParams.get('title') ?? undefined
    const author = searchParams.get('author') ?? undefined
    const statuses = searchParams.getAll('statuses')
    const categoryIds = searchParams.getAll('categoryIds')
    const url = new URL(req.url)
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1)
    const limit = Math.max(parseInt(url.searchParams.get('limit') || '10', 10), 1)

    const skip = (page - 1) * limit

    const filters = {
      ...(title ? { title: { contains: title, mode: 'insensitive' } } : {}),
      ...(author ? { author: { contains: author, mode: 'insensitive' } } : {}),
      ...(statuses.length > 0 ? { status: { in: statuses } } : {}),
      ...(categoryIds.length > 0 ? { categories: { some: { categoryId: { in: categoryIds.map(id => parseInt(id)) } } } } : {}),
    };

    const total = await prisma.book.count({ where: filters });
    console.log(`Total: ${total}, Filters: ${JSON.stringify(filters)}, Skip: ${skip}, Limit: ${limit}`);
    if (skip >= total) {
      return NextResponse.json({
        books: [],
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    }

    const books = await prisma.book.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
      where: filters,
      include: {
        categories: {
          include: { category: true },
        },
      },
    })

    console.log(`Books: ${books}, Total: ${total}`);
    const transformedBooks = books.map(book => ({
      ...book,
      categories: book.categories
        .map(bc => bc.category)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))

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