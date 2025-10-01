import { NextRequest, NextResponse } from 'next/server'
import { addEvidence, listSteps } from '../../../../_store'
import { CreateEvidenceInput } from '@/app/types/task'

export async function GET(_req: NextRequest, { params }: { params: { id: string, stepId: string } }) {
  const steps = listSteps(params.id)
  const step = steps.find(s => s.id === params.stepId)
  if (!step) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ evidence: step.evidence || [] })
}

export async function POST(req: NextRequest, { params }: { params: { id: string, stepId: string } }) {
  try {
    const body = (await req.json()) as CreateEvidenceInput
    if (!body.kind || !body.name || !body.url || typeof body.size !== 'number') {
      return NextResponse.json({ error: 'invalid evidence payload' }, { status: 400 })
    }
    const step = addEvidence(params.id, params.stepId, body)
    if (!step) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json({ step }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}


