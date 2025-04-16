import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest, context: { params: { id: string } }) {
  
    const { id } = context.params;  
    console.log('Book ID:', id)
    
    if (isNaN(parseInt(id, 10))) {
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

export async function DELETE(
  req: NextRequest, context: { params: { id: string } }) {

  const { id } = context.params;
  if (isNaN(parseInt(id, 10))) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  await prisma.book.delete({ where: { id: parseInt(id, 10) } })
  return NextResponse.json({ message: 'Deleted' })
}

export async function PATCH(
  req: NextRequest, context: { params: { id: string } }) {

  const { id } = context.params;
  const { title, author } = await req.json()

  const updated = await prisma.book.update({
    where: { id: parseInt(id, 10) },
    data: { title, author },
  })

  return NextResponse.json(updated)
}
