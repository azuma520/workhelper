// 簡易伺服器端記憶體儲存（開發用）
// 注意：在開發熱重載時資料可能重置；之後可替換為資料庫。

import { Task, TaskRecord, CreateTaskInput, UpdateTaskInput, TaskStep, CreateStepInput, UpdateStepInput, Evidence, CreateEvidenceInput } from '@/app/types/task'

// 使用 globalThis 在開發熱重載間持久化
const g = globalThis as unknown as { __SOP_APP_TASKS__?: Task[]; __SOP_APP_STEPS__?: Record<string, TaskStep[]> }
if (!g.__SOP_APP_TASKS__) {
  g.__SOP_APP_TASKS__ = []
}
let tasks: Task[] = g.__SOP_APP_TASKS__!

// 每個 taskId 對應的步驟列表
if (!g.__SOP_APP_STEPS__) {
  g.__SOP_APP_STEPS__ = {}
}
let stepsMap: Record<string, TaskStep[]> = g.__SOP_APP_STEPS__!

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function listTasks(): Task[] {
  return tasks
}

export function createTaskServer(input: CreateTaskInput): Task {
  const now = new Date()
  const task: Task = {
    id: generateId(),
    title: input.title,
    description: input.description,
    status: 'pending',
    priority: input.priority || 'medium',
    startedAt: input.startedAt || now,
    dueDate: input.dueDate,
    createdAt: now,
    updatedAt: now,
    sopId: input.sopId,
    tags: input.tags || [],
    records: [],
    estimatedTime: input.estimatedTime,
    pomodoroCount: 0,
  }
  tasks = [task, ...tasks]
  g.__SOP_APP_TASKS__ = tasks
  return task
}

export function getTaskServer(id: string): Task | undefined {
  return tasks.find(t => t.id === id)
}

export function updateTaskServer(id: string, input: UpdateTaskInput): Task | undefined {
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) return undefined
  const prev = tasks[idx]
  const next: Task = {
    ...prev,
    ...input,
    updatedAt: new Date(),
    completedAt: input.status === 'completed' ? (prev.completedAt || new Date()) : prev.completedAt,
  }
  tasks[idx] = next
  g.__SOP_APP_TASKS__ = tasks
  return next
}

export function deleteTaskServer(id: string): boolean {
  const before = tasks.length
  tasks = tasks.filter(t => t.id !== id)
  g.__SOP_APP_TASKS__ = tasks
  return tasks.length < before
}

export function addRecordServer(taskId: string, content: string, duration?: number): Task | undefined {
  const idx = tasks.findIndex(t => t.id === taskId)
  if (idx === -1) return undefined
  const record: TaskRecord = {
    id: generateId(),
    content,
    createdAt: new Date(),
    duration,
  }
  const task = tasks[idx]
  task.records = [...(task.records || []), record]
  task.updatedAt = new Date()
  if (duration) task.actualTime = (task.actualTime || 0) + duration
  tasks[idx] = task
  g.__SOP_APP_TASKS__ = tasks
  return task
}


// ===== Steps operations =====

export function listSteps(taskId: string): TaskStep[] {
  return (stepsMap[taskId] || []).slice().sort((a, b) => a.order - b.order)
}

export function createStep(taskId: string, input: CreateStepInput): TaskStep | undefined {
  const task = getTaskServer(taskId)
  if (!task) return undefined
  const now = new Date()
  const arr = stepsMap[taskId] || []
  const step: TaskStep = {
    id: generateId(),
    taskId,
    order: arr.length === 0 ? 1 : Math.max(...arr.map(s => s.order)) + 1,
    status: 'pending',
    what: input.what,
    result: input.result,
    howKeyPoints: input.howKeyPoints,
    why: input.why,
    expectedMinutes: input.expectedMinutes,
    createdAt: now,
    updatedAt: now,
    evidence: [],
  }
  stepsMap[taskId] = [ ...arr, step ]
  g.__SOP_APP_STEPS__ = stepsMap
  return step
}

