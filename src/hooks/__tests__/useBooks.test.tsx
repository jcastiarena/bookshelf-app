import React from 'react'
import { renderHook } from '@testing-library/react'
import { BookContext } from '@/context/BookContext'
import { useBooks } from '../useBooks'
import { expect, it, vi, describe } from 'vitest'

describe('useBooks', () => {
  const mockContextValue = {
    books: [],
    fetchBooks: vi.fn(),
    setBooks: vi.fn(),
    deleteBook: vi.fn(),
    undoDelete: vi.fn(),
    isLoading: false,
    setIsLoading: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    setTotalPages: vi.fn(),
    totalPages: 0,
    total: 0,
  }

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BookContext.Provider value={mockContextValue}>
      {children}
    </BookContext.Provider>
  )

  it('returns book list from context', () => {
    const { result } = renderHook(() => useBooks(), { wrapper })
    expect(result.current.books).toEqual([])
  })

  it('returns default books from context', () => {
    const mockContextValue = {
      books: [{ id: 1, title: 'Book 1', author: 'Author 1', status: 'reading' }],
      fetchBooks: vi.fn(),
      setBooks: vi.fn(),
      deleteBook: vi.fn(),
      undoDelete: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      page: 1,
      setPage: vi.fn(),
      setTotalPages: vi.fn(),
      totalPages: 1,
      total: 1,
    }
  
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BookContext.Provider value={mockContextValue}>{children}</BookContext.Provider>
    )
  
    const { result } = renderHook(() => useBooks(), { wrapper })
  
    expect(result.current.books).toEqual(mockContextValue.books)
  })
  
  
})