import { useState } from 'react';
import { Copy, Check, ArrowDownUp } from 'lucide-react';

export default function Base64() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    if (!text.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'encode') {
        // Handle utf-8 encoding safely
        const utf8Bytes = new TextEncoder().encode(text);
        const binaryStr = Array.from(utf8Bytes).map(b => String.fromCharCode(b)).join('');
        setOutput(btoa(binaryStr));
      } else {
        const binaryStr = atob(text);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(bytes));
      }
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Invalid format');
      }
      setOutput('');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    processText(input, newMode);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Base64 {mode === 'encode' ? '编码器' : '解码器'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            在 Base64 格式和文本之间转换，完全支持 UTF-8 编码。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => processText(input, 'encode')}
              onClickCapture={() => setMode('encode')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'encode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              编码 (Encode)
            </button>
            <button
              onClick={() => processText(input, 'decode')}
              onClickCapture={() => setMode('decode')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'decode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              解码 (Decode)
            </button>
          </div>
          
          <button 
            onClick={toggleMode}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors font-medium"
            title="Swap input mode"
          >
            <ArrowDownUp size={16} /> 互换
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'encode' ? '文本输入' : 'Base64 输入'}
            </label>
            <textarea
              value={input}
              onChange={(e) => processText(e.target.value, mode)}
              className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-white min-h-[200px]"
              placeholder={mode === 'encode' ? '输入要编码的文本...' : '提取 Base64 字符串来解码...'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {mode === 'encode' ? 'Base64 输出' : '文本输出'}
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
            
            <div className="relative">
              <textarea
                readOnly
                value={error ? '' : output}
                className={`block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-gray-50 min-h-[200px] ${
                  error ? 'ring-red-300' : 'ring-gray-300'
                }`}
                placeholder="Result will appear here..."
              />
              {error && (
                <div className="absolute inset-0 bg-red-50/90 flex items-center justify-center rounded-lg border border-red-200">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
