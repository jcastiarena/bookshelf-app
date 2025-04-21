import { Book } from '@/types'
import { toast } from 'react-hot-toast';

export const BOOK_STATUSES = ['to-read', 'reading', 'finished'] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export interface BookFilters {
  title?: string;
  author?: string;
  statuses?: string[];
  categoryIds?: string[];
}

const API_BASE = '/api/books'

export const bookService = {

  async getAll(
    page = 1,
    limit = 10,
    filters?: BookFilters
  ): Promise<{ books: Book[]; totalPages: number, total: number, currentPage: number }> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (filters?.title) params.set('title', filters.title);
    if (filters?.author) params.set('author', filters.author);
    filters?.statuses?.forEach(status => params.append('statuses', status));
    filters?.categoryIds?.forEach(id => params.append('categoryIds', id));

    const res = await fetch(`${API_BASE}?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch books', { cause: res });
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
      body: JSON.stringify({ ...book, categories: book.categories }),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      const message = error?.message || 'Something went wrong';
      toast.error(message);
      throw new Error(message);
    }
    const result = await res.json();
    toast.success('Book created');
    return result;
  },

  async update(id: number, book: Partial<Book>) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...book, categories: book.categories }),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      const message = error?.message || 'Something went wrong';
      toast.error(message);
      throw new Error(message);
    }
    const result = await res.json();
    toast.success('Book updated');
    return result;
  },

  async getById(id: number): Promise<Book> {
    const res = await fetch(`${API_BASE}/${id}`)
    if (!res.ok) throw new Error('Book not found')
    return res.json()
  },
}