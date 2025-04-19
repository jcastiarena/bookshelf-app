import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const expectedToken = process.env.MIGRATION_SECRET

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return new Promise<void | Response>((resolve) => {
    exec('npx prisma migrate deploy', { env: process.env }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr)
        return resolve(NextResponse.json({ error: stderr }, { status: 500 }))
      }

      console.log(stdout)
      return resolve(NextResponse.json({ message: 'Migrations applied', output: stdout }))
    })
  })
} 