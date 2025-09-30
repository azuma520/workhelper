'use client';

import { useState } from 'react';
import { SOP, CreateSOPRequest, SOPStep } from '../types/sop';

interface SOPCreatorProps {
  onSave: (sop: CreateSOPRequest) => void;
  onCancel: () => void;
  initialData?: Partial<CreateSOPRequest>;
}

export default function SOPCreator({ onSave, onCancel, initialData }: SOPCreatorProps) {
  const [formData, setFormData] = useState<CreateSOPRequest>({
    title: initialData?.title || '',
    purpose: initialData?.purpose || '',
    inputs: initialData?.inputs || [''],
    steps: initialData?.steps || [{ title: '', description: '', order: 1 }],
    outputs: initialData?.outputs || [''],
    faqs: initialData?.faqs || [{ question: '', answer: '' }],
    tags: initialData?.tags || []
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof CreateSOPRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayItemChange = (field: 'inputs' | 'outputs', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'inputs' | 'outputs') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'inputs' | 'outputs', index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const handleStepChange = (index: number, field: keyof SOPStep, value: string | number) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    if (formData.steps.length < 8) {
      const newStep: Omit<SOPStep, 'id'> = {
        title: '',
        description: '',
        order: formData.steps.length + 1
      };
      setFormData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    }
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      // 重新排序
      const reorderedSteps = newSteps.map((step, i) => ({ ...step, order: i + 1 }));
      setFormData(prev => ({ ...prev, steps: reorderedSteps }));
    }
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: newFAQs }));
  };

  const addFAQ = () => {
    setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  };

  const removeFAQ = (index: number) => {
    if (formData.faqs.length > 1) {
      const newFAQs = formData.faqs.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, faqs: newFAQs }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證必填欄位
    if (!formData.title.trim() || !formData.purpose.trim()) {
      alert('請填寫標題和目的');
      return;
    }

    // 過濾空值
    const cleanedData = {
      ...formData,
      inputs: formData.inputs.filter(input => input.trim()),
      outputs: formData.outputs.filter(output => output.trim()),
      steps: formData.steps.filter(step => step.title.trim() && step.description.trim()),
      faqs: formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim())
    };

    onSave(cleanedData);
  };

  const getAISuggestion = async (field: 'purpose' | 'inputs' | 'steps' | 'outputs' | 'faqs') => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/sops/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          context: formData.title,
          currentContent: formData[field]
        })
      });
      
      const data = await response.json();
      if (data.ok && data.suggestions) {
        // 這裡可以顯示建議，讓用戶選擇
        console.log('AI 建議:', data.suggestions);
      }
    } catch (error) {
      console.error('獲取 AI 建議失敗:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">建立 SOP</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 標題 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SOP 標題 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入 SOP 標題"
            required
          />
        </div>

        {/* 目的 (Purpose) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              目的 (Purpose) *
            </label>
            <button
              type="button"
              onClick={() => getAISuggestion('purpose')}
              disabled={isGenerating}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : 'AI 建議'}
            </button>
          </div>
          <textarea
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="說明為什麼需要這個 SOP"
            required
          />
        </div>

        {/* 前置條件 (Inputs) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              前置條件 (Inputs)
            </label>
            <button
              type="button"
              onClick={() => getAISuggestion('inputs')}
              disabled={isGenerating}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : 'AI 建議'}
            </button>
          </div>
          {formData.inputs.map((input, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => handleArrayItemChange('inputs', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="輸入前置條件"
              />
              {formData.inputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('inputs', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  刪除
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('inputs')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + 新增前置條件
          </button>
        </div>

        {/* 執行步驟 (Steps) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              執行步驟 (Steps) - 最多 8 步
            </label>
            <button
              type="button"
              onClick={() => getAISuggestion('steps')}
              disabled={isGenerating}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : 'AI 建議'}
            </button>
          </div>
          {formData.steps.map((step, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">步驟 {step.order}</span>
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    刪除步驟
                  </button>
                )}
              </div>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="步驟標題"
              />
              <textarea
                value={step.description}
                onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="詳細描述"
              />
            </div>
          ))}
          {formData.steps.length < 8 && (
            <button
              type="button"
              onClick={addStep}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + 新增步驟
            </button>
          )}
        </div>

        {/* 產出成果 (Outputs) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              產出成果 (Outputs)
            </label>
            <button
              type="button"
              onClick={() => getAISuggestion('outputs')}
              disabled={isGenerating}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : 'AI 建議'}
            </button>
          </div>
          {formData.outputs.map((output, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={output}
                onChange={(e) => handleArrayItemChange('outputs', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="輸入預期產出"
              />
              {formData.outputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('outputs', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  刪除
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('outputs')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + 新增產出成果
          </button>
        </div>

        {/* 常見問題 (FAQs) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              常見問題 (FAQs)
            </label>
            <button
              type="button"
              onClick={() => getAISuggestion('faqs')}
              disabled={isGenerating}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : 'AI 建議'}
            </button>
          </div>
          {formData.faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">問題 {index + 1}</span>
                {formData.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    刪除
                  </button>
                )}
              </div>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="問題"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="答案"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addFAQ}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + 新增問題
          </button>
        </div>

        {/* 按鈕 */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            儲存 SOP
          </button>
        </div>
      </form>
    </div>
  );
}

