import { Book } from '@/types';
import React from 'react';

type Props = {
  book: Book;
  selectedCategoryIds?: string[];
};

export function BookCard({ book, selectedCategoryIds }: Props) {
  const statusColor = {
    "to-read": "bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white",
    "reading": "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white",
    "finished": "bg-green-100 text-green-800 dark:bg-green-600 dark:text-white",
  };

  return (
    <div className="bg-white dark:bg-black rounded-lg space-y-2 flex justify-between items-start dark:text-gray-200 ">
      <div className="space-y-1 dark:text-gray-200">
        <h2 className="text-xl  font-bold text-gray-900 dark:text-white">{book.title}</h2>
        <p className="text-sm pt-2 pb-2 text-gray-600 dark:text-gray-300">{book.author}</p>
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusColor[book.status as keyof typeof statusColor]}`}
        >
          {book.status}
        </span>
      </div>
      <div className="flex flex-col gap-1 dark:text-gray-200">
        {book.categories.map((cat) => {
          const isActive = cat.id && selectedCategoryIds?.includes(cat.id.toString());
          return (
            <span
              key={cat.id}
              className={`text-xs text-center font-medium rounded px-2 py-1 ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold border border-blue-700'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {cat.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}