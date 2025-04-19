'use client'

import { useBooks } from '@/hooks/useBooks'
import Link from 'next/link'
import { BookCard } from '@/components/BookCard'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { Book } from '@/types'

export default function BooksPage() {
  const { books, fetchBooks, deleteBook, undoDelete, isLoading, page, setPage, totalPages, total } = useBooks()

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  
  const handleDelete = (book: Book) => {
    const confirmed = confirm('Are you sure you want to delete this book?')
    if (!confirmed) return

    deleteBook(book.id)

    toast.success(
      (t) => (
        <span>
          Book deleted.
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              await undoDelete(book)
            }}
            className="ml-2 text-blue-600 underline"
          >
            Undo
          </button>
        </span>
      ),
      { duration: 5000 }
    )
  }

  return isLoading ? (
    <main className="p-6 max-w-6xl mx-auto">
      <p className="text-gray-500">Loading books...</p>
    </main>
  ) : (
    <main className="p-6 max-w-6xl mx-auto">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books</h1>
        <Link href="/books/new">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            + New Book
          </button>
        </Link>
      </div>

      <p className="text-sm text-gray-600 mb-4 dark:text-gray-200">Total items: {total}</p>

      {books.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-200">No books available.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div key={book.id} className="border rounded p-4 flex flex-col justify-between">
              <BookCard book={book} />
              <div className="flex justify-end gap-2 mt-4">
                <Link href={`/books/${book.id}/edit`}>
                  <button className="bg-blue-100 hover:bg-blue-200 text-white px-3 py-1 rounded text-sm">✏️</button>
                </Link>
                <button
                  onClick={() => handleDelete(book)}
                  className="bg-red-100 hover:bg-red-200 text-white px-3 py-1 rounded text-sm"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          First
        </button>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-3 py-1 rounded ${
              pg === page ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={totalPages !== null && page >= totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          Next
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={totalPages !== null && page >= totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          Last
        </button>
      </div>
    </main>
  )
}