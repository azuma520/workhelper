import { NextRequest, NextResponse } from 'next/server'
import { updateStep, deleteStep, listSteps } from '../../../_store'
import { UpdateStepInput } from '@/app/types/task'

export async function GET(_req: NextRequest, { params }: { params: { id: string, stepId: string } }) {
  const steps = listSteps(params.id)
  const step = steps.find(s => s.id === params.stepId)
  if (!step) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ step })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string, stepId: string } }) {
  try {
    const body = (await req.json()) as UpdateStepInput
    const updated = updateStep(params.id, params.stepId, body)
    if (!updated) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json({ step: updated })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string, stepId: string } }) {
  const ok = deleteStep(params.id, params.stepId)
  if (!ok) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ success: true })
}


