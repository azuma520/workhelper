'use client'

import { useState, useEffect } from 'react'

type EvidenceKind = 'link' | 'text'

interface EvidenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    kind: EvidenceKind
    name: string
    url: string
    content: string
  }) => void
}

export default function EvidenceModal({ isOpen, onClose, onSubmit }: EvidenceModalProps) {
  const [kind, setKind] = useState<EvidenceKind>('link')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (isOpen) {
      setKind('link')
      setName('')
      setUrl('')
      setContent('')
    }
  }, [isOpen])

  const handleSubmit = () => {
    const trimmedName = name.trim()
    const trimmedUrl = url.trim()
    const trimmedContent = content.trim()

    // 驗證：名稱必填
    if (!trimmedName) {
      alert('請輸入名稱')
      return
    }

    // 驗證：URL 或內容至少填一個
    if (!trimmedUrl && !trimmedContent) {
      alert('請至少填寫連結或文字內容')
      return
    }

    onSubmit({
      kind,
      name: trimmedName,
      url: trimmedUrl,
      content: trimmedContent,
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-bold text-gray-800">📎 展示這一步的成果</h2>

        {/* 類型選擇 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-gray-600">類型</label>
          <div className="flex gap-2">
            <button
              onClick={() => setKind('link')}
              className={`flex-1 rounded-lg border py-2 text-sm transition-colors ${
                kind === 'link'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-medium'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🔗 連結
            </button>
            <button
              onClick={() => setKind('text')}
              className={`flex-1 rounded-lg border py-2 text-sm transition-colors ${
                kind === 'text'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-medium'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              📝 文字
            </button>
          </div>
        </div>

        {/* 名稱 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-gray-600">名稱</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：設計稿 v1、客戶回饋"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            autoFocus
          />
        </div>

        {/* 連結網址 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-gray-600">連結網址（選填）</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* 文字內容 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-gray-600">文字內容（選填）</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="例如：客戶說配色不錯，建議調整字體..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
            rows={3}
          />
        </div>

        <p className="mb-4 text-xs text-gray-500">💡 至少填寫連結或文字其中一項</p>

        {/* 按鈕 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  )
}

