import { NextResponse } from 'next/server';
import { seed } from '../../../../prisma/seed'

export async function GET() {
  try {
    await seed();
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding failed:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}