export function updateStep(taskId: string, stepId: string, input: UpdateStepInput): TaskStep | undefined {
  const arr = stepsMap[taskId]
  if (!arr) return undefined
  const idx = arr.findIndex(s => s.id === stepId)
  if (idx === -1) return undefined
  const prev = arr[idx]
  const next: TaskStep = { ...prev, ...input, updatedAt: new Date() }
  // 若更新了 order，簡單重排
  let newArr = arr.slice()
  newArr[idx] = next
  if (typeof input.order === 'number') {
    newArr = newArr.sort((a, b) => a.order - b.order).map((s, i) => ({ ...s, order: i + 1 }))
  }
  stepsMap[taskId] = newArr
  g.__SOP_APP_STEPS__ = stepsMap
  return next
}

export function deleteStep(taskId: string, stepId: string): boolean {
  const arr = stepsMap[taskId]
  if (!arr) return false
  const before = arr.length
  const afterArr = arr.filter(s => s.id !== stepId)
  stepsMap[taskId] = afterArr.map((s, i) => ({ ...s, order: i + 1 }))
  g.__SOP_APP_STEPS__ = stepsMap
  return afterArr.length < before
}

// Evidence operations
export function addEvidence(taskId: string, stepId: string, input: CreateEvidenceInput): TaskStep | undefined {
  const arr = stepsMap[taskId]
  if (!arr) return undefined
  const idx = arr.findIndex(s => s.id === stepId)
  if (idx === -1) return undefined
  const evi: Evidence = {
    id: generateId(),
    taskId,
    stepId,
    kind: input.kind,
    name: input.name,
    url: input.url,
    size: input.size,
    mimeType: input.mimeType,
    previewUrl: input.previewUrl,
    note: input.note,
    isFinal: input.isFinal,
    createdAt: new Date(),
  }
  const step = arr[idx]
  step.evidence = [...(step.evidence || []), evi]
  step.updatedAt = new Date()
  arr[idx] = step
  stepsMap[taskId] = arr
  g.__SOP_APP_STEPS__ = stepsMap
  return step
}

export function removeEvidence(taskId: string, stepId: string, evidenceId: string): TaskStep | undefined {
  const arr = stepsMap[taskId]
  if (!arr) return undefined
  const idx = arr.findIndex(s => s.id === stepId)
  if (idx === -1) return undefined
  const step = arr[idx]
  step.evidence = (step.evidence || []).filter(e => e.id !== evidenceId)
  step.updatedAt = new Date()
  arr[idx] = step
  stepsMap[taskId] = arr
  g.__SOP_APP_STEPS__ = stepsMap
  return step
}

// ====== Records Operations ======

// 每個 taskId 對應的紀錄列表
const recordsG = globalThis as unknown as { __SOP_APP_RECORDS__?: Record<string, TaskRecord[]> }
if (!recordsG.__SOP_APP_RECORDS__) {
  recordsG.__SOP_APP_RECORDS__ = {}
}
let recordsMap: Record<string, TaskRecord[]> = recordsG.__SOP_APP_RECORDS__!

export function listRecords(taskId: string): TaskRecord[] {
  return recordsMap[taskId] || []
}

export function createRecord(taskId: string, content: string, stepId?: string, duration?: number): TaskRecord {
  const record: TaskRecord = {
    id: generateId(),
    content,
    createdAt: new Date(),
    duration,
    stepId,
  }
  const arr = recordsMap[taskId] || []
  recordsMap[taskId] = [record, ...arr]  // 新紀錄在最前面
  recordsG.__SOP_APP_RECORDS__ = recordsMap
  return record
}

export function updateRecord(taskId: string, recordId: string, content: string, stepId?: string, duration?: number): TaskRecord | undefined {
  const arr = recordsMap[taskId]
  if (!arr) return undefined
  const idx = arr.findIndex(r => r.id === recordId)
  if (idx === -1) return undefined
  arr[idx] = { ...arr[idx], content, stepId, duration }
  recordsMap[taskId] = arr
  recordsG.__SOP_APP_RECORDS__ = recordsMap
  return arr[idx]
}

export function deleteRecord(taskId: string, recordId: string): boolean {
  const arr = recordsMap[taskId]
  if (!arr) return false
  const before = arr.length
  recordsMap[taskId] = arr.filter(r => r.id !== recordId)
  recordsG.__SOP_APP_RECORDS__ = recordsMap
  return recordsMap[taskId].length < before
}


