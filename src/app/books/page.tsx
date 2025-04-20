import { Suspense } from 'react'
import BooksPageClient from './BooksPageClient'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading books...</div>}>
      <BooksPageClient />
    </Suspense>
  )
}