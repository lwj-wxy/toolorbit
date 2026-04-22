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
              spellCheck={false}
              value={input}
              onChange={(e) => processText(e.target.value, mode)}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono resize-none bg-white min-h-[200px] break-all custom-scrollbar"
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
                spellCheck={false}
                readOnly
                value={error ? '' : output}
                className={`block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono resize-none bg-gray-50 min-h-[200px] break-all custom-scrollbar ${
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

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Base64 纯前端在线发报机，UTF-8 中文乱码的终结者</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          Base64 作为在网络请求（如邮件附件传输、Token 颁发或网页内置小图）中防止控制字符篡改的基础编码方式，深受开发人员青睐。但在使用浏览器默认的 <code>btoa</code> 与 <code>atob</code> 函数处理中文等多字节文案时往往会崩溃飘红。本面板特为此打上了无缝补丁。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">解析这块高强解码版面的核心特性与原理：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 原生跨平台中文字符支持：</strong>
            <span>我们摒弃了纯碎原生仅支持 ASCII 的简陋 API。利用 URL 转义重组等算法，完美代理了将任何变身在 UTF-8 集中的罕见多音字或 Emoji 表情转换为 Base64，彻底告别 Failed to execute 异常。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 全向同频的双车道互转：</strong>
            <span>界面上方提供了丝滑顺畅的制式开关。你既可以黏贴文书翻译成密密麻麻的大小写英文及符号等号串；也可以贴上传感器传来的密报做直接还原。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 免接口强效物理保险箱：</strong>
            <span>在您转译诸如 .env 环境底层配置密钥字或 Jwt token 体时，数据在网络上传输是一件危险的事情。此发报机贯彻零请求、纯离线的底线原则，保护你在局域网环境下的任何逆向解构动作。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          声明排雷：目前的底层编码组件只针对单纯的 Text 文本面流，请不要将以 data:image 开头混杂着图片二进制流的文件体喂入，如果需要清洗小体积挂载图片请使用图片转换板块。
        </p>
      </div>

    </div>
  );
}
