import { NextRequest, NextResponse } from 'next/server'
import { listRecords, createRecord } from '../../_store'

// GET /api/tasks/:id/records - 列出任務的所有紀錄
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const records = listRecords(id)
  return NextResponse.json({ records })
}

// POST /api/tasks/:id/records - 新增紀錄
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()
  const { content, stepId, duration } = body

  if (!content || !content.trim()) {
    return NextResponse.json({ error: '紀錄內容不可為空' }, { status: 400 })
  }

  const record = createRecord(id, content.trim(), stepId, duration)
  return NextResponse.json({ record }, { status: 201 })
}

