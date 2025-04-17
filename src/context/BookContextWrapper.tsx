import React, { useState } from 'react'
import { BookContext } from '@/context/BookContext'
import type { Book } from '@/types'
import { bookService } from '@/services/bookService'
import { PAGE_SIZE } from '@/lib/appConfig'

interface Props {
  initialBooks?: Book[]
  initialDeletedBook?: Book | null
  children: React.ReactNode
}

export const BookContextWrapper: React.FC<Props> = ({
  initialBooks = [],
  children,
}) => {
  const [books, setBooks] = useState(initialBooks)
  const [deletedBook, setDeletedBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  

  const fetchBooks = async () => {
    try {
      setIsLoading(true)
      const { books, totalPages } = await bookService.getAll(page, PAGE_SIZE)
      setBooks(books)
      
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const contextValue = {
    books,
    deletedBook,
    fetchBooks,
    setBooks,
    setDeletedBook,
    isLoading,
    setIsLoading,
    page,
    setPage,
    setTotalPages,
    totalPages,
    total: books.length,
  }

  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  )
}

