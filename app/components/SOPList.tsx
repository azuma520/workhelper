'use client';

import { useState } from 'react';
import { SOP } from '../types/sop';
import SOPViewer from './SOPViewer';

interface SOPListProps {
  sops: SOP[];
  onEdit: (sop: SOP) => void;
  onDelete: (sopId: string) => void;
  onView: (sop: SOP) => void;
}

export default function SOPList({ sops, onEdit, onDelete, onView }: SOPListProps) {
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  // 獲取所有標籤
  const allTags = Array.from(
    new Set(sops.flatMap(sop => sop.tags || []))
  );

  // 過濾 SOP
  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || (sop.tags && sop.tags.includes(filterTag));
    return matchesSearch && matchesTag;
  });

  const handleView = (sop: SOP) => {
    setSelectedSOP(sop);
    onView(sop);
  };

  const handleCloseViewer = () => {
    setSelectedSOP(null);
  };

  if (selectedSOP) {
    return (
      <SOPViewer
        sop={selectedSOP}
        onEdit={() => {
          onEdit(selectedSOP);
          setSelectedSOP(null);
        }}
        onDelete={() => {
          onDelete(selectedSOP.id);
          setSelectedSOP(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 搜尋和篩選 */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜尋 SOP 標題或內容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有標籤</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            共找到 {filteredSOPs.length} 個 SOP
          </p>
        </div>
      </div>

      {/* SOP 列表 */}
      {filteredSOPs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">沒有找到 SOP</h3>
          <p className="text-gray-500">
            {searchTerm || filterTag ? '請嘗試其他搜尋條件' : '開始建立您的第一個 SOP'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSOPs.map(sop => (
            <div
              key={sop.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleView(sop)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {sop.title}
                  </h3>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(sop);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="編輯"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(sop.id);
                      }}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="刪除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {sop.purpose}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{sop.steps.length} 個步驟</span>
                  <span>{new Date(sop.updatedAt).toLocaleDateString('zh-TW')}</span>
                </div>
                
                {sop.tags && sop.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {sop.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {sop.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{sop.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

