import React from 'react'
import { render, screen } from '@testing-library/react'
import { BookCard } from '../BookCard'
import { describe, expect, it } from 'vitest'

describe('BookCard', () => {
  it('renders the title and author', () => {
    const book = { id: 1, title: 'Test Book', author: 'Test Author', status: 'reading', categories: [{ id: 1, name: 'Category 1' }] }
    render(<BookCard book={book} />)

    expect(screen.getByText('Test Book')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })
})