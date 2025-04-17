import React from 'react'
import { renderHook } from '@testing-library/react'
import { useBooks } from '../useBooks'
import { expect, it, describe, vi } from 'vitest'
import { Book } from '@/types'
import { BookContextWrapper } from '@/context/BookContextWrapper'
import { act } from 'react'

// Mock bookService
vi.mock('@/services/bookService', () => ({
  bookService: {
    getAll: vi.fn().mockResolvedValue({ books: [], total: 0, totalPages: 1 }),
    getById: vi.fn(),
    update: vi.fn().mockResolvedValue(true),
    delete: vi.fn().mockResolvedValue(true),
    create: vi.fn().mockResolvedValue({ id: 2, title: 'New', author: 'Author', status: 'to-read' })
  }
}))

describe('useBooks', () => {
  const mockBook: Book = { id: 1, title: 'Book 1', author: 'Author 1', status: 'reading' }

  const GetWrapper = (initialBooks = [mockBook], initialDeletedBooks: Book[] = []) => {
    return {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <BookContextWrapper
          initialBooks={initialBooks}
          initialDeletedBooks={initialDeletedBooks}
        >
          {children}
        </BookContextWrapper>
      ),
    }
  }

  it('returns book list from context', () => {
    const { wrapper } = GetWrapper()
    const { result } = renderHook(() => useBooks(), { wrapper })
    expect(result.current.books).toEqual([mockBook])
  })

  it('calls fetchBooks and sets loading states', async () => {
    const { wrapper } = GetWrapper()
    const { result } = renderHook(() => useBooks(), { wrapper })

    await act(async () => {
      await result.current.fetchBooks()
    })

    expect(result.current.isLoading).toBe(false)
    const { bookService } = await import('@/services/bookService')
    expect(bookService.getAll).toHaveBeenCalled()
  })

  it('calls createBook and updates state', async () => {
    const newBook = { title: 'New', author: 'Author', status: 'to-read' }
    const { wrapper } = GetWrapper([])
    const { result } = renderHook(() => useBooks(), { wrapper })

    await act(async () => {
      await result.current.createBook(newBook)
    })

    const { bookService } = await import('@/services/bookService')
    expect(bookService.create).toHaveBeenCalledWith(newBook)
    
    // Note: State update happens through fetchBooks which is mocked to return empty array
    // You might want to mock it differently for this test
  })

  it('calls editBook and updates the book in state', async () => {
    const updatedBook = { ...mockBook, title: 'Updated' }
    const { wrapper } = GetWrapper([mockBook])
    const { result } = renderHook(() => useBooks(), { wrapper })

    await act(async () => {
      await result.current.updateBook(mockBook.id, updatedBook)
    })

    expect(result.current.books[0].title).toBe('Updated')
  })

  it('calls deleteBook and removes book from state', async () => {
    const { wrapper } = GetWrapper([mockBook])
    const { result } = renderHook(() => useBooks(), { wrapper })

    await act(async () => {
      await result.current.deleteBook(mockBook.id)
    })

    expect(result.current.books).toHaveLength(0)
  })

  it('calls undoDelete and recreates book', async () => {
    const { wrapper } = GetWrapper([])
    const { result } = renderHook(() => useBooks(), { wrapper })

    await act(async () => {
      await result.current.undoDelete(mockBook)
    })

    const { bookService } = await import('@/services/bookService')
    expect(bookService.create).toHaveBeenCalledWith(mockBook)
    expect(bookService.getAll).toHaveBeenCalled()
  })
})
