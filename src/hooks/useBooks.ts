'use client'

import { useBookContext } from '@/context/BookContext'
import { bookService } from '@/services/bookService'
import { Book } from '@/types'
import { useCallback, useState } from 'react'
import { PAGE_SIZE } from '@/lib/appConfig'

export function useBooks() {
  const { books, setBooks, isLoading, setIsLoading } = useBookContext()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchBooks = useCallback(async (limit = PAGE_SIZE) => {
    try {
      setPage(page)
      setIsLoading(true)
      const { books, total, totalPages } = await bookService.getAll(page, limit)
      setBooks(books)
      setTotal(total)
      setTotalPages(totalPages)
    } finally {
      setIsLoading(false)
    }
  }, [page, setIsLoading, setBooks, setTotal, setTotalPages]);

  const getById = async (id: number) => {
    try {
      setIsLoading(true)
      const book = await bookService.getById(id)
      return book
    } finally {
      setIsLoading(false)
    }
  }

  const updateBook = async (id: number, book: Partial<Book>) => {
    const updated = await bookService.update(id, book)
    if (updated) {
      setBooks((prev) => prev.map((b) => b.id === id ? { ...b, ...book } : b))
    } else {
      console.log('Failed to update book')
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

  const createBook = async (book: Omit<Book, 'id'>) => {
    const res = await bookService.create(book)
    if (!res) return null
    setBooks((prev) => [...prev, res])
    return res
  }

  return {
    books,
    setBooks,
    fetchBooks,
    deleteBook,
    createBook,
    undoDelete,
    updateBook,
    getById,
    isLoading,
    page,
    setPage,
    totalPages,
    total,
  }
}