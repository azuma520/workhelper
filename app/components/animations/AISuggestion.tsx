'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface AISuggestionProps {
  isVisible: boolean
  message: string
  onAccept?: () => void
  onDismiss?: () => void
}

/**
 * AI 建議彈出組件
 * 
 * 靈感來源：設計文件案例 4
 * 
 * 用途：
 * - AI 智能建議顯示
 * - 系統識別改進機會
 * 
 * 設計理念：
 * - CD3（創造力）+ CD7（驚喜）
 * - 「友善建議，不強迫」
 * - 「永遠有『跳過』選項」
 * - 隱性 PDCA - Act 階段
 */
export default function AISuggestion({
  isVisible,
  message,
  onAccept,
  onDismiss,
}: AISuggestionProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 max-w-md z-50"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          <motion.div
            className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {/* 圖標動畫 */}
            <motion.div
              className="text-4xl mb-3"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              💡
            </motion.div>

            {/* 標題 */}
            <motion.h3
              className="text-lg font-semibold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              發現小秘密
            </motion.h3>

            {/* AI 訊息 */}
            <motion.p
              className="text-sm mb-4 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>

            {/* 按鈕組 */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="flex-1 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onAccept}
              >
                試試看 ✨
              </motion.button>
              
              <motion.button
                className="px-4 py-2 text-white/80 hover:text-white rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onDismiss}
              >
                下次再說
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
