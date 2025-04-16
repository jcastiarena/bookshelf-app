'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter()


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !author) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author }),
      });

      if (!res.ok) throw new Error('Failed to add book');
      router.push('/books')
      setSuccess('Book added!');
      setTitle('');
      setAuthor('');
    } catch (err) {
      setError('Something went wrong.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold dark:text-black">Add New Book</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-black" htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-black" htmlFor="author">Author</label>
        <input
          id="author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
        />
      </div>

      <div className="flex gap-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add Book
        </button>

        <Link href="/books">
            <button 
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
            Cancel
            </button>
        </Link>
      </div>
    </form>
  );
}