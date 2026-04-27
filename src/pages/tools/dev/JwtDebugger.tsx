import React, { useState } from 'react';
import { Layers, Info, AlertTriangle, CheckCircle2, ChevronRight, Hash, Database, Clock } from 'lucide-react';

export default function JwtDebugger() {
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState('');

  const decodeJwt = (token: string) => {
    setError('');
    setHeader(null);
    setPayload(null);
    
    if (!token) return;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT 格式错误：必须包含由点(.)分隔的三个部分（Header.Payload.Signature）');
      }

      const decodePart = (str: string) => {
        try {
          // Replace URL-safe characters
          const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          const json = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(json);
        } catch (e) {
          throw new Error('无法解码 Base64 字符串');
        }
      };

      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
    } catch (err: any) {
      setError(err.message || '解码失败，请检查 Token 格式是否正确');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.trim();
    setJwt(val);
    decodeJwt(val);
  };

  const formatTimestamp = (ts: number) => {
    if (!ts) return 'N/A';
    return new Date(ts * 1000).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">JWT 在线解码器</h1>
          <p className="text-slate-500 mt-1 text-sm">解析 JSON Web Token 内容，无需上传，完全在浏览器本地运行。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Input */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[500px]">
            <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-400" />
              输入编码后的 JWT 字符串
            </label>
            <textarea
              value={jwt}
              onChange={handleInputChange}
              spellCheck={false}
              placeholder="在这里粘贴您的 JWT Token (Header.Payload.Signature)..."
              className="flex-1 w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none overflow-auto"
            />
            {error && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            {!error && jwt && (
               <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-600">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">Token 格式有效，预览已在右侧生成。</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Header (头部)
            </h2>
            <pre className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl font-mono text-xs text-indigo-700 overflow-auto max-h-[150px]">
              {header ? JSON.stringify(header, null, 2) : '// 等待输入...'}
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Payload (载荷/数据)
            </h2>
            <pre className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl font-mono text-xs text-amber-700 overflow-auto max-h-[300px] mb-6">
              {payload ? JSON.stringify(payload, null, 2) : '// 等待输入...'}
            </pre>

            {payload && (
              <div className="space-y-3 pt-4 border-top border-slate-100">
                 <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> 常用 claims 解析
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase">发行人 (iss)</span>
                       <span className="text-sm font-mono text-slate-700 truncate block">{payload.iss || '未定义'}</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase">主题 (sub)</span>
                       <span className="text-sm font-mono text-slate-700 truncate block">{payload.sub || '未定义'}</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 过期时间 (exp)
                       </span>
                       <span className="text-sm font-mono text-slate-700 block">{formatTimestamp(payload.exp)}</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                       <span className="block text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 签发时间 (iat)
                       </span>
                       <span className="text-sm font-mono text-slate-700 block">{formatTimestamp(payload.iat)}</span>
                    </div>
                 </div>
              </div>
            )}
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
             <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
             <div className="space-y-1">
                <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wide">注意：不包含签名验证</h3>
                <p className="text-xs text-rose-600 leading-relaxed">
                  本工具仅用于快速解码查看 JWT 内部明文信息。它<b>不会</b>验证签名的合法性。在实际生产环境调试中，请始终验证签名以确保内容未被篡改。
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
