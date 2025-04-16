import React from 'react'
import { Book } from "@/lib/mockedBooks";

type Props = {
  book: Book;
};

export function BookCard({ book }: Props) {
const statusColor = {
    "to-read": "bg-blue-100 text-blue-800",
    "reading": "bg-yellow-100 text-yellow-800",
    "read": "bg-green-100 text-green-800",
  };

  return (
    <div className="">
      <h2 className="text-lg font-semibold">{book.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
      <span className={`mt-2 inline-block px-2 py-1 text-sm rounded ${statusColor[book.status]}`}>
        {book.status}
      </span>
    </div>
  );
}