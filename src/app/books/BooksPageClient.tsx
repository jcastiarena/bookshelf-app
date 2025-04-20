'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useBooks } from '@/hooks/useBooks'
import Link from 'next/link'
import { BookCard } from '@/components/BookCard'
import { toast, Toaster } from 'react-hot-toast'
import { SetStateAction } from 'react'
import { Book } from '@/types'
import { Category } from '@/types'
import { categoryService } from '@/services/categoryService'

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function BooksPage() {
  const { books, fetchBooks, deleteBook, undoDelete, page, setPage, totalPages, total } = useBooks()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchText, setSearchText] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const debouncedSearchText = useDebouncedValue(searchText, 300);
  const debouncedAuthor = useDebouncedValue(selectedAuthor, 300);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const title = searchParams?.get('title') || '';
    const author = searchParams?.get('author') || '';
    const statuses = searchParams?.getAll('statuses') || [];
    const categoryIds = searchParams?.getAll('categoryIds') || [];

    setSearchText(title);
    setSelectedAuthor(author);
    setSelectedStatuses(statuses);
    setSelectedCategories(categoryIds);
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    categoryService.getAllCategories().then((res: SetStateAction<Category[]>) => setCategories(res))
  }, [])

  useEffect(() => {
    fetchBooks({
      title: debouncedSearchText,
      author: debouncedAuthor,
      statuses: selectedStatuses,
      categoryIds: selectedCategories,
    });
  }, [debouncedSearchText, debouncedAuthor, selectedStatuses, selectedCategories, fetchBooks]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchText) params.set('title', debouncedSearchText);
    if (debouncedAuthor) params.set('author', debouncedAuthor);
    selectedStatuses.forEach((status) => params.append('statuses', status));
    selectedCategories.forEach((id) => params.append('categoryIds', id));

    router.replace(`/books?${params.toString()}`, { scroll: false });
  }, [debouncedSearchText, debouncedAuthor, selectedStatuses, selectedCategories, router]);

  useEffect(() => {
    if (titleInputRef.current) titleInputRef.current.focus();
  }, [debouncedSearchText]);

  useEffect(() => {
    if (authorInputRef.current) authorInputRef.current.focus();
  }, [debouncedAuthor]);

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

  return (
    <main className="min-h-screen flex flex-col p-6 max-w-6xl mx-auto">
      <Toaster />
      <div className="flex-grow grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="sticky top-6 h-fit bg-gray-50 dark:bg-black p-4 rounded-lg shadow-sm space-y-6 text-sm text-gray-700 dark:text-gray-200">
          <div>
            <h3 className="font-semibold mb-2">Search</h3>
            <div className="relative">
              <input
                ref={titleInputRef}
                type="text"
                placeholder="Search by title..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full p-2 pr-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchText('');
                    titleInputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="space-y-1">
              {['to-read', 'reading', 'finished'].map((status) => (
                <label className="block" key={status}>
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status)}
                    onChange={() =>
                      setSelectedStatuses((prev) =>
                        prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
                      )
                    }
                  />{' '}
                  {status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="space-y-1">
              {categories
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((cat) => (
                <label className="block" key={cat.id}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id.toString())}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat.id.toString())
                          ? prev.filter((c) => c !== cat.id.toString())
                          : [...prev, cat.id.toString()]
                      )
                    }
                  />{' '}
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Author</h3>
            <div className="relative">
              <input
                ref={authorInputRef}
                type="text"
                placeholder="Author name"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full p-2 pr-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              {selectedAuthor && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAuthor('');
                    authorInputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Library</h1>
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
                  <BookCard book={book} selectedCategoryIds={selectedCategories} />
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
        </div>
      </div>
      <footer className="mt-auto">
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
      </footer>
    </main>
  )
}
