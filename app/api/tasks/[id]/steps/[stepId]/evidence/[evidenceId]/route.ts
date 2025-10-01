import { NextRequest, NextResponse } from 'next/server'
import { removeEvidence, listSteps } from '../../../../../_store'

export async function GET(_req: NextRequest, { params }: { params: { id: string, stepId: string, evidenceId: string } }) {
  const steps = listSteps(params.id)
  const step = steps.find(s => s.id === params.stepId)
  const evidence = step?.evidence?.find(e => e.id === params.evidenceId)
  if (!step || !evidence) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ evidence })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string, stepId: string, evidenceId: string } }) {
  const step = removeEvidence(params.id, params.stepId, params.evidenceId)
  if (!step) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ success: true })
}


