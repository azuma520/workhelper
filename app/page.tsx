'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* 大標題 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ✨ Framer Motion 測試
          </h1>
          <p className="text-xl text-gray-600">
            點擊按鈕看動畫效果
          </p>
        </motion.div>

        {/* 數字顯示 - 超大超明顯 */}
        <motion.div
          className="bg-white rounded-3xl p-12 shadow-2xl text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-9xl font-bold text-purple-600 mb-4"
          >
            {count}
          </motion.div>
          <p className="text-2xl text-gray-600 mb-8">次點擊</p>
          
          {/* 按鈕 */}
          <motion.button
            onClick={() => setCount(count + 1)}
            className="px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl font-bold rounded-2xl shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            點我！🎉
          </motion.button>
        </motion.div>

        {/* 測試卡片 - 帶 Hover 效果 */}
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)' 
              }}
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: 'linear'
                }}
              >
                {['🎨', '🚀', '⭐'][i - 1]}
              </motion.div>
              <p className="text-xl font-semibold text-gray-800">
                卡片 {i}
              </p>
              <p className="text-gray-500">
                移動滑鼠到這裡
              </p>
            </motion.div>
          ))}
        </div>

        {/* 說明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center"
        >
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            🎯 測試項目
          </h3>
          <ul className="text-left space-y-2 text-blue-800">
            <li>✓ 點擊按鈕 → 數字應該放大進入</li>
            <li>✓ Hover 下面的卡片 → 卡片應該浮起來</li>
            <li>✓ 圖標應該在持續旋轉</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}