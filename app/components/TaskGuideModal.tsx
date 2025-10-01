'use client'

import { useState, useEffect } from 'react'
import { TaskPriority } from '../types/task'

type GuideStep = 'welcome' | 'input-task' | 'choose-method' | 'template-applied' | 'manual-step'

interface TaskGuideModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (taskData: {
    title: string
    priority: TaskPriority
    method: 'template' | 'manual' | 'later'
    steps?: Array<{ what: string; result: string }>
  }) => void
  isFirstDaily?: boolean
}

export default function TaskGuideModal({ isOpen, onClose, onComplete, isFirstDaily = false }: TaskGuideModalProps) {
  const [step, setStep] = useState<GuideStep>('welcome')
  const [taskTitle, setTaskTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [manualSteps, setManualSteps] = useState<Array<{ what: string; result: string }>>([
    { what: '', result: '' }
  ])
  const [focusedStepField, setFocusedStepField] = useState<{ index: number; field: 'what' | 'result' } | null>(null)

  useEffect(() => {
    if (isOpen) {
      setStep('welcome')
      setTaskTitle('')
      setPriority('medium')
      setManualSteps([{ what: '', result: '' }])
    }
  }, [isOpen])

  // 鍵盤支援
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape' && step === 'welcome') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, step])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '☀️ 早安'
    if (hour < 18) return '👋 午安'
    return '🌙 晚安'
  }

  const handleSkip = () => {
    onClose()
  }

  const handleStartPlanning = () => {
    setStep('input-task')
  }

  const handleTaskInputNext = () => {
    if (!taskTitle.trim()) return
    setStep('choose-method')
  }

  const handleChooseTemplate = () => {
    setStep('template-applied')
  }

  const handleChooseManual = () => {
    setStep('manual-step')
  }

  const handleChooseLater = () => {
    onComplete({
      title: taskTitle,
      priority,
      method: 'later'
    })
  }

  const handleTemplateComplete = () => {
    onComplete({
      title: taskTitle,
      priority,
      method: 'template'
    })
  }

  const handleAddManualStep = () => {
    setManualSteps([...manualSteps, { what: '', result: '' }])
  }

  const handleManualStepChange = (index: number, field: 'what' | 'result', value: string) => {
    const newSteps = [...manualSteps]
    newSteps[index][field] = value
    setManualSteps(newSteps)
  }

  const handleRemoveManualStep = (index: number) => {
    if (manualSteps.length <= 1) return  // 至少保留一個
    const newSteps = manualSteps.filter((_, i) => i !== index)
    setManualSteps(newSteps)
  }

  const handleManualComplete = () => {
    const validSteps = manualSteps.filter(s => s.what.trim() && s.result.trim())
    onComplete({
      title: taskTitle,
      priority,
      method: 'manual',
      steps: validSteps.length > 0 ? validSteps : undefined
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* 進度指示 */}
        <div className="mb-6 flex justify-center gap-2">
          <div className={`h-2 w-2 rounded-full transition-colors ${step === 'welcome' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
          <div className={`h-2 w-2 rounded-full transition-colors ${step === 'input-task' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
          <div className={`h-2 w-2 rounded-full transition-colors ${step === 'choose-method' || step === 'template-applied' || step === 'manual-step' ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        </div>

        {/* 步驟 1: 歡迎 */}
        {step === 'welcome' && (
          <div className="text-center">
            <div className="mb-4 text-4xl">{getGreeting()}</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              {isFirstDaily ? '準備好開始今天的工作了嗎？' : '來規劃一個新任務吧！'}
            </h2>
            <p className="mb-8 text-gray-600">
              讓我幫你快速規劃{isFirstDaily ? '今天的第一個任務' : '這個任務'}～
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleStartPlanning}
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                開始規劃 →
              </button>
              <button
                onClick={handleSkip}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                稍後再說
              </button>
            </div>
          </div>
        )}

        {/* 步驟 2: 輸入任務名稱 */}
        {step === 'input-task' && (
          <div>
            <div className="mb-6 text-center">
              <div className="mb-3 text-4xl">📝</div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">
                請用動詞+名詞的句型記下你的任務
              </h2>
            </div>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTaskInputNext()}
              placeholder={isFirstDaily ? '例如：整理今天的報告、回覆客戶信件、準備會議資料' : '例如：完成提案簡報、整理資料、寄出報價單'}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">💡 用簡單幾個字描述就好，不用想太多</p>

            <div className="mt-6">
              <label className="mb-2 block text-sm text-gray-600">優先級（選填）</label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`rounded-lg border py-2 text-sm transition-colors ${
                      priority === p
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-medium'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p === 'low' ? '低' : p === 'medium' ? '中' : p === 'high' ? '高' : '緊急'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep('welcome')}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← 上一步
              </button>
              <button
                onClick={handleTaskInputNext}
                disabled={!taskTitle.trim()}
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* 步驟 3: 選擇規劃方式 */}
        {step === 'choose-method' && (
          <div>
            <div className="mb-6 text-center">
              <div className="mb-3 text-4xl">✨</div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">要現在規劃執行步驟嗎？</h2>
              <p className="text-sm text-gray-600">規劃步驟能幫助你更有條理地完成任務</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleChooseTemplate}
                className="w-full rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4 text-left hover:border-indigo-300 hover:bg-indigo-100 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 group-hover:text-indigo-700">一鍵套用三步模板</div>
                    <div className="mt-1 text-sm text-gray-600">起步 → 產出 → 驗收（推薦新手）</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleChooseManual}
                className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✏️</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">我想自己寫步驟</div>
                    <div className="mt-1 text-sm text-gray-600">適合已經有想法的任務</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleChooseLater}
                className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🏃</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">先開始做，邊做邊記</div>
                    <div className="mt-1 text-sm text-gray-600">隨時可以回來補充步驟</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setStep('input-task')}
                className="w-full rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← 上一步
              </button>
            </div>
          </div>
        )}

        {/* 步驟 4a: 模板已套用 */}
        {step === 'template-applied' && (
          <div>
            <div className="mb-6 text-center">
              <div className="mb-3 text-4xl">🎉</div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">太棒了！已經幫你建好三步驟</h2>
            </div>

            <div className="space-y-3 rounded-lg bg-indigo-50 p-4">
              <div className="flex gap-3">
                <div className="font-semibold text-indigo-600">1️⃣</div>
                <div>
                  <div className="font-medium text-gray-800">先把前置作業準備好</div>
                  <div className="text-sm text-gray-600">→ 素材/需求/權限已就緒，可以開始動工</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-semibold text-indigo-600">2️⃣</div>
                <div>
                  <div className="font-medium text-gray-800">先做出一個可看的版本</div>
                  <div className="text-sm text-gray-600">→ 有一個可以給人看/試的草稿或截圖</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-semibold text-indigo-600">3️⃣</div>
                <div>
                  <div className="font-medium text-gray-800">檢查一下，能交出去就交</div>
                  <div className="text-sm text-gray-600">→ 用小清單確認OK；要修的開成待修項</div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              💡 建立後你可以隨時修改這些步驟喔
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep('choose-method')}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← 重新選擇
              </button>
              <button
                onClick={handleTemplateComplete}
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                完成規劃 🎯
              </button>
            </div>
          </div>
        )}

        {/* 步驟 4b: 手動輸入步驟 */}
        {step === 'manual-step' && (
          <div>
            <div className="mb-6 text-center">
              <div className="mb-3 text-4xl">✍️</div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">寫下你的執行步驟</h2>
              <p className="text-sm text-gray-600">至少寫一步就好，其他可以邊做邊補</p>
            </div>

            <div className="space-y-4 pb-20">
              {manualSteps.map((step, idx) => {
                // 判斷是否為最後兩個步驟（提示框向上顯示）
                const isNearBottom = idx >= manualSteps.length - 2
                
                return (
                  <div key={idx} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold text-gray-700">步驟 {idx + 1}</div>
                      {manualSteps.length > 1 && (
                        <button
                          onClick={() => handleRemoveManualStep(idx)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="刪除此步驟"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={step.what}
                        onChange={(e) => handleManualStepChange(idx, 'what', e.target.value)}
                        onFocus={() => setFocusedStepField({ index: idx, field: 'what' })}
                        onBlur={() => setFocusedStepField(null)}
                        placeholder="要做什麼？"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                      {focusedStepField?.index === idx && focusedStepField?.field === 'what' && (
                        <div className={`absolute left-0 z-10 w-[22rem] rounded-md border border-indigo-200 bg-indigo-50 p-2 text-xs text-indigo-900 shadow ${
                          isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                        }`}>
                          請用動詞＋名詞寫下步驟。例：整理資料、寄出報價、確認設計稿。
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={step.result}
                        onChange={(e) => handleManualStepChange(idx, 'result', e.target.value)}
                        onFocus={() => setFocusedStepField({ index: idx, field: 'result' })}
                        onBlur={() => setFocusedStepField(null)}
                        placeholder="希望獲得什麼成果？"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                      {focusedStepField?.index === idx && focusedStepField?.field === 'result' && (
                        <div className={`absolute left-0 z-10 w-[26rem] rounded-md border border-indigo-200 bg-indigo-50 p-2 text-xs text-indigo-900 shadow ${
                          isNearBottom ? 'bottom-full mb-1' : 'top-full mt-1'
                        }`}>
                          用可驗收的描述寫下預期成果。例：完成首頁草稿、已寄出報價信。
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={handleAddManualStep}
              className="mt-4 w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              + 再加一步
            </button>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep('choose-method')}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← 上一步
              </button>
              <button
                onClick={handleManualComplete}
                className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                完成規劃 🎯
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


