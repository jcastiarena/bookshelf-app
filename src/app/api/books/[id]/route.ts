import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * GET a book by ID
 * @param request 
 * @param param1 
 * @returns 
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const book = await prisma.book.findUnique({
    where: { id: parseInt(id, 10) },
  })

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  return NextResponse.json(book)
}

/**
 * Delete a book by ID
 * @param request 
 * @param param1 
 * @returns 
 */
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  await prisma.bookCategory.deleteMany({
    where: {
      bookId: parseInt(id, 10),
    },
  })

  await prisma.book.delete({
    where: {
      id: parseInt(id, 10),
    },
  })
  return NextResponse.json({ message: 'Deleted' })
}

/**
 * Update a book by ID
 * @param request 
 * @param param1 
 * @returns 
 */
export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const body = await request.json();
  const { title, author, status = 'to_read', categoryIds } = body;

  const id = url.pathname.split('/').pop();
  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const updated = await prisma.book.update({
    where: { id: parseInt(id, 10) },
    data: { 
      title, 
      author, 
      status, 
      categories: { 
        connect: categoryIds?.map((id: string) => ({ id })) 
      ,} 
    },
    include: { categories: true },
  })

  return NextResponse.json(updated)
}
