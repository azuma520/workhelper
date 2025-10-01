'use client'

import { motion } from 'framer-motion'
import Counter from './Counter'

interface StatsCardProps {
  icon: string
  label: string
  value: number
  trend?: number
  color?: string
}

export default function StatsCard({
  icon,
  label,
  value,
  trend,
  color = 'from-blue-500 to-blue-700',
}: StatsCardProps) {
  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  const cardHover = {
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    y: -5,
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      whileHover={cardHover}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg`}
    >
      <motion.div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="mb-4 text-4xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          delay: 0.1,
        }}
      >
        {icon}
      </motion.div>

      <div className="mb-2">
        <Counter
          value={value}
          className="text-5xl font-bold"
          duration={1.5}
        />
      </div>

      <motion.div
        className="text-sm opacity-90"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {label}
      </motion.div>

      {trend !== undefined && (
        <motion.div
          className="mt-3 flex items-center gap-1 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            animate={{
              y: trend > 0 ? [-2, 0, -2] : [2, 0, 2],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
          >
            {trend > 0 ? '↑' : '↓'}
          </motion.span>
          <span className="font-medium">
            {Math.abs(trend)}%
          </span>
          <span className="opacity-75">
            vs 上週
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}