# 任務步驟與證據框架設計（中量級、低負擔）

本文件定義：如何在任務中引導使用者以 What/How/Why 與「動作→結果→證據」方式記錄步驟，並沉澱為 SOP 草稿，符合 PDCA 的持續改進流程。

---

## 1. 核心原則
- 極簡必填：只強制 What（動作）與 Result（期望結果/驗收標準）。
- 漸進補充：How（關鍵要點/風險/品質點）、Why、Evidence（證據）皆為可選，於進行或完成時提醒補齊。
- 行動語言：What 以「動詞＋對象」引導；Result 以「可驗收描述或檔案」。
- 借力三步模板：起步 → 產出 → 驗收，通用度高，降低思考負擔。
- 可觀測：Evidence 支援圖片/文件/影片/連結；記錄可關聯 Step 與耗時，利於瓶頸分析與 SOP 化。

## 2. 資料模型（Types）

### 2.1 TaskStep
- id: string
- taskId: string
- order: number
- status: 'pending' | 'in_progress' | 'done' | 'blocked'
- what: string                // 動作（必填）
- result: string              // 期望結果/驗收標準（必填）
- howKeyPoints?: string[]     // 關鍵要點/風險/品質點（可選，多條）
- why?: string                // 理由/目的（可選）
- expectedMinutes?: number
- spentMinutes?: number
- notes?: string
- evidence?: Evidence[]       // 單位成果
- createdAt: Date
- updatedAt: Date

### 2.2 Evidence（單位成果）
- id: string
- taskId: string
- stepId: string
- kind: 'image' | 'pdf' | 'doc' | 'sheet' | 'slide' | 'video' | 'link' | 'text'
- name: string
- url: string                 // 本地開發：/uploads/{taskId}/{stepId}/...
- size: number                // bytes
- mimeType?: string
- previewUrl?: string         // 縮圖（圖像/影片）
- note?: string               // 整體批註（簡版先做）
- isFinal?: boolean           // 是否為最終成果
- createdAt: Date

### 2.3 TaskRecord（延伸）
- 追加 stepId?: string 與 spentMinutes?: number
- 用途：過程紀錄可關聯到步驟，利於瓶頸分析與 SOP 改善輸入。

## 3. API 設計

Base: `/api/tasks/:id`

- Steps
  - GET    `/steps`                    → 列表（依 order）
  - POST   `/steps`                    → 新增步驟（必填 what/result）
  - PUT    `/steps/:stepId`            → 更新（what/result/howKeyPoints/why/order/status/notes/evidence...）
  - DELETE `/steps/:stepId`            → 刪除
  - POST   `/steps/:stepId/evidence`   → 上傳/新增單位成果（本地方案：multipart 或先 JSON 後端寫檔）
  - DELETE `/steps/:stepId/evidence/:evidenceId`

- Records
  - POST   `/records` body: { content, stepId?, duration? }

說明：
- 本地開發存檔策略 → 先儲存到 `public/uploads/{taskId}/{stepId}/`，並回寫中繼資料到記憶體 store（後續可無痛切換 Supabase Storage）。
- 熱重載持久化：沿用現有 `globalThis` 方案。

## 4. 介面設計（/tasks）

### 4.1 任務詳情展開區（Steps / Records）
- Steps（卡片列表）
  - 卡片顯示：What、Result、狀態；徽章：Evidence 數量、是否有 How/Why
  - 點卡片展開 Drawer：
    - What（input）｜Result（input）
    - How（chips，可多筆）｜Why（textarea）
    - Evidence（上傳/連結/文字紀錄，預覽縮圖/PDF 內嵌，影片封面）
    - 時間（預估/實際）｜Notes
    - 動作列：標記 done/blocked、排序（先上下移，再導入拖拉）
- Records（時間軸）
  - 快速輸入：content、選擇對應 Step、duration（分鐘）
  - 列表：顯示時間、內容、Step 標籤、可編輯/刪除

