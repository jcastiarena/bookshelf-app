import { Book } from '@/types'

const API_BASE = '/api/books'

export const bookService = {

  async getAll(page = 1, limit = 10): Promise<{ books: Book[]; totalPages: number, total: number, currentPage: number }> {
    const res = await fetch(`${API_BASE}?page=${page}&limit=${limit}`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('Failed to fetch books')
    return res.json()
  },

  async delete(id: number): Promise<boolean> {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
    return res.ok
  },

  async create(book: Omit<Book, 'id'>) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
    if (!res.ok) throw new Error('Failed to create book')
    return res.json()
  },

  async update(id: number, book: Partial<Book>) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
    if (!res.ok) throw new Error('Failed to update book')
    return res.json()
  },

  async getById(id: number): Promise<Book> {
    const res = await fetch(`${API_BASE}/${id}`)
    if (!res.ok) throw new Error('Book not found')
    return res.json()
  },
}