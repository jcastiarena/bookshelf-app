import { expect, vi, test } from 'vitest'
import { bookService } from '../bookService'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ books: [], total: 0, totalPages: 0, currentPage: 1 }),
  })
) as any

test('fetches paginated books', async () => {
  const result = await bookService.getAll(1, 10)
  expect(result.books).toBeDefined()
  expect(fetch).toHaveBeenCalledWith('/api/books?page=1&limit=10', { cache: 'no-store' })
})