# 🎬 Framer Motion 整合指南

> 如何將 Framer 設計轉換為 Next.js + Framer Motion 實現
> 日期：2025-09-30

---

## 📋 目錄

- [什麼是 Framer Motion](#什麼是-framer-motion)
- [安裝與設定](#安裝與設定)
- [核心概念](#核心概念)
- [從 Framer 到 Framer Motion](#從-framer-到-framer-motion)
- [實際案例](#實際案例)
- [最佳實踐](#最佳實踐)

---

## 🎯 什麼是 Framer Motion

### **定義**
```
Framer Motion 是一個用於 React 的動畫庫
由 Framer 團隊開發，專為 React/Next.js 設計

關鍵特點:
✓ 聲明式 API（簡單直觀）
✓ 手勢支持（拖拽、hover、tap）
✓ 佈局動畫（自動處理）
✓ SVG 動畫支持
✓ 優秀的性能（硬體加速）
✓ TypeScript 支持
```

### **Framer vs Framer Motion**
```
Framer (設計工具):
- 視覺化設計界面
- 無代碼原型製作
- 設計與測試動畫
- 導出設計規範

Framer Motion (代碼庫):
- React 動畫庫
- 需要寫代碼
- 實現動畫效果
- 在真實應用中使用

關係:
Framer 設計 → 參數導出 → Framer Motion 實現
```

---

## 📦 安裝與設定

### **Step 1: 安裝 Framer Motion**

```bash
# 在您的 sop-app 專案中
npm install framer-motion
```

### **Step 2: 驗證安裝**

創建測試組件確認安裝成功：

```typescript
// app/components/TestMotion.tsx
'use client'

import { motion } from 'framer-motion'

export default function TestMotion() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      ✅ Framer Motion 已成功安裝！
    </motion.div>
  )
}
```

### **Step 3: 在頁面中測試**

```typescript
// app/page.tsx
import TestMotion from './components/TestMotion'

export default function Home() {
  return (
    <div>
      <TestMotion />
    </div>
  )
}
```

---

## 🎨 核心概念

### **1. motion 組件**

```typescript
import { motion } from 'framer-motion'

// 任何 HTML 元素都可以變成 motion 組件
<motion.div>      // <div> 的動畫版本
<motion.button>   // <button> 的動畫版本
<motion.span>     // <span> 的動畫版本
```

### **2. 三大核心屬性**

#### **initial - 初始狀態**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
>
  // 元素開始時是透明的，且向下偏移 20px
```

#### **animate - 動畫到的狀態**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  // 元素會淡入並移動到原位
```

#### **transition - 動畫如何執行**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ 
    duration: 0.5,    // 持續 0.5 秒
    ease: "easeOut"   // 緩動函數
  }}
>
```

### **3. 互動動畫**

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}    // hover 時放大
  whileTap={{ scale: 0.95 }}      // 點擊時縮小
  transition={{ type: "spring" }}  // 彈簧效果
>
  點擊我
</motion.button>
```

### **4. Variants（變體系統）**

```typescript
const buttonVariants = {
  idle: { 
    scale: 1, 
    backgroundColor: "#3498db" 
  },
  hover: { 
    scale: 1.05, 
    backgroundColor: "#2980b9" 
  },
  tap: { 
    scale: 0.95 
  }
}

<motion.button
  variants={buttonVariants}
  initial="idle"
  whileHover="hover"
  whileTap="tap"
>
  按鈕
</motion.button>
```

---

## 🔄 從 Framer 到 Framer Motion

### **轉換流程**

```
Framer 設計階段:
1. 在 Framer 設計動畫
2. 測試互動效果
3. 記錄參數

↓

參數記錄:
□ Duration（持續時間）
□ Easing（緩動函數）
□ Transform 屬性（位移、縮放、旋轉）
□ Color 變化
□ Opacity 變化

↓

Framer Motion 實現:
1. 將參數轉為代碼
2. 在 Next.js 組件中實現
3. 調整細節
```

### **Framer 參數對照表**

| Framer 設定 | Framer Motion 代碼 |
|-------------|-------------------|
| Duration: 0.3s | `duration: 0.3` |
| Spring (Stiffness: 300) | `type: "spring", stiffness: 300` |
| Ease Out | `ease: "easeOut"` |
| Scale: 1.05 | `scale: 1.05` |
| Opacity: 0 → 1 | `opacity: 0` → `opacity: 1` |
| Y: 20 → 0 | `y: 20` → `y: 0` |

### **常見緩動函數對照**

```typescript
// Framer 中的緩動 → Framer Motion
"Linear"        → ease: "linear"
"Ease In"       → ease: "easeIn"
"Ease Out"      → ease: "easeOut"
"Ease In Out"   → ease: "easeInOut"
"Spring"        → type: "spring"
"Bounce"        → type: "spring", bounce: 0.5
```

---

## 💼 實際案例：從設計到代碼

### **案例 1: 任務完成動畫**

#### **在 Framer 設計**
```
組件: TaskCard
Variants:
- pending (灰色，正常大小)
- completed (綠色，微縮放，勾選動畫)

Interaction:
Click → 切換到 completed variant

動畫參數:
- Duration: 0.4s
- Easing: Spring (Stiffness: 300, Damping: 20)
- Scale: 1 → 1.02 → 1
- Background: gray → green
```

#### **Framer Motion 實現**

```typescript
// app/components/TaskCard.tsx
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface TaskCardProps {
  title: string
  onComplete?: () => void
}

export default function TaskCard({ title, onComplete }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(false)

  const handleClick = () => {
    setIsCompleted(true)
    onComplete?.()
  }

  return (
    <motion.div
      className="p-4 rounded-lg cursor-pointer"
      onClick={handleClick}
      animate={{
        backgroundColor: isCompleted ? '#10b981' : '#6b7280',
        scale: isCompleted ? [1, 1.02, 1] : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.4,
      }}
    >
      <div className="flex items-center gap-3">
        {/* 勾選動畫 */}
        <motion.div
          className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center"
          initial={false}
          animate={{
            scale: isCompleted ? [0, 1.2, 1] : 1,
          }}
        >
          {isCompleted && (
            <motion.svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="white"
                strokeWidth="3"
              />
            </motion.svg>
          )}
        </motion.div>
        <span className="text-white">{title}</span>
      </div>
    </motion.div>
  )
}
```

---

### **案例 2: 數字滾動計數器**

#### **在 Framer 設計**
```
組件: Counter
效果: 數字從 0 滾動到目標值

動畫參數:
- Duration: 1s
- Easing: Ease Out
- 數字變化: 0 → 目標值
```

#### **Framer Motion 實現**

```typescript
// app/components/Counter.tsx
'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface CounterProps {
  value: number
  duration?: number
}

export default function Counter({ value, duration = 1 }: CounterProps) {
  const spring = useSpring(0, { 
    stiffness: 100, 
    damping: 30,
    duration: duration 
  })
  
  const display = useTransform(spring, (current) =>
    Math.round(current)
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span className="text-4xl font-bold">
      {display}
    </motion.span>
  )
}

// 使用範例
<Counter value={12} />  // 從 0 滾動到 12
```

---

### **案例 3: 進度環（根據 ProgressCard）**

#### **在 Framer 設計**
```
組件: ProgressCard
效果: 圓形進度環填充動畫

動畫參數:
- Duration: 1s
- Easing: Ease In Out
- Progress: 0% → 目標百分比
```

#### **Framer Motion 實現**

```typescript
// app/components/ProgressRing.tsx
'use client'

import { motion } from 'framer-motion'

interface ProgressRingProps {
  progress: number  // 0-100
  size?: number
  strokeWidth?: number
}

export default function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* 背景環 */}
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 進度環 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {/* 百分比文字 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress}%
        </motion.span>
      </div>
    </div>
  )
}
```

---

### **案例 4: 卡片 Hover 效果（根據 Tilt Card）**

#### **在 Framer 設計**
```
組件: TiltCard
效果: 滑鼠 hover 時 3D 傾斜

動畫參數:
- Duration: 0.3s
- Easing: Ease Out
- Rotate: 跟隨滑鼠位置
```

#### **Framer Motion 實現**

```typescript
// app/components/TiltCard.tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { MouseEvent } from 'react'

interface TiltCardProps {
  children: React.ReactNode
}

export default function TiltCard({ children }: TiltCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="rounded-xl bg-white p-6 shadow-lg"
    >
      {children}
    </motion.div>
  )
}
```

---

## 🎯 針對我們專案的核心組件

### **1. 任務完成慶祝動畫**

根據設計文件：
> 「完成任務打勾動畫（即時成就感）」
> 「微慶祝效果（任務完成動畫）」

```typescript
// app/components/TaskCompleteAnimation.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function TaskCompleteAnimation() {
  const [isComplete, setIsComplete] = useState(false)

  return (
    <div className="relative">
      <motion.button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        onClick={() => setIsComplete(!isComplete)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        完成任務
      </motion.button>

      {/* 慶祝動畫 */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {/* 勾選圖標 */}
            <motion.div
              className="text-6xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                delay: 0.1 
              }}
            >
              ✓
            </motion.div>
            
            {/* 粒子效果 */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: Math.cos((i / 12) * Math.PI * 2) * 100,
                  y: Math.sin((i / 12) * Math.PI * 2) * 100,
                }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

### **2. 數據滾動顯示**

根據設計文件：
> 「數字要滾動（有過程感）」
> 「『本週完成 12 任務』」

```typescript
// app/components/StatsDisplay.tsx
'use client'

import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

interface StatsDisplayProps {
  label: string
  value: number
  duration?: number
}

export default function StatsDisplay({ 
  label, 
  value, 
  duration = 2 
}: StatsDisplayProps) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  })
  
  const display = useTransform(springValue, (latest) =>
    Math.round(latest)
  )

  useEffect(() => {
    motionValue.set(value)
  }, [motionValue, value])

  return (
    <motion.div
      className="text-center p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="text-5xl font-bold text-white mb-2">
        {display}
      </motion.div>
      <div className="text-blue-200">{label}</div>
    </motion.div>
  )
}

// 使用範例
<StatsDisplay label="本週完成任務" value={12} />
```

---

### **3. SOP 卡片列表動畫**

根據設計文件：
> 「SOP 列表展示」
> 「卡片設計：數據故事化呈現」

```typescript
// app/components/SOPCardList.tsx
'use client'

import { motion } from 'framer-motion'

interface SOPCard {
  id: string
  title: string
  executions: number
}

interface SOPCardListProps {
  sops: SOPCard[]
}

export default function SOPCardList({ sops }: SOPCardListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 錯開 0.1 秒
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sops.map((sop) => (
        <motion.div
          key={sop.id}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.03,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}
          className="bg-white rounded-xl p-6 cursor-pointer"
        >
          <h3 className="text-xl font-semibold mb-2">{sop.title}</h3>
          <p className="text-gray-600">執行 {sop.executions} 次</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

### **4. AI 建議出現動畫**

根據設計文件：
> 「AI 給建議但不強制」
> 「💡 發現小秘密」

```typescript
// app/components/AISuggestion.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface AISuggestionProps {
  message: string
  onAccept?: () => void
  onDismiss?: () => void
}

export default function AISuggestion({ 
  message, 
  onAccept, 
  onDismiss 
}: AISuggestionProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 max-w-md"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          {/* 圖標動畫 */}
          <motion.div
            className="text-3xl mb-3"
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
          
          <h3 className="text-lg font-semibold mb-2">發現小秘密</h3>
          
          {/* 打字機效果 */}
          <motion.p
            className="text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
          
          {/* 按鈕組 */}
          <div className="flex gap-2">
            <motion.button
              className="flex-1 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onAccept?.()
                setIsVisible(false)
              }}
            >
              試試看
            </motion.button>
            <motion.button
              className="px-4 py-2 text-white/80 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onDismiss?.()
                setIsVisible(false)
              }}
            >
              下次再說
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
```

---

### **5. 頁面載入動畫**

```typescript
// app/components/PageTransition.tsx
'use client'

import { motion } from 'framer-motion'

export default function PageTransition({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
```

---

## 🎨 設計 Tokens 定義

基於您的設計文件和 Framer 資源建立：

```typescript
// app/styles/designTokens.ts

export const colors = {
  // 深藍漸變主題
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... 根據 Framer 模板調整
    600: '#2563eb',  // 主要藍色
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // 金色點綴
  accent: {
    400: '#fbbf24',  // 金色
    500: '#f59e0b',
  },
  // 成就系統顏色
  success: '#10b981',  // 綠色
  warning: '#f59e0b',  // 橙色
}

export const animations = {
  // 從 Framer 學到的動畫參數
  durations: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    celebration: 0.8,
  },
  
  easings: {
    easeOut: [0.4, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.6, 1],
    spring: { type: 'spring', stiffness: 300, damping: 25 },
  },
  
  // 常用動畫變體
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
}

export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
}
```

---

## 🔧 整合步驟

### **Step 1: 安裝依賴**

```bash
npm install framer-motion
```

### **Step 2: 創建動畫組件庫**

```bash
# 建立組件目錄結構
app/
  components/
    animations/
      TaskCompleteAnimation.tsx
      Counter.tsx
      ProgressRing.tsx
      TiltCard.tsx
      AISuggestion.tsx
      PageTransition.tsx
    ui/
      Button.tsx
      Card.tsx
      ...existing components
```

### **Step 3: 建立共用動畫配置**

```typescript
// app/lib/animations.ts
export const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: springConfig,
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const celebrationAnimation = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: [0, 1.2, 1], 
    rotate: 0,
  },
  transition: {
    duration: 0.6,
    ease: 'easeOut',
  },
}
```

### **Step 4: 在現有組件中應用**

```typescript
// app/components/SOPList.tsx
'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export default function SOPList({ sops }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-4"
    >
      {sops.map((sop) => (
        <motion.div
          key={sop.id}
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h3>{sop.title}</h3>
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

## 📊 Framer 設計參數記錄模板

使用這個模板記錄從 Framer 學到的設計：

```markdown
## [組件名稱]

### 來源
- Framer 模板/組件: [名稱]
- URL: [連結]
- 研究日期: [日期]

### 視覺設計
- **背景色**: #[顏色]
- **文字色**: #[顏色]
- **圓角**: [數值]px
- **陰影**: [參數]
- **間距**: [數值]px

### 動畫參數
- **Duration**: [秒數]s
- **Easing**: [類型]
- **Delay**: [秒數]s
- **Transform**: 
  - Scale: [數值]
  - Translate: x[數值], y[數值]
  - Rotate: [角度]deg

### Hover 狀態
- **Scale**: [數值]
- **顏色變化**: [before] → [after]
- **陰影變化**: [參數]

### Framer Motion 實現

```typescript
// 代碼實現
const variants = {
  initial: {},
  animate: {},
  hover: {},
}
```

### 使用場景
- [ ] 任務管理
- [ ] SOP 展示
- [ ] 數據視覺化
- [ ] 其他: _____
```

---

## 🎯 優先實現清單

### **Week 1: 基礎動畫**
```
□ 安裝 Framer Motion
□ 建立 Counter 組件
□ 建立 ProgressRing 組件
□ 測試基本動畫效果
```

### **Week 2: 互動效果**
```
□ 實現 TaskCompleteAnimation
□ 實現卡片 Hover 效果
□ 建立頁面轉場動畫
□ 整合到現有頁面
```

### **Week 3: 進階特效**
```
□ 實現 AISuggestion 組件
□ 建立 Stagger 動畫（錯開效果）
□ 優化動畫性能
□ 調整細節參數
```

---

## 🎓 學習資源

### **官方文檔**
```
□ Framer Motion 官方文檔
  → https://www.framer.com/motion/

□ Framer Motion API 參考
  → https://www.framer.com/motion/component/

□ Framer Motion 範例
  → https://www.framer.com/motion/examples/
```

### **影片教學**
```
□ "Atomic Animation Technique"
  → https://www.youtube.com/watch?v=vX686jF715U
  → 22 分鐘，必看！

□ Framer Motion 官方教學
  → https://www.youtube.com/c/Framer
```

### **文章教學**
```
□ "How to Create Micro-Interactions in Framer"
  → https://framer.university/blog/how-to-create-micro-interactions-in-framer

□ Framer Motion 入門指南
  → 查看官方文檔
```

---

## 🛠 實用工具

### **Framer Motion 開發工具**
```typescript
// app/components/dev/MotionDevTools.tsx
'use client'

import { LazyMotion, domAnimation, m } from 'framer-motion'

// 使用 LazyMotion 減少打包體積
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  )
}

// 在 layout.tsx 中包裹
```

### **動畫除錯**
```typescript
// 開發時查看動畫狀態
<motion.div
  animate={{ x: 100 }}
  onAnimationStart={() => console.log('動畫開始')}
  onAnimationComplete={() => console.log('動畫完成')}
/>
```

---

## 📈 效能優化

### **最佳實踐**
```typescript
// ✅ 好的做法
<motion.div
  animate={{ opacity: 1, scale: 1 }}  // 使用 transform 屬性
  transition={{ duration: 0.3 }}
/>

// ❌ 避免的做法
<motion.div
  animate={{ width: '100%', height: '100%' }}  // 避免動畫 width/height
/>

// ✅ 優化版本
<motion.div
  animate={{ scaleX: 1, scaleY: 1 }}  // 用 scale 代替
/>
```

### **硬體加速屬性（最快）**
```
優先使用這些屬性:
✓ opacity
✓ transform (x, y, scale, rotate)

避免動畫這些:
❌ width, height
❌ top, left, right, bottom
❌ padding, margin
```

---

## 🎯 針對 Octalysis 八角框架的動畫設計

### **CD2: 成就與進步**
```typescript
// 成就解鎖動畫
const achievementVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: { type: 'spring', stiffness: 200 }
  },
}

