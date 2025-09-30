'use client';

import { useState } from 'react';

export default function TopBar() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      // TODO: 實際的新增邏輯
      console.log('Quick add:', quickInput);
      setQuickInput('');
      setShowQuickAdd(false);
      // 顯示成功提示
    }
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-30">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Page Title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">儀表板</h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Add Button - 最突出 */}
            <button
              onClick={() => setShowQuickAdd(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>快速記錄</span>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-white/20 rounded">⌘K</kbd>
            </button>

            {/* Search */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">快速記錄</h3>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickAdd} className="p-6">
              <textarea
                autoFocus
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="今天做了什麼？按 Enter 快速記錄..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900"
                rows={3}
              />

              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  📝 新增任務
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                >
                  📋 建立 SOP
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                >
                  ⏱ 開始專注
                </button>
              </div>

              {/* Submit */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(false)}
                  className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  記錄
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
