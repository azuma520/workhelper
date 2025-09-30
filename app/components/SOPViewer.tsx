'use client';

import { SOP } from '../types/sop';

interface SOPViewerProps {
  sop: SOP;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SOPViewer({ sop, onEdit, onDelete }: SOPViewerProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 標題和操作按鈕 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{sop.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>建立時間：{new Date(sop.createdAt).toLocaleDateString('zh-TW')}</span>
            <span>更新時間：{new Date(sop.updatedAt).toLocaleDateString('zh-TW')}</span>
          </div>
          {sop.tags && sop.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {sop.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              編輯
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              刪除
            </button>
          )}
        </div>
      </div>

      {/* 目的 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            1
          </span>
          目的 (Purpose)
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{sop.purpose}</p>
        </div>
      </section>

      {/* 前置條件 */}
      {sop.inputs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
              2
            </span>
            前置條件 (Inputs)
          </h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {sop.inputs.map((input, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-green-200 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{input}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 執行步驟 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
          <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            3
          </span>
          執行步驟 (Steps)
        </h2>
        <div className="space-y-4">
          {sop.steps.map((step, index) => (
            <div key={step.id} className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">
                  {step.order}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 產出成果 */}
      {sop.outputs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
              4
            </span>
            產出成果 (Outputs)
          </h2>
          <div className="bg-orange-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {sop.outputs.map((output, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{output}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 常見問題 */}
      {sop.faqs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
              5
            </span>
            常見問題 (FAQs)
          </h2>
          <div className="space-y-4">
            {sop.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Q: {faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