### 4.2 三步模板（起步/產出/驗收）
- 新增第一個步驟時，顯示「一鍵套用任務執行三步驟：起步/產出/驗收」
- 生成三筆預設步驟：
  1) 起步：What=先把前置作業準備好；Result=素材/需求/權限已就緒，可以開始動工
  2) 產出：What=先做出一個可看的版本；Result=有一個可以給人看/試的草稿或截圖
  3) 驗收：What=檢查一下，能交出去就交；Result=用小清單確認OK；要修的開成待修項
- 全數可編輯/刪改/重排

### 4.3 任務時間欄位與行為
- 欄位：`startedAt`（開始時間）、`dueDate`（預計截止）、`completedAt`（實際完成）
- 預設：建立任務未填 `startedAt` 時，視為建立即開始
- 行為：切換為「已完成」時，若 `completedAt` 未設定，寫入當下時間；還原則清空 `completedAt`
- 顯示：任務卡片顯示「開始 ~ 結束」，結束優先顯示 `completedAt`，否則顯示 `dueDate`

## 5. 上傳與預覽（本地開發）
- 白名單：image(jpg/png/webp/gif)、pdf、docx/pptx/xlsx、txt/md、video(mp4/mov)、link
- 大小上限：單檔 ≤ 20MB；任務合計 ≤ 500MB
- 儲存：`public/uploads/{taskId}/{stepId}/{timestamp}-{slug}.{ext}`
- 預覽：
  - image：縮圖＋原圖
  - pdf：pdf.js 內嵌
  - video：封面縮圖＋基礎播放
  - 其他：icon + 下載
- 批註：先做「整體備註」；區域批註後續再加。

## 6. SOP 導出
- 選項 A：導出 JSON（預覽畫面 + 下載）
  - 優點：快、可移植、易除錯；可供 API/批處理
  - 缺點：與現有 SOPCreator UI 還需一次導入步驟
- 選項 B：直接寫入 `SOPCreator` 表單狀態
  - 優點：一鍵成形、無縫接續 SOP 編修
  - 缺點：耦合較深、需與現有表單欄位對齊（需維護）

建議：先 A 後 B。先完成 JSON 導出與預覽，確認映射欄位穩定後，再做 B 的直接導入。

## 7. 體驗細節（降低負擔）
- 寫最少：新增步驟只需 What/Result；其餘在進行或完成時提醒補。
- 智慧提示：
  - What 輸入時提示動詞；Result 提示驗收語句模板（如「可在…呈現」「通過…測試」）
  - 完成時檢查是否有 Evidence，若無以非阻斷方式提醒
- 標記最終成果：Evidence 支援 isFinal=true，於任務完成時要求選定最終輸出。

## 8. 實作里程碑

### 已完成 ✅（2025-10-01）
1) ✅ 類型與 API：TaskStep、Evidence、Records（後端記憶體 store + globalThis）
2) ✅ /tasks UI：Steps/Records 整合、三步模板、引導式新增
3) ✅ 成果展示：連結與文字類型、彈出表單、列表顯示
4) ✅ 任務引導：TaskGuideModal 完整實作、三種觸發條件、三種規劃路徑

### 進行中 🚧
5) 🚧 SOP 導出：JSON 預覽 + 下載；之後導入 SOPCreator
6) 🚧 體驗優化：樂觀更新、錯誤提示、排序拖拉、快捷鍵

### 未來規劃 📅
7) 📅 檔案上傳：本地寫檔、圖片/PDF/影片預覽
8) 📅 資料庫整合：Supabase 或其他方案
9) 📅 使用者追蹤：PostHog/Mixpanel 整合

---

## 9. 變更記錄

| 日期 | 版本 | 變更內容 |
|------|------|---------|
| 2025-09-30 | v1.0 | 初版設計文檔，定義核心框架 |
| 2025-10-01 | v1.1 | 完成引導系統、Records、成果展示實作 |

---

本文檔對應的實作待辦請見 TODO 清單；若需求變更，先更新此文檔再實作。
