import { NextRequest, NextResponse } from 'next/server'
import { getTaskServer, updateTaskServer, deleteTaskServer } from '../_store'
import { UpdateTaskInput } from '@/app/types/task'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const task = getTaskServer(params.id)
  if (!task) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ task })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as UpdateTaskInput
    const updated = updateTaskServer(params.id, body)
    if (!updated) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json({ task: updated })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ok = deleteTaskServer(params.id)
  if (!ok) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}


