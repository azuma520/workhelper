'use client'

import { useEffect, useMemo, useState } from 'react'
import { Task, TaskPriority, TaskStatus, TaskStep, TaskStepStatus, TaskRecord, Evidence } from '../types/task'
import TaskGuideModal from '../components/TaskGuideModal'
import EvidenceModal from '../components/EvidenceModal'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [startedAt, setStartedAt] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [error, setError] = useState<string>('')

  // 編輯相關狀態
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState<string>('')
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium')
  const [editDueDate, setEditDueDate] = useState<string>('')
  const [editStartedAt, setEditStartedAt] = useState<string>('')

  // 篩選
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [sortKey, setSortKey] = useState<'createdAt' | 'priority' | 'status'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // 展開任務詳情（Steps）
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [stepsByTask, setStepsByTask] = useState<Record<string, TaskStep[]>>({})
  const [newStepWhat, setNewStepWhat] = useState('')
  const [newStepResult, setNewStepResult] = useState('')
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [editStepWhat, setEditStepWhat] = useState('')
  const [editStepResult, setEditStepResult] = useState('')
  const [showWhatHint, setShowWhatHint] = useState(false)
  const [showResultHint, setShowResultHint] = useState(false)

  // Records（過程紀錄）
  const [recordsByTask, setRecordsByTask] = useState<Record<string, TaskRecord[]>>({})
  const [newRecordContent, setNewRecordContent] = useState('')
  const [newRecordStepId, setNewRecordStepId] = useState('')
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [editRecordContent, setEditRecordContent] = useState('')
  const [editRecordStepId, setEditRecordStepId] = useState('')

  // 引導模態相關
  const [showGuide, setShowGuide] = useState(false)
  const [isFirstDaily, setIsFirstDaily] = useState(false)

  // 成果展示模態相關
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  const [currentStepForEvidence, setCurrentStepForEvidence] = useState<{ taskId: string; stepId: string } | null>(null)

  // localStorage 管理
  const LAST_GUIDE_KEY = 'sop-app-last-guide-shown'

  function shouldShowGuide(): boolean {
    try {
      const lastShown = localStorage.getItem(LAST_GUIDE_KEY)
      if (!lastShown) return true  // 首次使用
      
      const lastDate = new Date(lastShown)
      const today = new Date()
      
      // 比較日期字串（避免時區問題）
      return lastDate.toDateString() !== today.toDateString()
    } catch (e) {
      // localStorage 不可用（無痕模式）
      return false
    }
  }

  function markGuideShown() {
    try {
      localStorage.setItem(LAST_GUIDE_KEY, new Date().toISOString())
    } catch (e) {
      // 無痕模式失敗不影響功能
      console.warn('localStorage unavailable')
    }
  }

  // 初次載入讀取任務並檢查觸發條件
  useEffect(() => {
    loadTasks().then(() => {
      // 檢查觸發條件
      const shouldShow = shouldShowGuide()
      const hasTasks = tasks.length > 0
      
      if (shouldShow) {
        setIsFirstDaily(true)
        setShowGuide(true)
        markGuideShown()
      } else if (!hasTasks) {
        setIsFirstDaily(false)
        setShowGuide(true)
      }
    })
  }, [])

  async function loadTasks() {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setTasks(data.tasks as Task[])
      else setError(data.error || '載入失敗')
    } catch (e) {
      setError('無法連線到伺服器')
    }
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, inProgress, pending, completionRate }
  }, [tasks])

  async function handleAddTask() {
    const trimmed = title.trim()
    if (!trimmed) {
      setError('請輸入任務名稱')
      return
    }
    // 樂觀新增
    const temp: Task = {
      id: `temp-${Date.now()}`,
      title: trimmed,
      status: 'pending',
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      records: [],
      tags: [],
      pomodoroCount: 0,
    }
    setTasks(prev => [temp, ...prev])
    setTitle('')
    setStartedAt('')
    setDueDate('')
    setError('')
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmed,
          priority,
          startedAt: startedAt ? new Date(startedAt) : undefined,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setTasks(prev => prev.map(t => (t.id === temp.id ? data.task : t)))
      } else {
        setTasks(prev => prev.filter(t => t.id !== temp.id))
        setError(data.error || '新增失敗')
      }
    } catch (e) {
      setTasks(prev => prev.filter(t => t.id !== temp.id))
      setError('無法連線到伺服器')
    }
  }

  async function handleToggleStatus(task: Task) {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed'
    // 樂觀更新
    const prevTasks = tasks
    setTasks(prev => prev.map(t => (
      t.id === task.id
        ? { ...t, status: nextStatus, completedAt: nextStatus === 'completed' ? new Date() : undefined } as Task
        : t
    )))
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) setTasks(prevTasks)
    } catch (e) {
      setTasks(prevTasks)
      setError('無法連線到伺服器')
    }
  }

  async function handleDelete(taskId: string) {
    const prev = tasks
    setTasks(p => p.filter(t => t.id !== taskId))
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      if (!res.ok) {
        // 若後端回 404，代表記憶體儲存重置 → 重新載入清單
        if (res.status === 404) await loadTasks()
        else setTasks(prev)
      }
    } catch (e) {
      setTasks(prev)
      setError('無法連線到伺服器')
    }
  }

  function handleStartEdit(task: Task) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditStartedAt(task.startedAt ? new Date(task.startedAt as any).toISOString().slice(0, 16) : '')
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '')
    setError('')
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditDueDate('')
    setEditStartedAt('')
    setError('')
  }

  async function handleSaveEdit(task: Task) {
    const trimmed = editTitle.trim()
    if (!trimmed) {
      setError('標題不可為空')
      return
    }
    const prev = tasks
    setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, title: trimmed, priority: editPriority, startedAt: editStartedAt ? new Date(editStartedAt) : t.startedAt, dueDate: editDueDate ? new Date(editDueDate) : undefined } as Task : t)))
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed, priority: editPriority, startedAt: editStartedAt ? new Date(editStartedAt) : undefined, dueDate: editDueDate ? new Date(editDueDate) : undefined }),
      })
      if (!res.ok) {
        if (res.status === 404) await loadTasks()
        else setTasks(prev)
      }
      setEditingId(null)
      setEditTitle('')
      setEditDueDate('')
      setEditStartedAt('')
      setError('')
    } catch (e) {
      setTasks(prev)
      setError('無法連線到伺服器')
    }
  }

  async function handleChangeStatus(task: Task, next: TaskStatus) {
    const prev = tasks
    setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: next } as Task : t)))
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        if (res.status === 404) await loadTasks()
        else setTasks(prev)
      }
    } catch (e) {
      setTasks(prev)
      setError('無法連線到伺服器')
    }
  }

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'all') return tasks
    return tasks.filter(t => t.status === statusFilter)
  }, [tasks, statusFilter])

  const sortedTasks = useMemo(() => {
    const arr = [...filteredTasks]
    const priorityWeight: Record<string, number> = { low: 0, medium: 1, high: 2, urgent: 3 }
    const statusWeight: Record<string, number> = { pending: 0, in_progress: 1, completed: 2, cancelled: 3 }

    arr.sort((a, b) => {
      let compare = 0
      if (sortKey === 'createdAt') {
        compare = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortKey === 'priority') {
        compare = priorityWeight[a.priority] - priorityWeight[b.priority]
      } else if (sortKey === 'status') {
        compare = statusWeight[a.status] - statusWeight[b.status]
      }
      return sortOrder === 'asc' ? compare : -compare
    })
    return arr
  }, [filteredTasks, sortKey, sortOrder])

  // 展開/載入步驟與紀錄
  async function toggleExpand(taskId: string) {
    if (expandedId === taskId) {
      setExpandedId(null)
      return
    }
    setExpandedId(taskId)
    try {
      const [steps, records] = await Promise.all([
        fetchSteps(taskId),
        fetchRecords(taskId)
      ])
      setStepsByTask(prev => ({ ...prev, [taskId]: steps }))
      setRecordsByTask(prev => ({ ...prev, [taskId]: records }))
    } catch (e) {
      setError('載入步驟失敗')
    }
  }

  async function handleAddStep(taskId: string) {
    const what = newStepWhat.trim()
    const result = newStepResult.trim()
    if (!what || !result) {
      setError('請填寫 What 與 Result')
      return
    }
    setError('')
    try {
      const res = await fetch(`/api/tasks/${taskId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ what, result }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewStepWhat('')
        setNewStepResult('')
        setStepsByTask(prev => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), data.step as TaskStep],
        }))
      } else if (res.status === 404) {
        await loadTasks()
        await toggleExpand(taskId)
      } else {
        setError(data.error || '新增步驟失敗')
      }
    } catch (e) {
      setError('無法連線到伺服器')
    }
  }

  async function handleApplyThreeStepTemplate(taskId: string) {
    const templates = [
      { what: '先把前置作業準備好', result: '素材/需求/權限已就緒，可以開始動工' },
      { what: '先做出一個可看的版本', result: '有一個可以給人看/試的草稿或截圖' },
      { what: '檢查一下，能交出去就交', result: '用小清單確認OK；要修的開成待修項' },
    ]
    try {
      for (const t of templates) {
        const res = await fetch(`/api/tasks/${taskId}/steps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
        })
        if (!res.ok) throw new Error('apply template failed')
      }
      const steps = await fetchSteps(taskId)
      setStepsByTask(prev => ({ ...prev, [taskId]: steps }))
    } catch (e) {
      setError('套用模板失敗')
    }
  }

  // 處理引導完成
  async function handleGuideComplete(taskData: {
    title: string
    priority: TaskPriority
    method: 'template' | 'manual' | 'later'
    steps?: Array<{ what: string; result: string }>
  }) {
    setShowGuide(false)
    setError('')
    
    try {
      // 1. 建立任務
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskData.title,
          priority: taskData.priority,
        }),
      })
      
      if (!res.ok) {
        setError('建立任務失敗')
        return
      }
      
      const data = await res.json()
      const newTask = data.task as Task
      
      // 2. 樂觀更新 UI
      setTasks(prev => [newTask, ...prev])
      
      // 3. 根據選擇的方式處理步驟
      if (taskData.method === 'template') {
        // 套用三步模板
        await handleApplyThreeStepTemplate(newTask.id)
        // 自動展開步驟
        setExpandedId(newTask.id)
      } else if (taskData.method === 'manual' && taskData.steps && taskData.steps.length > 0) {
        // 套用自訂步驟
        for (const step of taskData.steps) {
          await fetch(`/api/tasks/${newTask.id}/steps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(step),
          })
        }
        // 重新載入步驟並展開
        const steps = await fetchSteps(newTask.id)
        setStepsByTask(prev => ({ ...prev, [newTask.id]: steps }))
        setExpandedId(newTask.id)
      }
      // method === 'later' 則不做任何事
    } catch (e) {
      setError('建立任務失敗')
    }
  }

  // （移除批次覆寫既有步驟文案的按鈕與函式，以免誤觸覆寫使用者資料）

  function startEditStep(s: TaskStep) {
    setEditingStepId(s.id)
    setEditStepWhat(s.what)
    setEditStepResult(s.result)
  }

  function handleCancelEditStep() {
    setEditingStepId(null)
    setEditStepWhat('')
    setEditStepResult('')
  }

  async function handleSaveStep(taskId: string, s: TaskStep) {
    const what = editStepWhat.trim()
    const result = editStepResult.trim()
    if (!what || !result) {
      setError('請填寫 What 與 Result')
      return
    }
    try {
      const updated = await putStep(taskId, s.id, { what, result })
      setStepsByTask(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || []).map(x => x.id === s.id ? updated : x),
      }))
      handleCancelEditStep()
    } catch (e) {
      setError('儲存步驟失敗')
    }
  }

  async function handleToggleStepStatus(taskId: string, s: TaskStep) {
    const next: TaskStepStatus = s.status === 'done' ? 'pending' : 'done'
    try {
      const updated = await putStep(taskId, s.id, { status: next })
      setStepsByTask(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || []).map(x => x.id === s.id ? updated : x),
      }))
    } catch (e) {
      setError('更新步驟狀態失敗')
    }
  }

  async function handleDeleteStep(taskId: string, stepId: string) {
    const prev = stepsByTask
    setStepsByTask(p => ({
      ...p,
      [taskId]: (p[taskId] || []).filter(x => x.id !== stepId),
    }))
    try {
      const res = await fetch(`/api/tasks/${taskId}/steps/${stepId}`, { method: 'DELETE' })
      if (!res.ok) setStepsByTask(prev)
    } catch (e) {
      setStepsByTask(prev)
      setError('刪除步驟失敗')
    }
  }

  // ===== Records 處理函式 =====

  async function handleAddRecord(taskId: string) {
    const content = newRecordContent.trim()
    if (!content) {
      setError('請輸入紀錄內容')
      return
    }
    setError('')
    try {
      const res = await fetch(`/api/tasks/${taskId}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          stepId: newRecordStepId || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewRecordContent('')
        setNewRecordStepId('')
        setRecordsByTask(prev => ({
          ...prev,
          [taskId]: [data.record as TaskRecord, ...(prev[taskId] || [])],
        }))
      } else {
        setError(data.error || '新增紀錄失敗')
      }
    } catch (e) {
      setError('無法連線到伺服器')
    }
  }

  function startEditRecord(r: TaskRecord) {
    setEditingRecordId(r.id)
    setEditRecordContent(r.content)
    setEditRecordStepId(r.stepId || '')
  }

  function handleCancelEditRecord() {
    setEditingRecordId(null)
    setEditRecordContent('')
    setEditRecordStepId('')
  }

  async function handleSaveRecord(taskId: string, r: TaskRecord) {
    const content = editRecordContent.trim()
    if (!content) {
      setError('紀錄內容不可為空')
      return
    }
    try {
      const res = await fetch(`/api/tasks/${taskId}/records/${r.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          stepId: editRecordStepId || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setRecordsByTask(prev => ({
          ...prev,
          [taskId]: (prev[taskId] || []).map(x => x.id === r.id ? data.record : x),
        }))
        handleCancelEditRecord()
      } else {
        setError(data.error || '更新紀錄失敗')
      }
    } catch (e) {
      setError('無法連線到伺服器')
    }
  }

  async function handleDeleteRecord(taskId: string, recordId: string) {
    const prev = recordsByTask
    setRecordsByTask(p => ({
      ...p,
      [taskId]: (p[taskId] || []).filter(x => x.id !== recordId),
    }))
    try {
      const res = await fetch(`/api/tasks/${taskId}/records/${recordId}`, { method: 'DELETE' })
      if (!res.ok) setRecordsByTask(prev)
    } catch (e) {
      setRecordsByTask(prev)
      setError('刪除紀錄失敗')
    }
  }

  // ===== Evidence（成果展示）處理函式 =====

  function handleOpenEvidenceModal(taskId: string, stepId: string) {
    setCurrentStepForEvidence({ taskId, stepId })
    setShowEvidenceModal(true)
  }

  async function handleSubmitEvidence(data: {
    kind: 'link' | 'text'
    name: string
    url: string
    content: string
  }) {
    if (!currentStepForEvidence) return

    const { taskId, stepId } = currentStepForEvidence

    try {
      const res = await fetch(`/api/tasks/${taskId}/steps/${stepId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: data.kind,
          name: data.name,
          url: data.url || '',
          note: data.content || '',  // 文字內容存在 note 欄位
          size: 0,  // 簡化版不需要
        }),
      })

      if (res.ok) {
        // 重新載入步驟以更新 evidence
        const steps = await fetchSteps(taskId)
        setStepsByTask(prev => ({ ...prev, [taskId]: steps }))
      } else {
        const errorData = await res.json()
        setError(errorData.error || '新增成果失敗')
      }
    } catch (e) {
      setError('無法連線到伺服器')
    }
  }

  async function handleDeleteEvidence(taskId: string, stepId: string, evidenceId: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}/steps/${stepId}/evidence/${evidenceId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // 重新載入步驟以更新 evidence
        const steps = await fetchSteps(taskId)
        setStepsByTask(prev => ({ ...prev, [taskId]: steps }))
      } else {
        setError('刪除成果失敗')
      }
    } catch (e) {
      setError('無法連線到伺服器')
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800">任務管理</h1>
      <p className="mt-1 text-gray-500">快速新增、查看與完成任務</p>

      {/* 快速新增 */}
      <div className="mt-6">
        <button
          onClick={() => {
            setIsFirstDaily(false)
            setShowGuide(true)
          }}
          className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-white text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
        >
          ✨ 新增任務
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* 統計 */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-4">
        <Stat label="全部" value={stats.total} />
        <Stat label="待處理" value={stats.pending} />
        <Stat label="進行中" value={stats.inProgress} />
        <Stat label="完成率" value={`${stats.completionRate}%`} />
      </div>

      {/* 篩選與排序 */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600">狀態篩選</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">全部</option>
          <option value="pending">待處理</option>
          <option value="in_progress">進行中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>

        <span className="mx-2 h-5 w-px bg-gray-200" />
        <label className="text-sm text-gray-600">排序</label>
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as any)}
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="createdAt">建立時間</option>
          <option value="priority">優先級</option>
          <option value="status">狀態</option>
        </select>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as any)}
          className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="asc">升冪</option>
          <option value="desc">降冪</option>
        </select>
      </div>

      {/* 任務列表 */}
      <ul className="mt-6 space-y-3">
        {tasks.length === 0 && (
          <li className="rounded-md border bg-white p-4 text-gray-500 shadow-sm">尚無任務，先加入第一個任務吧！</li>
        )}
        {sortedTasks.map(task => (
          <li key={task.id} className="rounded-md border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleToggleStatus(task)}
                  className="h-5 w-5"
                />
                <div>
                  {editingId === task.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                      <select
                        value={editPriority}
                        onChange={e => setEditPriority(e.target.value as TaskPriority)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                      >
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high">高</option>
                        <option value="urgent">緊急</option>
                      </select>
                      <input
                        type="datetime-local"
                        value={editStartedAt}
                        onChange={e => setEditStartedAt(e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                      />
                      <input
                        type="datetime-local"
                        value={editDueDate}
                        onChange={e => setEditDueDate(e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleSaveEdit(task)}
                        className="rounded-md bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700"
                      >
                        儲存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded-md border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <p className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    優先級：{priorityLabel(task.priority)} · 建立於 {formatDate(task.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.startedAt ? formatDate(task.startedAt) : '未設定開始'} ~ {task.completedAt ? formatDate(task.completedAt) : (task.dueDate ? formatDate(task.dueDate) : '未設定結束')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={e => handleChangeStatus(task, e.target.value as TaskStatus)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                >
                  <option value="pending">待處理</option>
                  <option value="in_progress">進行中</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
                <button
                  onClick={() => handleStartEdit(task)}
                  className="rounded-md border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                  編輯
                </button>
                <span className={priorityBadgeClass(task.priority)}>{priorityLabel(task.priority)}</span>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="rounded-md border px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  刪除
                </button>
                <button
                  onClick={() => toggleExpand(task.id)}
                  className="rounded-md border px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50"
                >
                  {expandedId === task.id ? '收合' : '步驟'}
                </button>
              </div>
            </div>

            {expandedId === task.id && (
              <div className="mt-4 border-t pt-4">
                {/* 新增步驟 */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[180px]">
                    <input
                      value={newStepWhat}
                      onChange={e => setNewStepWhat(e.target.value)}
                      onFocus={() => setShowWhatHint(true)}
                      onBlur={() => setShowWhatHint(false)}
                      placeholder="What：想做的下一步是？"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    {showWhatHint && (
                      <div className="absolute left-0 top-full z-10 mt-1 w-[22rem] rounded-md border border-indigo-200 bg-indigo-50 p-2 text-xs text-indigo-900 shadow">
                        請用「動詞＋名詞」寫下步驟。例：整理資料、寄出報價、確認設計稿。
                      </div>
                    )}
                  </div>
                  <div className="relative flex-1 min-w-[220px]">
                    <input
                      value={newStepResult}
                      onChange={e => setNewStepResult(e.target.value)}
                      onFocus={() => setShowResultHint(true)}
                      onBlur={() => setShowResultHint(false)}
                      placeholder="Result：完成後希望看見什麼？"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    {showResultHint && (
                      <div className="absolute left-0 top-full z-10 mt-1 w-[26rem] rounded-md border border-indigo-200 bg-indigo-50 p-2 text-xs text-indigo-900 shadow">
                        用可驗收的描述寫下預期成果。例：完成首頁草稿、已寄出報價信。
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddStep(task.id)}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
                  >
                    新增步驟
                  </button>
                  <button
                    onClick={() => handleApplyThreeStepTemplate(task.id)}
                    className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    一鍵套用任務執行三步驟：起步/產出/驗收
                  </button>
                </div>

                {/* 步驟清單 */}
                <ol className="mt-3 space-y-2">
                  {(stepsByTask[task.id] || []).map((s, idx) => (
                    <li key={s.id} className="rounded-md border p-3 text-sm">
                      {editingStepId === s.id ? (
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                          <input
                            value={editStepWhat}
                            onChange={e => setEditStepWhat(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-2 py-1"
                            placeholder="What"
                          />
                          <input
                            value={editStepResult}
                            onChange={e => setEditStepResult(e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-2 py-1"
                            placeholder="Result"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveStep(task.id, s)} className="rounded-md bg-indigo-600 px-2 py-1 text-white">儲存</button>
                            <button onClick={handleCancelEditStep} className="rounded-md border px-2 py-1">取消</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-medium">{idx + 1}. {s.what}</p>
                              <p className="text-gray-600">→ {s.result}</p>
                              
                              {/* 成果展示 */}
                              {s.evidence && s.evidence.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <div className="text-xs font-medium text-gray-600">📎 成果展示 ({s.evidence.length})</div>
                                  {s.evidence.map((ev) => (
                                    <div key={ev.id} className="rounded-md bg-gray-50 p-2 text-xs">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-700">{ev.kind === 'link' ? '🔗' : '📝'} {ev.name}</div>
                                          {ev.url && (
                                            <a
                                              href={ev.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-indigo-600 hover:underline break-all"
                                              title={ev.url}
                                            >
                                              {ev.url.length > 40 ? ev.url.substring(0, 40) + '...' : ev.url}
                                            </a>
                                          )}
                                          {ev.note && (
                                            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{ev.note}</p>
                                          )}
                                        </div>
                                        <button
                                          onClick={() => handleDeleteEvidence(task.id, s.id, ev.id)}
                                          className="text-gray-400 hover:text-red-600"
                                        >
                                          刪除
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* 新增成果按鈕 */}
                              <button
                                onClick={() => handleOpenEvidenceModal(task.id, s.id)}
                                className="mt-2 text-xs text-indigo-600 hover:text-indigo-700"
                              >
                                + 新增成果
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{s.status}</span>
                              <button onClick={() => startEditStep(s)} className="rounded-md border px-2 py-1">編輯</button>
                              <button onClick={() => handleToggleStepStatus(task.id, s)} className="rounded-md border px-2 py-1 text-green-700 hover:bg-green-50">
                                {s.status === 'done' ? '還原' : '完成'}
                              </button>
                              <button onClick={() => handleDeleteStep(task.id, s.id)} className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-50">刪除</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                  {(!stepsByTask[task.id] || stepsByTask[task.id].length === 0) && (
                    <li className="rounded-md border p-3 text-sm text-gray-500">尚無步驟</li>
                  )}
                </ol>

                {/* 過程紀錄（Records） */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">📝 過程紀錄</h3>
                  
                  {/* 快速輸入 */}
                  <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <textarea
                      value={newRecordContent}
                      onChange={e => setNewRecordContent(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault()
                          handleAddRecord(task.id)
                        }
                      }}
                      placeholder="記錄現在的進度或想法... 例如：完成初稿、遇到問題、等待回覆..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                      rows={2}
                    />
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">關聯步驟</label>
                        <select
                          value={newRecordStepId}
                          onChange={e => setNewRecordStepId(e.target.value)}
                          className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="">無關聯</option>
                          {(stepsByTask[task.id] || []).map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              步驟 {idx + 1} - {s.what.substring(0, 15)}...
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleAddRecord(task.id)}
                        className="ml-auto rounded-md bg-indigo-600 px-4 py-1 text-xs text-white hover:bg-indigo-700"
                      >
                        提交紀錄
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">💡 按 Ctrl+Enter 可提交紀錄</p>
                  </div>

                  {/* 時間軸列表 */}
                  <div className="space-y-3">
                    {(recordsByTask[task.id] || []).map((r) => (
                      <div key={r.id} className="rounded-md border border-gray-200 bg-white p-3 text-sm hover:bg-gray-50">
                        {editingRecordId === r.id ? (
                          <div>
                            <textarea
                              value={editRecordContent}
                              onChange={e => setEditRecordContent(e.target.value)}
                              className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                              rows={2}
                            />
                            <div className="mb-2 flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-600">關聯步驟</label>
                                <select
                                  value={editRecordStepId}
                                  onChange={e => setEditRecordStepId(e.target.value)}
                                  className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                                >
                                  <option value="">無關聯</option>
                                  {(stepsByTask[task.id] || []).map((s, idx) => (
                                    <option key={s.id} value={s.id}>
                                      步驟 {idx + 1} - {s.what.substring(0, 15)}...
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveRecord(task.id, r)}
                                className="rounded-md bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                              >
                                儲存
                              </button>
                              <button
                                onClick={handleCancelEditRecord}
                                className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-700">
                                    ⏰ {new Date(r.createdAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-gray-800">{r.content}</p>
                                {r.stepId && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      🔗 {(() => {
                                        const step = (stepsByTask[task.id] || []).find(s => s.id === r.stepId)
                                        const idx = (stepsByTask[task.id] || []).findIndex(s => s.id === r.stepId)
                                        return step ? `步驟 ${idx + 1} - ${step.what.substring(0, 20)}...` : '步驟已刪除'
                                      })()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEditRecord(r)}
                                  className="text-xs text-gray-600 hover:text-indigo-600"
                                >
                                  編輯
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord(task.id, r.id)}
                                  className="text-xs text-gray-600 hover:text-red-600"
                                >
                                  刪除
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!recordsByTask[task.id] || recordsByTask[task.id].length === 0) && (
                      <div className="rounded-md border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                        💡 隨時記錄進度，幫助你回顧與改進
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* 引導模態 */}
      <TaskGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onComplete={handleGuideComplete}
        isFirstDaily={isFirstDaily}
      />

      {/* 成果展示模態 */}
      <EvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => {
          setShowEvidenceModal(false)
          setCurrentStepForEvidence(null)
        }}
        onSubmit={handleSubmitEvidence}
      />
    </main>
  )
}

function Stat({ label, value }: { label: string, value: number | string }) {
  return (
    <div className="rounded-md border p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-800">{value}</p>
    </div>
  )
}

function priorityLabel(p: TaskPriority) {
  switch (p) {
    case 'low': return '低'
    case 'medium': return '中'
    case 'high': return '高'
    case 'urgent': return '緊急'
  }
}

function priorityBadgeClass(p: TaskPriority) {
  const base = 'rounded-full px-2 py-0.5 text-xs font-medium'
  switch (p) {
    case 'low': return `${base} bg-gray-100 text-gray-700`
    case 'medium': return `${base} bg-blue-100 text-blue-700`
    case 'high': return `${base} bg-amber-100 text-amber-700`
    case 'urgent': return `${base} bg-red-100 text-red-700`
  }
}

function formatDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  return new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

// ===== Steps helpers =====
async function fetchSteps(taskId: string): Promise<TaskStep[]> {
  const res = await fetch(`/api/tasks/${taskId}/steps`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'load steps failed')
  return data.steps as TaskStep[]
}

// 更新步驟
async function putStep(taskId: string, stepId: string, payload: Partial<TaskStep>) {
  const res = await fetch(`/api/tasks/${taskId}/steps/${stepId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('update step failed')
  return (await res.json()).step as TaskStep
}

// ===== Records helpers =====
async function fetchRecords(taskId: string): Promise<TaskRecord[]> {
  const res = await fetch(`/api/tasks/${taskId}/records`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'load records failed')
  return data.records as TaskRecord[]
}


