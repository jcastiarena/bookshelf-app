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
    page: 1,
    setPage: vi.fn(),
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
  
})