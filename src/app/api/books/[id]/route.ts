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
    include: {
      categories: {
        include: { category: true }
      },
    },
  })

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  const transformedBook = {
    ...book,
    categories: book.categories
      .map(bc => ({ id: bc.category.id, name: bc.category.name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  } 

  return NextResponse.json(transformedBook)
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
  const { title, author, status = 'to_read', categories } = body;

  const id = url.pathname.split('/').pop();
  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  console.log(`Updating book ${id}`);
  await prisma.book.update({
    where: { id: parseInt(id, 10) },
    data: {
      title,
      author,
      status,
    },
  });

  console.log(`Deleting categories for book ${id}`);
  await prisma.bookCategory.deleteMany({
    where: {
      bookId: parseInt(id, 10),
    },
  });

  console.log(`Category IDs: ${categories}`);
  if (Array.isArray(categories)) {
    console.log(`Creating categories for book ${id}`);
    await prisma.bookCategory.createMany({
      data: categories.map(cat => ({
        bookId: parseInt(id, 10),
        categoryId: parseInt(cat.id, 10),
      })),
    });
  }

  const updated = await prisma.book.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  const transformedBook = {
    ...updated,
    categories: updated?.categories.map(bc => ({
      id: bc.category.id,
      name: bc.category.name,
    })).sort((a, b) => a.name.localeCompare(b.name)),
  };

  return NextResponse.json(transformedBook);
}
