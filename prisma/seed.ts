import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const statuses = ['to-read', 'reading', 'finished']

function generateBooks() {
  return Array.from({ length: 50 }, () => ({
    title: faker.book.title(),
    author: faker.book.author(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }))
}

export async function seed() {
  const books = generateBooks()

  console.log('🌱 Seeding books with Faker...')
  await prisma.book.createMany({ data: books })
  console.log('✅ Seeded 50 random books!')
}

// CLI support
if (require.main === module) {
  seed()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}