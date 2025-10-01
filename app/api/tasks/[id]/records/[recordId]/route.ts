import { NextRequest, NextResponse } from 'next/server'
import { updateRecord, deleteRecord, listRecords } from '../../../_store'

// GET /api/tasks/:id/records/:recordId - 取得單一紀錄
export async function GET(req: NextRequest, { params }: { params: { id: string; recordId: string } }) {
  const { id, recordId } = params
  const records = listRecords(id)
  const record = records.find(r => r.id === recordId)
  
  if (!record) {
    return NextResponse.json({ error: '紀錄不存在' }, { status: 404 })
  }
  
  return NextResponse.json({ record })
}

// PUT /api/tasks/:id/records/:recordId - 更新紀錄
export async function PUT(req: NextRequest, { params }: { params: { id: string; recordId: string } }) {
  const { id, recordId } = params
  const body = await req.json()
  const { content, stepId, duration } = body

  if (!content || !content.trim()) {
    return NextResponse.json({ error: '紀錄內容不可為空' }, { status: 400 })
  }

  const record = updateRecord(id, recordId, content.trim(), stepId, duration)
  
  if (!record) {
    return NextResponse.json({ error: '紀錄不存在' }, { status: 404 })
  }

  return NextResponse.json({ record })
}

// DELETE /api/tasks/:id/records/:recordId - 刪除紀錄
export async function DELETE(req: NextRequest, { params }: { params: { id: string; recordId: string } }) {
  const { id, recordId } = params
  const success = deleteRecord(id, recordId)
  
  if (!success) {
    return NextResponse.json({ error: '紀錄不存在' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

