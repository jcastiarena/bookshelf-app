'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooks } from '@/hooks/useBooks';
import Select from 'react-select';
import { Category } from '@/types';

interface BookFormProps {
  onSubmit: (data: { title: string; author: string; categoryIds: string[] }) => void;
  initialData?: {
    title: string;
    author: string;
    categoryIds: string[];
  };
  allCategories: Category[];
}

export default function AddBookForm({ initialData, allCategories = [] }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter()
  const { createBook } = useBooks();
  const [selectedCategories, setSelectedCategories] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (initialData?.categoryIds) {
      setSelectedCategories(
        initialData.categoryIds.map((id) => ({
          value: id,
          label: allCategories.find((cat) => cat.id.toString() === id)?.name || '',
        }))
      );
    }
  }, [initialData, allCategories]);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !author) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await createBook({ title, author, status: 'to-read', categories: selectedCategories.map(cat => ({ id: Number(cat.value), name: cat.label })) });
      if (!res) throw new Error('Failed to add book');
      router.push('/books')
      setSuccess('Book added!');
      setTitle('');
      setAuthor('');
    } catch (err) {
      console.error(err)
      setError('Something went wrong.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md mx-auto mt-6 dark:bg-gray-800">
      <h2 className="text-2xl font-bold dark:text-white">Add New Book</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-white" htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-white" htmlFor="author">Author</label>
        <input
          id="author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-white" htmlFor="categories">Categories</label>
        {Array.isArray(allCategories) ? (
          allCategories.length > 0 ? (
            <Select
              isMulti
              options={allCategories.map(cat => ({ label: cat.name, value: cat.id.toString() }))}
              value={selectedCategories}
              onChange={(opts) => setSelectedCategories(opts as { label: string; value: string }[])}
              className="react-select-container dark:border-gray-600 dark:bg-gray-800 dark:text-black dark:placeholder:text-gray-200"
              classNamePrefix="react-select"
            />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-200">No categories available.</p>
          )
        ) : (
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-200">
            <svg className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-200" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
            </svg>
            <span>Loading categories...</span>
          </div>
        )}
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