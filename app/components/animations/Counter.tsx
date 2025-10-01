'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface CounterProps {
  value: number
  duration?: number
  className?: string
}

/**
 * 數字滾動計數器組件
 * 
 * 用途：
 * - 「本週完成 12 任務」數字動畫
 * - 連續記錄天數顯示
 * - 任何需要數字滾動效果的地方
 * 
 * 設計理念：
 * 符合設計文件的「數字要滾動（有過程感）」
 */
export default function Counter({ value, duration = 2, className = '' }: CounterProps) {
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
  })

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {display}
    </motion.span>
  )
}
