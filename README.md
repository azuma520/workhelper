# 🚀 SOP 輔助系統 (SOP Helper)

> 幫助上班族、知識工作者擺脫重複摸索，讓任務管理、紀錄、SOP 建立與 AI 複盤一站完成，提升效率與專注力。

[![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 專案概述

SOP 輔助系統是一個專為個人效率優化設計的 Next.js 應用程式，整合了任務管理、SOP 建立、番茄鐘和 AI 複盤功能，幫助使用者建立系統化的工作流程。

## ✨ 核心功能

### 🎯 任務管理
- 快速建立任務（名稱 + 截止時間）
- 任務列表顯示與管理
- 任務狀態追蹤

### 📝 任務紀錄
- 為任務新增詳細紀錄
- 時間軸顯示所有活動
- 進度追蹤與回顧

### 🍅 番茄鐘
- 專注計時法支援
- 與任務綁定
- 工作時間統計

### 📋 SOP 建立
- **Purpose**：為何要做
- **Inputs**：前置條件
- **Steps**：執行步驟（最多 8 步）
- **Outputs**：產出成果
- **FAQs**：常見問題
- **AI 建議**：自動填寫內容建議

### 🤖 AI 複盤
- **日結**：當天任務摘要 + 評價
- **週結**：一周工作三段落 AI 複盤
- 智能分析與改善建議

## 🛠 技術棧

- **框架**：Next.js 14.2.33 (App Router)
- **語言**：TypeScript 5.3.3
- **樣式**：Tailwind CSS 3.4.1
- **代碼品質**：ESLint + Next.js 配置
- **建置工具**：PostCSS + Autoprefixer

## 🚀 快速開始

### 環境需求
- Node.js 18.0 或更高版本
- npm 或 yarn 套件管理器

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd sop-app
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **開啟瀏覽器**
   訪問 [http://localhost:3000](http://localhost:3000)

### 可用腳本

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm run start

# 代碼檢查
npm run lint
```

## 📁 專案結構

```
sop-app/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── sops/         # SOP 相關 API
│   │   └── test/         # 測試 API
│   ├── globals.css       # 全域樣式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首頁
├── docs/                 # 文件
│   └── prd.md           # 產品需求文件
├── .eslintrc.json       # ESLint 配置
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
└── package.json         # 專案配置
```

## 🔧 開發指南

### 代碼規範
- 使用 TypeScript 進行類型安全開發
- 遵循 ESLint 規則進行代碼檢查
- 使用 Tailwind CSS 進行樣式設計
- 遵循 Next.js App Router 最佳實踐

### API 端點
- `GET/POST /api/test` - 健康檢查
- `POST /api/sops/generate` - SOP 生成

## 📋 功能路線圖

### MVP 驗收條件
- [x] 專案基礎架構建立
- [x] 基本 API 端點實現
- [ ] 任務管理功能
- [ ] 任務紀錄與時間軸
- [ ] 番茄鐘功能
- [ ] SOP 建立與 AI 建議
- [ ] AI 複盤功能

### 未來規劃
- [ ] 數據持久化（資料庫整合）
- [ ] 用戶認證系統
- [ ] 移動端適配
- [ ] 更多 AI 功能整合

## 🤝 貢獻指南

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 📞 聯絡資訊

如有問題或建議，請透過以下方式聯絡：
- 建立 Issue
- 發送 Pull Request

---

**讓工作更有效率，讓 SOP 更簡單！** 🎯
