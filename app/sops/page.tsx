'use client';

import { useState, useEffect } from 'react';
import { SOP, CreateSOPRequest } from '../types/sop';
import SOPList from '../components/SOPList';
import SOPCreator from '../components/SOPCreator';

export default function SOPsPage() {
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);
  const [loading, setLoading] = useState(true);

  // 模擬載入現有的 SOP
  useEffect(() => {
    // 這裡應該從 API 載入現有的 SOP
    // 目前使用模擬數據
    const mockSOPs: SOP[] = [
      {
        id: 'sop_1',
        title: '客戶服務 SOP',
        purpose: '確保客戶服務流程標準化，提升客戶滿意度',
        inputs: ['客戶資料', '服務記錄表', '產品知識手冊'],
        steps: [
          {
            id: 'step_1',
            title: '接收客戶詢問',
            description: '禮貌地接聽電話或接待客戶，確認客戶身份和需求',
            order: 1
          },
          {
            id: 'step_2',
            title: '分析問題',
            description: '仔細聆聽客戶問題，判斷問題類型和緊急程度',
            order: 2
          },
          {
            id: 'step_3',
            title: '提供解決方案',
            description: '根據問題類型提供相應的解決方案或轉介給專業人員',
            order: 3
          }
        ],
        outputs: ['服務記錄', '客戶滿意度調查', '問題解決報告'],
        faqs: [
          {
            question: '如果無法立即解決客戶問題該怎麼辦？',
            answer: '應記錄問題詳情，承諾在指定時間內回覆，並轉介給相關部門'
          }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        tags: ['客戶服務', '標準流程']
      }
    ];
    
    setSOPs(mockSOPs);
    setLoading(false);
  }, []);

  const handleCreateSOP = async (sopData: CreateSOPRequest) => {
    try {
      const response = await fetch('/api/sops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sopData)
      });
      
      const result = await response.json();
      
      if (result.ok) {
        // 將新建立的 SOP 添加到列表中
        setSOPs(prev => [result.sop, ...prev]);
        setIsCreating(false);
        setEditingSOP(null);
        alert('SOP 建立成功！');
      } else {
        alert('建立 SOP 失敗：' + result.error);
      }
    } catch (error) {
      console.error('建立 SOP 錯誤:', error);
      alert('建立 SOP 時發生錯誤');
    }
  };

  const handleEditSOP = (sop: SOP) => {
    setEditingSOP(sop);
    setIsCreating(true);
  };

  const handleDeleteSOP = async (sopId: string) => {
    if (confirm('確定要刪除這個 SOP 嗎？')) {
      // 這裡應該調用 API 刪除 SOP
      setSOPs(prev => prev.filter(sop => sop.id !== sopId));
      alert('SOP 已刪除');
    }
  };

  const handleViewSOP = (sop: SOP) => {
    // 在 SOPList 組件中處理查看功能
    console.log('查看 SOP:', sop);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSOP(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <SOPCreator
          onSave={handleCreateSOP}
          onCancel={handleCancel}
          initialData={editingSOP ? {
            title: editingSOP.title,
            purpose: editingSOP.purpose,
            inputs: editingSOP.inputs,
            steps: editingSOP.steps.map(step => ({
              title: step.title,
              description: step.description,
              order: step.order
            })),
            outputs: editingSOP.outputs,
            faqs: editingSOP.faqs,
            tags: editingSOP.tags
          } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題和操作按鈕 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">SOP 管理</h1>
              <p className="text-gray-600 mt-1">建立和管理標準作業程序</p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              + 建立新 SOP
            </button>
          </div>
        </div>
      </div>

      {/* SOP 列表 */}
      <div className="py-8">
        <SOPList
          sops={sops}
          onEdit={handleEditSOP}
          onDelete={handleDeleteSOP}
          onView={handleViewSOP}
        />
      </div>
    </div>
  );
}

