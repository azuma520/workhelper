import { NextRequest, NextResponse } from 'next/server'
import { listTasks, createTaskServer } from './_store'
import { CreateTaskInput } from '@/app/types/task'

export async function GET() {
  return NextResponse.json({ tasks: listTasks() })
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateTaskInput
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 })
    }
    const task = createTaskServer({
      title: body.title.trim(),
      description: body.description,
      priority: body.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      sopId: body.sopId,
      tags: body.tags,
      estimatedTime: body.estimatedTime,
    })
    return NextResponse.json({ task }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}


