// import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


/**
 * GET a book by ID
 * @param request 
 * @param param1 
 * @returns 
 */
export function GET(request: Request) {
  console.log(request);
  return NextResponse.json({ message: 'Simplest dynamic route works' })
}

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params

//   if (isNaN(parseInt(id, 10))) {
//     return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
//   }

//   const book = await prisma.book.findUnique({
//     where: { id: parseInt(id, 10) },
//   })

//   if (!book) {
//     return NextResponse.json({ error: 'Book not found' }, { status: 404 })
//   }

//   return NextResponse.json(book)
// }

/**
 * Delete a book by ID
 * @param request 
 * @param param1 
 * @returns 
 */
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   if (isNaN(parseInt(id, 10))) {
//     return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
//   }

//   await prisma.book.delete({ where: { id: parseInt(id, 10) } })
//   return NextResponse.json({ message: 'Deleted' })
// }

/**
 * Update a book by ID
 * @param request 
 * @param param1 
 * @returns 
 */
// export async function PATCH(
//   request: Request, 
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;
//   const { title, author } = await request.json()

//   const updated = await prisma.book.update({
//     where: { id: parseInt(id, 10) },
//     data: { title, author },
//   })

//   return NextResponse.json(updated)
// }
