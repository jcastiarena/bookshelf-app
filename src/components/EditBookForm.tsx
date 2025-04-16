'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Book } from '@prisma/client';

export default function EditBookForm({ book }: { book: Book }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [, setError] = useState('');
  const [, setSuccess] = useState('');
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
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author }),
      });

      if (!res.ok) throw new Error('Failed to edit book');
      setSuccess('Book edited!');
      router.push('/books');
    } catch (err) {
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
      <div className="flex justify-between items-center">
        <Link href="/books">
          <button type="button" className="text-gray-600 hover:underline">Cancel</button>
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