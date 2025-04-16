import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  console.log('Book ID:', id)
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const book = await prisma.book.findUnique({
    where: { id },
  })

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  return NextResponse.json(book)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  await prisma.book.delete({ where: { id } })
  return NextResponse.json({ message: 'Deleted' })
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  const { title, author } = await req.json()

  const updated = await prisma.book.update({
    where: { id },
    data: { title, author },
  })

  return NextResponse.json(updated)
}
