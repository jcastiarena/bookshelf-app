import { Suspense } from 'react'
import BooksPageClient from './BooksPageClient'

export default function Page() {
  return (
    <main className="p-6">
      <Suspense fallback={<div>Loading books...</div>}>
        <BooksPageClient />
      </Suspense>
    </main>
  )
}