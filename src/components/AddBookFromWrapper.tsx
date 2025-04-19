'use client';

import { useEffect, useState } from 'react';
import AddBookForm from './AddBookForm';
import { useBooks } from '@/hooks/useBooks';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';
import { useRouter } from 'next/navigation';

export default function AddBookFormWrapper() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { createBook } = useBooks();
  const router = useRouter();

  useEffect(() => {
    categoryService.getAllCategories().then(res => {
      setAllCategories(res);
      console.log(`Categories: ${res}`);
    });
  }, []);

  const handleSubmit = async (data: {
    title: string;
    author: string;
    categoryIds: string[];
  }) => {
    const selectedCategories = allCategories.filter(cat => data.categoryIds.includes(cat.id.toString()));
    console.log(`Selected Categories: ${selectedCategories}`);
    await createBook({ title: data.title, author: data.author, status: 'to-read', categories: selectedCategories });
    router.push('/books');
  };

  return (
    <AddBookForm
      allCategories={allCategories}
      onSubmit={handleSubmit}
    />
  );
}