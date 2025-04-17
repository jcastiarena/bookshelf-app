import { Book } from '@/types';
import React from 'react'

type Props = {
  book: Book;
};

export function BookCard({ book }: Props) {
const statusColor = {
    "to-read": "bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white",
    "reading": "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white",
    "finished": "bg-green-100 text-green-800 dark:bg-green-600 dark:text-white",
  };

  return (
    <div className="">
      <h2 className="text-lg font-semibold">{book.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
      <span className={`mt-2 inline-block px-2 py-1 text-sm rounded ${statusColor[book.status as keyof typeof statusColor]}`}>
        {book.status}
      </span>
    </div>
  );
}