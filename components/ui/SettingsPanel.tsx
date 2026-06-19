'use client';

import { useState } from 'react';

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini-api-key') || '';
    }
    return '';
  });

  function saveKey() {
    if (apiKey.trim()) {
      localStorage.setItem('gemini-api-key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini-api-key');
    }
    setIsOpen(false);
  }

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:border-blue-300 transition"
      >
        ⚙️ AI 设置
      </button>

      {/* 设置面板 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">AI 分析设置</h3>
            <p className="mt-1 text-sm text-gray-500">
              填入你的 Google Gemini API Key 可获得更智能的 AI 分析。
              留空则使用免费的关键词分析。
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <p className="mt-1 text-xs text-gray-400">
                免费获取：<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>（每天1500次免费额度）
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={saveKey}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
