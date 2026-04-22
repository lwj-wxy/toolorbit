import { useState } from 'react';
import { Copy, Check, ArrowDownUp } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
    } catch (e) {
      setOutput('Invalid format');
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
            URL {mode === 'encode' ? '编码器' : '解码器'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            安全地编码您的网址参数或将其解码为可读的标准格式。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
          >
            <ArrowDownUp size={16} /> 互换
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
            <textarea
              value={input}
              onChange={(e) => processText(e.target.value, mode)}
              className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-white min-h-[150px]"
              placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world' : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">输出结果</label>
              <button 
                onClick={copyToClipboard}
                disabled={!output || output === 'Invalid format'}
                className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                {copied ? '已复制' : '复制结果'}
              </button>
            </div>
            
            <textarea
              readOnly
              value={output}
              className={`block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-gray-50 min-h-[150px] ring-gray-300`}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">URL 编码与解码工具：解决网址参数传输中的特殊字符污染</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          当我们在浏览器地址栏或者向后端 API 传输包含中文字母、空格、斜杠、以及形如 `&`、`?` 等本身属于网络协定语法的一部分的数据时，往往会导致路由解析错误或数据丢失。利用原生安全的 URL Encode 转义便可彻底化解参数传递阻碍。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握转义组件的应用核心场景：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. URL 查询字符串安全封包：</strong>
            <span>在您需要发送 <code>https://example.com/search?q=你好 世界</code> 时，利用 Encode 选项将其转换为 <code>%E4%BD%A0%E5%A5%BD%20%E4%B8%96%E7%95%8C</code>。这能保护包含空格、汉字的数据安稳跨越网关的防火墙。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 重定向嵌套链接清洗（Decode）：</strong>
            <span>许多追踪平台的推广链接里经常套着长长一串带百分号的火星文（例如微信、淘宝的唤起链接）。只要把它们往解码框里一贴，就能让原网址真相大白，这对于安全审计和反钓鱼追踪极其具有实用价值。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 百分百客户端离线处理机制：</strong>
            <span>和本域中大部分底层测试组件相同，此面板利用 JavaScript 原生的 <code>encodeURIComponent</code> 和解析引擎运转。所有的字符替换仅挂载在你的浏览器内存中发生，绝对避免敏感参数数据在公网流窜。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          进阶指南：目前这套工具采用了相较于全局编码更加严格与实用的 `encodeURIComponent` 标准。它能转义 `?` 等具有功能性的保留字符，非常适合用于 URL 后方的 Query 参数转码组装处理工作。
        </p>
      </div>

    </div>
  );
}
