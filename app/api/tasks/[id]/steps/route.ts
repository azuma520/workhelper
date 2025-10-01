import { NextRequest, NextResponse } from 'next/server'
import { listSteps, createStep } from '../../_store'
import { CreateStepInput } from '@/app/types/task'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ steps: listSteps(params.id) })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as CreateStepInput
    if (!body.what || !body.result) {
      return NextResponse.json({ error: 'what and result are required' }, { status: 400 })
    }
    const step = createStep(params.id, body)
    if (!step) return NextResponse.json({ error: 'Task Not Found' }, { status: 404 })
    return NextResponse.json({ step }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}


