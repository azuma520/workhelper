'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Counter from '../components/animations/Counter'
import ProgressRing from '../components/animations/ProgressRing'
import TaskCompleteAnimation from '../components/animations/TaskCompleteAnimation'
import AISuggestion from '../components/animations/AISuggestion'
import TiltCard from '../components/animations/TiltCard'
import StatsCard from '../components/animations/StatsCard'

export default function AnimationsDemoPage() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [showAISuggestion, setShowAISuggestion] = useState(false)
  const [taskCount, setTaskCount] = useState(0)
  const [progress, setProgress] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        
        {/* 返回首頁 */}
        <Link href="/">
          <motion.div
            className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            whileHover={{ x: -5 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首頁
          </motion.div>
        </Link>

        {/* 標題 */}
        <motion.h1
          className="mb-8 text-5xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎨 Framer Motion 動畫示範
        </motion.h1>

        {/* Section 1: 數字計數器 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            1. 📊 數字滾動計數器
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Counter value={taskCount} className="text-6xl font-bold text-blue-600" />
              <span className="text-2xl text-gray-600">個任務完成</span>
            </div>
            <div className="flex gap-4">
              <motion.button
                onClick={() => setTaskCount(taskCount + 1)}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                增加
              </motion.button>
              <motion.button
                onClick={() => setTaskCount(0)}
                className="rounded-lg bg-gray-300 px-6 py-3 text-gray-700 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                重置
              </motion.button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              💡 數字會有滾動動畫，符合「數字要滾動（有過程感）」
            </p>
          </div>
        </motion.section>

        {/* Section 2: 進度環 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            2. ⭕ 圓形進度環
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <ProgressRing
                progress={progress}
                size={160}
                strokeWidth={12}
                label="完成度"
              />
            </div>
            <div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="mt-2 text-center text-sm text-gray-500">
                當前進度: {progress}%
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 3: 統計卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            3. 📈 統計數據卡片
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard
              icon="📋"
              label="本週完成任務"
              value={12}
              trend={15}
              color="from-blue-500 to-blue-700"
            />
            <StatsCard
              icon="🔥"
              label="連續記錄天數"
              value={5}
              trend={25}
              color="from-orange-500 to-red-600"
            />
            <StatsCard
              icon="⚡"
              label="效率提升"
              value={18}
              trend={-5}
              color="from-purple-500 to-purple-700"
            />
          </div>
        </motion.section>

        {/* Section 4: 3D 傾斜卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            4. 🎴 3D 傾斜卡片
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <TiltCard>
              <div className="rounded-xl bg-white p-6 shadow-xl">
                <h3 className="mb-2 text-xl font-semibold">郵件處理流程</h3>
                <p className="text-gray-600">執行 15 次</p>
                <p className="mt-4 text-sm text-gray-500">
                  平均耗時: 25 分鐘
                </p>
              </div>
            </TiltCard>
            <TiltCard>
              <div className="rounded-xl bg-white p-6 shadow-xl">
                <h3 className="mb-2 text-xl font-semibold">每日站會準備</h3>
                <p className="text-gray-600">執行 32 次</p>
                <p className="mt-4 text-sm text-gray-500">
                  平均耗時: 10 分鐘
                </p>
              </div>
            </TiltCard>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            💡 滑鼠移動時卡片會跟隨傾斜
          </p>
        </motion.section>

        {/* Section 5: 任務完成動畫 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            5. 🎉 任務完成慶祝
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <motion.button
              onClick={() => {
                setShowCelebration(true)
                setTimeout(() => setShowCelebration(false), 2500)
              }}
              className="rounded-lg bg-green-600 px-8 py-4 text-white text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              完成任務 ✓
            </motion.button>
            <p className="mt-4 text-sm text-gray-500">
              💡 點擊按鈕觸發全螢幕慶祝動畫
            </p>
          </div>
        </motion.section>

        {/* Section 6: AI 建議 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            6. 💡 AI 建議彈窗
          </h2>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <motion.button
              onClick={() => setShowAISuggestion(true)}
              className="rounded-lg bg-purple-600 px-8 py-4 text-white text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              顯示 AI 建議
            </motion.button>
            <p className="mt-4 text-sm text-gray-500">
              💡 模擬「發現小秘密」場景，右下角會彈出
            </p>
          </div>
        </motion.section>

        {/* 說明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6"
        >
          <h3 className="mb-3 text-lg font-semibold text-blue-900">
            📚 設計來源與理念
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ 所有組件都基於免費 Framer 資源</li>
            <li>✓ 符合 Octalysis 遊戲化框架</li>
            <li>✓ 實現隱性 PDCA 設計理念</li>
            <li>✓ 零壓力、引導式、情感化</li>
          </ul>
        </motion.div>
      </div>

      {/* 全域動畫元素 */}
      <TaskCompleteAnimation
        isVisible={showCelebration}
        message="太棒了！又完成一個任務 🎉"
      />

      <AISuggestion
        isVisible={showAISuggestion}
        message="您最近常做「整理郵件」，平均花費 28 分鐘。要不要把步驟記下來？下次可能更快哦~ ✨"
        onAccept={() => {
          console.log('用戶接受建議')
          setShowAISuggestion(false)
        }}
        onDismiss={() => {
          console.log('用戶跳過建議')
          setShowAISuggestion(false)
        }}
      />
    </div>
  )
}