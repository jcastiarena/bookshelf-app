export type Book = {
  id: number
  title: string
  author: string
  status: string
  categories: Category[]
}

export type Category = {
  id: number
  name: string
}