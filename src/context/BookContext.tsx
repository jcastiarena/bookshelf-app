'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Book } from '@/types'
import { bookService } from '@/services/bookService'

type BookContextType = {
  books: Book[]
  fetchBooks: () => Promise<void>
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  totalPages: number
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
}

export const BookContext = createContext<BookContextType | undefined>(undefined)

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function fetchBooks() {
    const data = await bookService.getAll()
    setBooks(data)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <BookContext.Provider value={{ books, fetchBooks, setBooks, isLoading, setIsLoading, page, setPage }}>
      {children}
    </BookContext.Provider>
  )
}

export function useBookContext() {
  const context = useContext(BookContext)
  if (!context) throw new Error('useBookContext must be used within BookProvider')
  return context
}