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
    </div>
  );
}
