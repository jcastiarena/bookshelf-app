import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const statuses = ['to-read', 'reading', 'finished']
const categories = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'Self-Help',
  'History',
  'Technology'
]

function generateBooks() {
  return Array.from({ length: 50 }, () => ({
    title: faker.book.title(),
    author: faker.book.author(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }))
}

export async function seed() {
  // Clear existing data
  await prisma.bookCategory.deleteMany()
  await prisma.book.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  console.log('🌱 Creating categories...')
  await prisma.category.createMany({
    data: categories.map(name => ({ name })),
    skipDuplicates: true
  })
  
  // Get all categories for assignment
  const allCategories = await prisma.category.findMany()
  
  // Create books with category relationships
  console.log('🌱 Seeding books with categories...')
  const books = generateBooks()
  
  for (const book of books) {
    const createdBook = await prisma.book.create({
      data: {
        ...book,
        categories: {
          create: getRandomCategories(allCategories)
        }
      }
    })
  }
  
  console.log(`✅ Seeded ${books.length} books with categories!`)
}

function getRandomCategories(categories: any[]) {
  const count = faker.number.int({ min: 1, max: 3 })
  const selected = faker.helpers.arrayElements(categories, count)
  
  return selected.map(category => ({
    category: { connect: { id: category.id } }
  }))
}

// CLI support remains the same
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
