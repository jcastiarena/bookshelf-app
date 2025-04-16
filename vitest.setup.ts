import '@testing-library/jest-dom'
import { vi } from 'vitest'

global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    books: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
  }),
})
) as unknown as typeof global.fetch