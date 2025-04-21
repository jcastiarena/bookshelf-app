'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Book } from '@prisma/client';
import { useBooks } from '@/hooks/useBooks';
import { Category } from '@/types';
import { categoryService } from '@/services/categoryService';


export default function EditBookForm({ book }: { book: Book & { categories: Category[] } }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [, setError] = useState('');
  const [, setSuccess] = useState('');
  const router = useRouter()
  const [status, setStatus] = useState(book.status);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const statuses = ['to-read', 'reading', 'finished']
  const { updateBook } = useBooks();

  useEffect(() => {
    if (book.categories && book.categories.length > 0) {
      setSelectedCategories(book.categories);
    }
  }, [book.categories]);
  
  useEffect(() => {
    categoryService.getAllCategories().then(fetchedCategories => {
      setAllCategories(fetchedCategories);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !author || !status) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await updateBook(book.id, { title, author, status, categories: selectedCategories });
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
      <div>
        <label className="block font-semibold mb-1">Categories</label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map(cat => {
            const isSelected = selectedCategories.some(selected => selected.id === cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                className={`px-3 py-1 text-sm rounded-full border flex items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() =>
                  setSelectedCategories(prev =>
                    isSelected
                      ? prev.filter(selected => selected.id !== cat.id)
                      : [...prev, cat]
                  )
                }
              >
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {cat.name}
              </button>
            );
          })}
        </div>
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