<motion.div variants={achievementVariants}>
  🏆 新成就解鎖！
</motion.div>
```

### **CD3: 創造力與反饋**
```typescript
// 即時編輯反饋
<motion.div
  animate={{ 
    borderColor: hasChanges ? '#3b82f6' : '#e5e7eb' 
  }}
  transition={{ duration: 0.2 }}
>
  SOP 編輯器
</motion.div>
```

### **CD7: 驚喜與好奇**
```typescript
// 隨機鼓勵訊息動畫
const surpriseVariants = {
  initial: { 
    opacity: 0, 
    scale: 0,
    rotate: -45,
  },
  animate: { 
    opacity: 1, 
    scale: [0, 1.2, 1],
    rotate: 0,
  },
}
```

---

## 📚 延伸閱讀

```
□ Disney's 12 Principles of Animation
  → 應用到 Framer Motion
  → https://medium.com/@titanas/framer-x-micro-interactions-design-with-disneys-12-principles-of-animation-ee5cea58c540

□ Framer Motion 進階技巧
  → Layout Animations
  → Shared Layout Transitions
  → Scroll-triggered Animations

□ 效能優化指南
  → 減少重繪
  → 使用 will-change
  → 動畫節流
```

---

## ✅ 檢查清單

### **設計階段**
```
□ 在 Framer 建立原型
□ 測試所有互動效果
□ 記錄動畫參數
□ 截圖關鍵畫面
□ 導出設計規範
```

### **開發階段**
```
□ 安裝 Framer Motion
□ 建立動畫組件庫
□ 定義 design tokens
□ 實現核心動畫
□ 測試效能
□ 優化細節
```

---

## 🚀 快速參考

### **最常用的 Framer Motion 模式**

```typescript
// 1. 淡入動畫
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
/>

// 2. 滑入動畫
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
/>

// 3. Hover 效果
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>

// 4. 列表錯開動畫
<motion.div variants={container}>
  {items.map(item => (
    <motion.div key={item} variants={itemVariants} />
  ))}
</motion.div>

// 5. 條件式動畫
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

---

_最後更新: 2025-09-30_
_相關文件: framer-resources.md_
_下一步: animation-library.md_

🎬✨🚀
