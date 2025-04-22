import Link from 'next/link'
import { bookService } from '@/services/bookService'

export default async function HomePage() {
  const featuredBooks = await bookService.getFeaturedBooks()

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📚 Welcome to BookShelf</h1>
      <p className="text-lg mb-6">
        Organize, explore and track your reading — powered by Next.js and Prisma.
      </p>

      <div className="mb-8">
        <Link
          href="/books"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Browse Books
        </Link>
        <span className="ml-4 text-sm text-gray-500">
          <button className="underline text-sm opacity-50 cursor-not-allowed" disabled>
            Login (coming soon)
          </button>
        </span>
      </div>

      <div className="grid gap-4">
        {featuredBooks.map(book => (
          <div
            key={book.id}
            className="border border-gray-200 p-4 rounded shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-400 mt-1 capitalize">
              {book.status.replace('-', ' ')}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
