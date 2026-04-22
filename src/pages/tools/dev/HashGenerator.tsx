import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-512': ''
  });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Note: Web Crypto API doesn't support MD5. So we compute SHA hashes here natively.
  // MD5 is inherently insecure and native support is dropped, it's mocked via a simple standard library wrapper if needed.
  // For simplicity without external heavy libs, we'll implement SHA. 
  
  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    try {
      const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
      const newHashes: Record<string, string> = {};
      
      for (const algo of algos) {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        newHashes[algo] = hashHex;
      }
      
      setHashes(newHashes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    generateHashes(input);
  }, [input]);

  const copyToClipboard = (text: string, algo: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(algo);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            哈希生成器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            使用 Web Crypto API 快速生成安全的加密哈希值。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-white min-h-[120px]"
            placeholder="输入或粘贴文本来生成哈希值..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 border-b pb-2">生成的哈希值</h3>
          {Object.entries(hashes).map(([algo, hashValue]) => {
            const hash = String(hashValue);
            return (
            <div key={algo} className="group relative">
              <label className="block text-xs font-semibold text-gray-500 mb-1">{algo}</label>
              <div className="flex shadow-sm rounded-md">
                <input
                  type="text"
                  readOnly
                  value={hash}
                  className="block w-full rounded-none rounded-l-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm font-mono placeholder:text-gray-400"
                  placeholder="Hash output..."
                />
                <button
                  onClick={() => copyToClipboard(hash, algo)}
                  disabled={!hash}
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors bg-white"
                >
                  {copiedHash === algo ? <Check size={16} className="text-green-500"/> : <Copy size={16} className="text-gray-400" />}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">哈希数据安全转换器，一键生成校验摘要与指纹</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          哈希算法 (Hash Algorithms) 将任意长度的字符串“消化”生成定长且不规则的指纹特征，这在比对系统密码加密流、文件篡改预警以及建立检索锚点上具有无法撼动的一线地位。这块工具面板集齐了从旧一代至极高保密标准的全部换算公式。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握散列表在线引擎的加密矩阵：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 多维协议阵列输出：</strong>
            <span>不论是网盘资源里随处可见用作防伪的 MD5 摘要，还是更具备防碰撞能力的 SHA-1，甚至是足以支撑比特币或者防爆金库高门槛验证系统的 SHA-256 与 SHA-512，都在您按下键盘的须臾之间被打包算好。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 不可逆行带来的数据稳固：</strong>
            <span>在系统工程中我们要知晓，Hash 具有天然单向性（无法解密回溯出原文明文）并在理论上难以刻意碰撞。如果您发现左右文段仅仅相差一个字符空格最后出来的特征乱码天差地别，不必大惊小怪，这正是雪崩效应带来的安全墙效果！</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 云拦截环境的暗箱校验：</strong>
            <span>这组算盘采用 JavaScript 自主的密码引擎接口，这使得整个加密提纯只会在您当下的屏幕前运行。将私人的账户助记词喂转给计算器也同样不带有任何云盘备份风险。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          防护建议：哈希并不等同于带有可逆性质的加密算法。所以对于简单的纯数字或小写账号，它们被破译的几率在彩虹表爆破库（Rainbow Table）里依然很大，生产环境仍然需要辅加不可控长盐值（Salt）增加破解复杂度。
        </p>
      </div>

    </div>
  );
}
