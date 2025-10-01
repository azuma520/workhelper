// 任務相關的 TypeScript 類型定義

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskRecord {
  id: string
  content: string
  createdAt: Date
  duration?: number // 分鐘
  // 關聯到某個步驟（可選）
  stepId?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  startedAt?: Date
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date

  // 關聯
  sopId?: string // 關聯的 SOP
  tags?: string[]

  // 任務紀錄
  records?: TaskRecord[]

  // 統計
  estimatedTime?: number // 預估時間（分鐘）
  actualTime?: number // 實際時間（分鐘）
  pomodoroCount?: number // 番茄鐘數量
}

export interface CreateTaskInput {
  title: string
  description?: string
  priority?: TaskPriority
  startedAt?: Date
  dueDate?: Date
  sopId?: string
  tags?: string[]
  estimatedTime?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  startedAt?: Date
  dueDate?: Date
  tags?: string[]
}

export interface AddTaskRecordInput {
  content: string
  duration?: number
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  pending: number
  completionRate: number
  totalTime: number // 總花費時間
  avgTimePerTask: number // 平均時間
}


// ====== Steps & Evidence ======

export type TaskStepStatus = 'pending' | 'in_progress' | 'done' | 'blocked'

export interface Evidence {
  id: string
  taskId: string
  stepId: string
  kind: 'image' | 'pdf' | 'doc' | 'sheet' | 'slide' | 'video' | 'link' | 'text'
  name: string
  url: string
  size: number
  mimeType?: string
  previewUrl?: string
  note?: string
  isFinal?: boolean
  createdAt: Date
}

export interface TaskStep {
  id: string
  taskId: string
  order: number
  status: TaskStepStatus
  what: string
  result: string
  howKeyPoints?: string[]
  why?: string
  expectedMinutes?: number
  spentMinutes?: number
  notes?: string
  evidence?: Evidence[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateStepInput {
  what: string
  result: string
  howKeyPoints?: string[]
  why?: string
  expectedMinutes?: number
}

export interface UpdateStepInput {
  what?: string
  result?: string
  howKeyPoints?: string[]
  why?: string
  expectedMinutes?: number
  spentMinutes?: number
  notes?: string
  status?: TaskStepStatus
  order?: number
}

export interface CreateEvidenceInput {
  kind: Evidence['kind']
  name: string
  url: string
  size: number
  mimeType?: string
  previewUrl?: string
  note?: string
  isFinal?: boolean
}


