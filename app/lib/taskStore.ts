/**
 * 任務資料儲存層
 *
 * 階段 1: 使用 localStorage（簡單、快速）
 * 階段 2: 可以換成資料庫（Supabase/MongoDB）
 *
 * 好處：
 * - 業務邏輯不變，只需要換這個檔案
 * - 先驗證功能，之後再考慮後端
 */

import { Task, CreateTaskInput, UpdateTaskInput, AddTaskRecordInput, TaskRecord } from '../types/task'

const STORAGE_KEY = 'sop-app-tasks'

// 從 localStorage 讀取任務
export function getTasks(): Task[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const tasks = JSON.parse(data)

    // 轉換日期字串為 Date 物件
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      records: task.records?.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
      })),
    }))
  } catch (error) {
    console.error('Error loading tasks:', error)
    return []
  }
}

// 儲存任務到 localStorage
function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks:', error)
  }
}

// 建立新任務
export function createTask(input: CreateTaskInput): Task {
  const tasks = getTasks()

  const newTask: Task = {
    id: generateId(),
    title: input.title,
    description: input.description,
    status: 'pending',
    priority: input.priority || 'medium',
    dueDate: input.dueDate,
    createdAt: new Date(),
    updatedAt: new Date(),
    sopId: input.sopId,
    tags: input.tags || [],
    records: [],
    estimatedTime: input.estimatedTime,
    pomodoroCount: 0,
  }

  tasks.push(newTask)
  saveTasks(tasks)

  return newTask
}

// 更新任務
export function updateTask(id: string, input: UpdateTaskInput): Task | null {
  const tasks = getTasks()
  const index = tasks.findIndex(t => t.id === id)

  if (index === -1) return null

  const updatedTask: Task = {
    ...tasks[index],
    ...input,
    updatedAt: new Date(),
    // 如果狀態改為 completed，記錄完成時間
    completedAt: input.status === 'completed' ? new Date() : tasks[index].completedAt,
  }

  tasks[index] = updatedTask
  saveTasks(tasks)

  return updatedTask
}

// 刪除任務
export function deleteTask(id: string): boolean {
  const tasks = getTasks()
  const filtered = tasks.filter(t => t.id !== id)

  if (filtered.length === tasks.length) return false

  saveTasks(filtered)
  return true
}

// 取得單一任務
export function getTask(id: string): Task | null {
  const tasks = getTasks()
  return tasks.find(t => t.id === id) || null
}

// 新增任務紀錄
export function addTaskRecord(taskId: string, input: AddTaskRecordInput): Task | null {
  const tasks = getTasks()
  const index = tasks.findIndex(t => t.id === taskId)

  if (index === -1) return null

  const newRecord: TaskRecord = {
    id: generateId(),
    content: input.content,
    createdAt: new Date(),
    duration: input.duration,
  }

  const task = tasks[index]
  task.records = [...(task.records || []), newRecord]
  task.updatedAt = new Date()

  // 累計實際時間
  if (input.duration) {
    task.actualTime = (task.actualTime || 0) + input.duration
  }

  saveTasks(tasks)
  return task
}

// 工具函數：生成 ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 匯出所有函數
export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTask,
  addTaskRecord,
}


