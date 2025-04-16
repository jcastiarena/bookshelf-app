import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const statuses = ['to-read', 'reading', 'finished']

const books = Array.from({ length: 50 }, () => ({
  title: faker.book.title(),
  author: faker.book.author(),
  status: statuses[Math.floor(Math.random() * statuses.length)],
}))

async function main() {
  console.log('🌱 Seeding books with Faker...')

  await prisma.book.createMany({ data: books })

  console.log('✅ Seeded 50 random books!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())