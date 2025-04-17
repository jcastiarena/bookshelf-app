'use client'

import EditBookForm from '@/components/EditBookForm'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Book } from '@/types'

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    const id = params?.id
    if (!id || Array.isArray(id)) {
      router.push('/books')
      return
    }

    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        setBook(await res.json())
      } catch (error) {
        console.error(error)
        router.push('/books')
      }
    }

    fetchBook()
  }, [params?.id, router])

  if (!book) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Book</h1>
      <EditBookForm book={book} />
    </main>
  )
}