/**
 * 動畫配置庫
 * 
 * 基於：
 * - Framer 設計系統
 * - Octalysis 遊戲化框架
 * - 隱性 PDCA 設計理念
 */

import { Transition, Variants } from 'framer-motion'

// ==================== 基礎動畫配置 ====================

/**
 * 彈簧動畫配置
 * 用於大多數互動效果
 */
export const springConfig: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
}

/**
 * 溫和彈簧配置
 * 用於大型元素或容器
 */
export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
}

/**
 * 快速反應配置
 * 用於按鈕等需要即時反饋的元素
 */
export const quickResponse: Transition = {
  duration: 0.2,
  ease: 'easeOut',
}

// ==================== 常用動畫變體 ====================

/**
 * 淡入動畫
 * 最基礎的進場動畫
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * 向上滑入
 * 用於卡片、對話框等
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

/**
 * 縮放進入
 * 用於模態窗口、通知
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

/**
 * 彈跳進入
 * 用於慶祝、成就解鎖
 */
export const bounceIn: Variants = {
  initial: { opacity: 0, scale: 0, rotate: -180 },
  animate: {
    opacity: 1,
    scale: [0, 1.2, 1],
    rotate: 0,
  },
  exit: { opacity: 0, scale: 0 },
}

// ==================== 列表動畫 ====================

/**
 * 容器錯開動畫
 * 用於列表、網格
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 每個子元素間隔 0.1 秒
      delayChildren: 0.2,   // 延遲 0.2 秒開始
    },
  },
}

/**
 * 列表項目動畫
 * 與 staggerContainer 配合使用
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springConfig,
  },
}

// ==================== 互動動畫 ====================

/**
 * 按鈕 Hover 配置
 */
export const buttonHover = {
  scale: 1.05,
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
}

/**
 * 按鈕點擊配置
 */
export const buttonTap = {
  scale: 0.95,
}

/**
 * 卡片 Hover 配置
 */
export const cardHover = {
  scale: 1.02,
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  y: -5,
}

// ==================== PDCA 階段動畫 ====================

/**
 * Plan 階段 - 引導式進入
 * 輕柔、引導性
 */
export const planPhaseAnimation: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: gentleSpring,
  },
}

/**
 * Do 階段 - 專注穩定
 * 快速、確定性
 */
export const doPhaseAnimation: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: quickResponse,
  },
}

/**
 * Check 階段 - 回顧展開
 * 展開、揭示性
 */
export const checkPhaseAnimation: Variants = {
  initial: { opacity: 0, height: 0 },
  animate: { 
    opacity: 1, 
    height: 'auto',
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
}

/**
 * Act 階段 - 驚喜建議
 * 吸引注意、友善
 */
export const actPhaseAnimation: Variants = {
  initial: { opacity: 0, y: 50, scale: 0.8 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
}

// ==================== Octalysis Core Drives 動畫 ====================

/**
 * CD2: 成就感動畫
 * 慶祝、獎勵性
 */
export const achievementAnimation: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
}

/**
 * CD3: 創造力反饋
 * 即時、響應性
 */
export const creativeFeedback: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
}

/**
 * CD7: 驚喜發現
 * 意外、吸引性
 */
export const surpriseAnimation: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0, 
    rotate: -45,
  },
  animate: {
    opacity: 1,
    scale: [0, 1.2, 1],
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 20,
    },
  },
}

// ==================== 進度動畫 ====================

/**
 * 進度條填充動畫
 */
export const progressFill = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: {
    duration: 1,
    ease: 'easeInOut',
  },
}

/**
 * 數字計數動畫配置
 */
export const counterConfig = {
  stiffness: 100,
  damping: 30,
}

// ==================== 通知動畫 ====================

/**
 * 通知進入動畫
 * 從右側滑入
 */
export const notificationSlide: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
}

/**
 * 通知彈跳進入
 * 更吸引注意
 */
export const notificationBounce: Variants = {
  initial: { opacity: 0, y: -100, scale: 0.5 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  exit: { opacity: 0, scale: 0.5 },
}

// ==================== 頁面轉場 ====================

/**
 * 頁面淡入
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
}

// ==================== 載入動畫 ====================

/**
 * 脈衝載入動畫
 */
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    repeat: Infinity,
    duration: 1.5,
    ease: 'easeInOut',
  },
}

/**
 * 旋轉載入動畫
 */
export const spinAnimation = {
  rotate: 360,
  transition: {
    repeat: Infinity,
    duration: 1,
    ease: 'linear',
  },
}

// ==================== 工具函數 ====================

/**
 * 創建錯開延遲
 * @param index - 元素索引
 * @param baseDelay - 基礎延遲
 * @param stagger - 錯開時間
 */
export const getStaggerDelay = (
  index: number,
  baseDelay: number = 0,
  stagger: number = 0.1
): number => {
  return baseDelay + index * stagger
}

/**
 * 創建彈跳序列
 * @param values - 數值序列
 */
export const createBounceSequence = (values: number[]) => ({
  scale: values,
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
})
