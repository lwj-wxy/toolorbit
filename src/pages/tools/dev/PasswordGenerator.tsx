import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, Layers } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
  });

  const generatePassword = () => {
    let charset = "";
    let uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excluded I, O
    let lowercase = "abcdefghijkmnpqrstuvwxyz"; // Excluded l, o
    let numbers = "23456789"; // Excluded 0, 1
    let symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!options.excludeSimilar) {
      uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      lowercase = "abcdefghijklmnopqrstuvwxyz";
      numbers = "0123456789";
    }

    if (options.uppercase) charset += uppercase;
    if (options.lowercase) charset += lowercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;

    if (charset === "") {
      setPassword("请至少选择一种字符类型");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(generatedPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const handleCopy = () => {
    if (password === "请至少选择一种字符类型") return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length > 12) score++;
    if (length > 18) score++;
    if (options.uppercase) score++;
    if (options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    
    if (score < 3) return { label: '弱', color: 'text-rose-500', bar: 'w-1/4 bg-rose-500' };
    if (score < 5) return { label: '中', color: 'text-amber-500', bar: 'w-2/4 bg-amber-500' };
    if (score < 7) return { label: '强', color: 'text-emerald-500', bar: 'w-3/4 bg-emerald-500' };
    return { label: '极强', color: 'text-blue-500', bar: 'w-full bg-blue-500' };
  };

  const strength = getStrength();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">强密码生成器</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              在本地生成高强度的随机密码，确保您的账户安全。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-10 shadow-sm space-y-8">
        <div className="relative group">
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-8 text-center break-all font-mono text-2xl md:text-4xl font-bold text-slate-800 tracking-wider">
            {password}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={generatePassword}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all"
              title="重新生成"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
                copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="font-bold text-sm">{copied ? '已复制' : '复制密码'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">安全强度: <span className={strength.color}>{strength.label}</span></span>
              <span className="text-sm text-slate-400">长度: {length} 字符</span>
           </div>
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${strength.bar}`} />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
           <div className="space-y-6">
              <label className="block text-sm font-bold text-slate-700 mb-4">密码长度调节</label>
              <input 
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                 <span>极短</span>
                 <span>标准 (16)</span>
                 <span>超长安全</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'uppercase', label: '大写字母 (A-Z)' },
                { id: 'lowercase', label: '小写字母 (a-z)' },
                { id: 'numbers', label: '数字 (0-9)' },
                { id: 'symbols', label: '特殊符号 (!@#)' },
                { id: 'excludeSimilar', label: '排除易混淆 (i, l, 1, 0, O)' }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
                   <div className="relative">
                      <input 
                        type="checkbox"
                        checked={(options as any)[opt.id]}
                        onChange={(e) => setOptions(prev => ({ ...prev, [opt.id]: e.target.checked }))}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all" />
                      <Check className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-all" />
                   </div>
                   <span className="text-sm font-medium text-slate-600">{opt.label}</span>
                </label>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mb-12 mt-12 bg-gradient-to-b from-white/50 to-transparent">
        <h2 className="text-xl font-bold text-slate-800 mb-6">关于强密码生成与安全</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p><strong>为何选择本工具？</strong> 很多在线生成器会将您的密码保存在服务器上。而我们的工具完全在您的浏览器本地（Client-Side）运行，没有任何数据会被上传，生成的每一个密码都是独一无二且瞬时的。 </p>
          <p><strong>安全建议：</strong> 建议在重要账户（如银行、主邮箱、支付平台）使用超过 18 位且包含符号的密码。启用“排除易混淆”选项可以避免在手动输入时输入错误。</p>
          <p><strong>管理密码：</strong> 为了不丢失这些复杂的随机密码，建议您配合 Bitwarden、1Password 或 Chrome 原生密码管理器使用。</p>
        </div>
      </div>
    </div>
  );
}
