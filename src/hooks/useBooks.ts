'use client'

import { useBookContext } from '@/context/BookContext'
import { bookService } from '@/services/bookService'
import { Book } from '@/types'
import { useState } from 'react'
import { PAGE_SIZE } from '@/lib/appConfig'

export function useBooks() {
  const { books, setBooks, isLoading, setIsLoading } = useBookContext()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchBooks = async (limit = PAGE_SIZE) => {
    try {
      setIsLoading(true)
      const { books, total, totalPages } = await bookService.getAll(page, limit)
      setBooks(books)
      setTotal(total)
      setTotalPages(totalPages)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBook = async (id: number) => {
    const ok = await bookService.delete(id)
    if (ok) {
      setBooks((prev) => prev.filter((book) => book.id !== id))
    } else {
      console.log('Failed to delete book')
    }
  }

  const undoDelete = async (book: Omit<Book, 'id'>) => {
    await bookService.create(book)
    fetchBooks()
  }


  return {
    books,
    setBooks,
    fetchBooks,
    deleteBook,
    undoDelete,
    isLoading,
    page,
    setPage,
    totalPages,
    total,
  }
}