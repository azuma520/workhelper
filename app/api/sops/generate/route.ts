import { NextResponse } from "next/server";
import { AISuggestionRequest, AISuggestionResponse, CreateSOPRequest } from "../../../types/sop";

type SuccessResponse = {
  ok: true;
  request: unknown;
};

type ErrorResponse = {
  ok: false;
  error: string;
};

function createErrorResponse(error: unknown, status = 400) {
  const message =
    error instanceof SyntaxError
      ? "Invalid JSON payload"
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return NextResponse.json<ErrorResponse>(
    { ok: false, error: message },
    { status },
  );
}

// 模擬 AI 建議功能
function generateAISuggestions(request: AISuggestionRequest): AISuggestionResponse {
  const { field, context, currentContent } = request;
  
  // 這裡可以整合真實的 AI API，目前使用模擬數據
  const suggestions: Record<string, string[]> = {
    purpose: [
      "提高工作效率和一致性",
      "減少錯誤和重複工作",
      "確保流程標準化",
      "便於新員工培訓",
      "提升服務品質"
    ],
    inputs: [
      "相關文件資料",
      "必要工具和設備",
      "人員權限確認",
      "前置條件檢查",
      "環境準備就緒"
    ],
    steps: [
      "準備階段：確認所有前置條件",
      "執行階段：按照標準流程操作",
      "檢查階段：驗證結果和品質",
      "完成階段：整理和歸檔資料"
    ],
    outputs: [
      "完成報告",
      "相關文件",
      "品質檢查記錄",
      "後續行動清單"
    ],
    faqs: [
      "如果遇到問題該如何處理？",
      "需要多長時間完成？",
      "誰負責審核結果？",
      "如何確認品質標準？"
    ]
  };

  return {
    suggestions: suggestions[field] || [],
    confidence: 0.8
  };
}

// 儲存 SOP 的模擬函數
function saveSOP(sopData: CreateSOPRequest): { id: string; sop: any } {
  const id = `sop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const sop = {
    id,
    ...sopData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // 這裡應該儲存到資料庫，目前只是模擬
  console.log('儲存 SOP:', sop);
  
  return { id, sop };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 檢查是否為 AI 建議請求
    if (payload.field && payload.context) {
      const aiRequest = payload as AISuggestionRequest;
      const suggestions = generateAISuggestions(aiRequest);
      return NextResponse.json<AISuggestionResponse>(suggestions);
    }
    
    // 檢查是否為 SOP 建立請求
    if (payload.title && payload.purpose) {
      const sopData = payload as CreateSOPRequest;
      const { id, sop } = saveSOP(sopData);
      return NextResponse.json({ 
        ok: true, 
        id, 
        sop,
        message: "SOP 建立成功" 
      });
    }
    
    // 預設回應
    return NextResponse.json<SuccessResponse>({ ok: true, request: payload });
  } catch (error) {
    return createErrorResponse(error);
  }
}
