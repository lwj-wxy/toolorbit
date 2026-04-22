import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Invalid JSON');
      }
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            JSON 格式化
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            格式化、验证及美化您的 JSON 数据。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              输入 JSON
            </label>
            <div className="space-x-2">
              <button onClick={() => formatJson(2)} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors">
                格式化 (2空格)
              </button>
              <button onClick={() => formatJson(4)} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors">
                格式化 (4空格)
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="block w-full h-[500px] rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-white"
              placeholder='{"示例": "在此粘贴您的 JSON..."}'
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              输出结果
            </label>
            <button 
              onClick={copyToClipboard}
              disabled={!output}
              className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
              {copied ? '已复制' : '复制结果'}
            </button>
          </div>
          <div className="flex-1 relative">
            <textarea
              readOnly
              value={output}
              className={`block w-full h-[500px] rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-gray-50 ${
                error ? 'ring-red-300 text-red-900 bg-red-50 focus:ring-red-500' : 'ring-gray-300'
              }`}
            />
            {error && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-red-50 text-red-700 text-sm font-medium border-t border-red-200 rounded-b-lg">
                Error: {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
