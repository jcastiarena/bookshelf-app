'use client'

import EditBookForm from '@/components/EditBookForm'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Book } from '@/types'
import { useBooks } from '@/hooks/useBooks'

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const { getById } = useBooks();

  useEffect(() => {
    const id = params?.id
    if (!id || Array.isArray(id)) {
      router.push('/books')
      return
    }

    const fetchBook = async () => {
      try {
        const res = await getById(Number(id))
        if (!res) throw new Error('Failed to fetch')
        setBook(res)
      } catch (error) {
        console.error(error)
        router.push('/books')
      }
    }

    fetchBook()
  }, [params?.id, getById])

  if (!book) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Book</h1>
      <EditBookForm book={book} />
    </main>
  )
}