// src/lib/books.ts
export type Book = {
    id: string;
    title: string;
    author: string;
    status: "to-read" | "reading" | "read";
  };
  
  export async function getMockBooks(): Promise<Book[]> {
    return [
      {
        id: "1",
        title: "Clean Code",
        author: "Robert C. Martin",
        status: "read",
      },
      {
        id: "2",
        title: "The Pragmatic Programmer",
        author: "Andy Hunt & Dave Thomas",
        status: "reading",
      },
      {
        id: "3",
        title: "Atomic Habits",
        author: "James Clear",
        status: "to-read",
      },
    ];
  }