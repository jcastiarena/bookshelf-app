'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Book } from '@prisma/client';
import { useBooks } from '@/hooks/useBooks';

export default function EditBookForm({ book }: { book: Book }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [, setError] = useState('');
  const [, setSuccess] = useState('');
  const router = useRouter()
  const [status, setStatus] = useState(book.status);
  const statuses = ['to-read', 'reading', 'finished']
  const { updateBook } = useBooks();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !author || !status) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await updateBook(book.id, { title, author, status });
      setSuccess('Book edited!');
      router.push('/books');
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm">Title</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm">Author</label>
        <input
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Estado</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-center">
        <Link href="/books">
          <button type="button" className="text-gray-600 hover:underline dark:text-gray-200">Cancel</button>
        </Link>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </form>
  );
}