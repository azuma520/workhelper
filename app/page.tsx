'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [quickNote, setQuickNote] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, title: '完成週報整理', completed: false },
    { id: 2, title: '團隊會議準備', completed: false },
    { id: 3, title: '回覆客戶郵件', completed: true },
    { id: 4, title: '更新專案文件', completed: false },
  ]);

  const handleQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickNote.trim()) {
      console.log('Quick note:', quickNote);
      setQuickNote('');
      // TODO: 顯示成功動畫
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <main className="min-h-screen bg-gray-50 pl-64 pt-16">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">🌅 早安！</h2>
          <p className="text-gray-600">今天想完成什麼？讓我們一起開始高效的一天</p>
        </div>

        {/* Quick Record Area - 最突出的位置 */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-indigo-200 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">📝 快速記錄</h3>
              <p className="text-sm text-gray-600">隨時記錄您的工作進展，一行搞定</p>
            </div>
          </div>

          <form onSubmit={handleQuickNote}>
            <input
              type="text"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="今天做了什麼？按 Enter 快速記錄..."
              className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
              autoFocus
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition-colors border border-indigo-200"
              >
                + 新增任務
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors border border-purple-200"
              >
                + 建立 SOP
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors border border-green-200"
              >
                ⏱ 開始專注
              </button>
            </div>
          </form>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Tasks - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">✅ 今日待辦</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  查看全部
                </button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 group-hover:border-indigo-500'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`flex-1 font-medium ${
                        task.completed ? 'text-green-700 line-through' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.completed && <span className="text-green-600 text-sm">🎉</span>}
                    {!task.completed && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                          開始
                        </button>
                        <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                          記錄
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl font-medium transition-colors border-2 border-dashed border-gray-200">
                + 快速新增待辦...
              </button>
            </div>
          </div>

          {/* Stats - 1/3 width */}
          <div className="space-y-4">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +12% ↗
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">3/8</div>
              <div className="text-sm text-gray-600 mb-3">今日完成</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all" style={{width: '37.5%'}}></div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  目標達成
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">2.5h</div>
              <div className="text-sm text-gray-600">專注時間</div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  本週
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">87%</div>
              <div className="text-sm text-gray-600">效率指數</div>
            </div>
          </div>
        </div>

        {/* AI Suggestions & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Suggestions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">💡 智能建議</h3>
                <p className="text-sm text-gray-600">根據您的工作模式提供建議</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-700 mb-3">
                  您已經第 3 次執行「整理郵件」了，要建立 SOP 嗎？
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    建立 SOP
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    下次再說
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-700 mb-3">
                  距離上次記錄已經 2 小時了，有新進展嗎？
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  快速記錄
                </button>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">🎯 今日成就</h3>
                <p className="text-sm text-gray-600">繼續保持，您做得很棒！</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-purple-200">
                <span className="text-2xl">✨</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">完成 3 個任務</p>
                  <p className="text-xs text-gray-500">今天效率很高！</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-purple-200">
                <span className="text-2xl">🔥</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">連續記錄 5 天</p>
                  <p className="text-xs text-gray-500">堅持就是勝利！</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-purple-200">
                <span className="text-2xl">⚡</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">專注時間達標</p>
                  <p className="text-xs text-gray-500">專注力 MAX！</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}