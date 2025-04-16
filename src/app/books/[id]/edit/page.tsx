'use client'

import EditBookForm from '@/components/EditBookForm'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function EditBookPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    if (!id) return
    async function fetchBook() {
      const res = await fetch(`/api/books/${id}`)
      const data = await res.json()
      setBook(data)
    }
    fetchBook()
  }, [id])

  if (!book) {
    return <p className="p-6">Loading book data...</p>
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Book</h1>
      <EditBookForm book={book} />
    </main>
  )
}