import { Category } from "@/types"

const API_BASE = '/api/categories'

export const categoryService = {

  async getAllCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('Failed to fetch categories')
    const data = await res.json()
    return data
  },

}