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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
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

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">纯前端 JSON 格式化与美化校验工具，接口调试的好帮手</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          现代 Web 开发与后端微服务中，JSON (JavaScript Object Notation) 是流转最广泛的数据格式载体。但在日志打印或抓包调试时，一长串被压缩的纯文本 JSON 往往难以人眼阅读。本格式化工具为您提供秒级的结构重建与错误校验机制。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么推荐使用这款代码校验画板？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 空格缩进严格规范：</strong>
            <span>在您输入混乱的原始字符串后，面板支持经典的 `2 个空格` 和 `4 个空格` 的缩进深度切换。这两种档位高度适配绝大部分国内外团队的代码审查 (Code Review) 风格。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 错误定位防呆：</strong>
            <span>如果贴入了少写双引号或是落了个多余逗号的废弃 JSON 串，右侧输出框将变红并精确拦截报错（SyntaxError）提示。让排查 API 脏数据变得肉眼可见。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 无数据库存底高安全：</strong>
            <span>无论是生产环境的配置秘钥文件，还是携带了大量 PII（个人身份信息）的用户列表阵列，您输入的一切都是依靠终端浏览器自身的 `JSON.parse` 处理的。我们不会发送哪怕一个字节您的私密数据到服务网关上。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          极客指北：遇到海量节点树（如数万行的数据级 JSON），建议直接关闭本页的响应式翻译或是扩展应用使用本地 VSCode 打开，以防拖慢前端单页的渲染性能。
        </p>
      </div>

    </div>
  );
}
