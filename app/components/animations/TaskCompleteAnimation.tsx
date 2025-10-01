'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface TaskCompleteAnimationProps {
  isVisible: boolean
  message?: string
}

/**
 * 任務完成慶祝動畫
 * 
 * 用途：
 * - 完成任務時的即時反饋
 * - 微慶祝效果
 * 
 * 設計理念：
 * - CD2（成就感）：「完成任務打勾動畫（即時成就感）」
 * - 「微慶祝效果（任務完成動畫、里程碑提醒）」
 * - 「動畫要流暢（60fps）」
 * - 「顏色要正向（綠色、金色）」
 */
export default function TaskCompleteAnimation({ 
  isVisible, 
  message = '太棒了！' 
}: TaskCompleteAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 背景光暈 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-yellow-400/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 主要內容 */}
          <div className="relative">
            {/* 勾選圖標 */}
            <motion.div
              className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.svg
                className="w-12 h-12 text-white"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </motion.div>

            {/* 文字訊息 */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-2xl font-bold text-gray-800">{message}</p>
            </motion.div>

            {/* 粒子效果（慶祝紙屑） */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2
              const distance = 150
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    background: i % 2 === 0 ? '#fbbf24' : '#10b981',
                  }}
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0.5, 0],
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3 + i * 0.03,
                    ease: 'easeOut',
                  }}
                />
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
