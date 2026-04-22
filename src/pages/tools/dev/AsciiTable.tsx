import { useState, useMemo } from 'react';
import { Search, Check, Copy, Hash } from 'lucide-react';

const CONTROL_CHARS: Record<number, string> = {
  0: 'NUL (空字符)', 1: 'SOH (标题开始)', 2: 'STX (正文开始)', 3: 'ETX (正文结束)', 
  4: 'EOT (传输结束)', 5: 'ENQ (请求)', 6: 'ACK (收到通知)', 7: 'BEL (响铃)',
  8: 'BS (退格)', 9: 'HT (水平制表符)', 10: 'LF (换行键)', 11: 'VT (垂直制表符)', 
  12: 'FF (换页键)', 13: 'CR (回车键)', 14: 'SO (不用切换)', 15: 'SI (启用切换)',
  16: 'DLE (数据链路转义)', 17: 'DC1 (设备控制1/XON)', 18: 'DC2 (设备控制2)', 
  19: 'DC3 (设备控制3/XOFF)', 20: 'DC4 (设备控制4)', 21: 'NAK (拒绝接收)', 
  22: 'SYN (同步空闲)', 23: 'ETB (结束传输块)', 24: 'CAN (取消)', 25: 'EM (媒体结束)', 
  26: 'SUB (代替)', 27: 'ESC (换码(溢出))', 28: 'FS (文件分隔符)', 29: 'GS (分组符)', 
  30: 'RS (记录分隔符)', 31: 'US (单元分隔符)', 127: 'DEL (删除)'
};

interface AsciiRow {
  dec: number;
  hex: string;
  oct: string;
  bin: string;
  char: string;
  html: string;
  type: string;
  desc: string;
}

export default function AsciiTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const asciiData: AsciiRow[] = useMemo(() => {
    return Array.from({ length: 128 }, (_, i) => {
      const isControl = i < 32 || i === 127;
      let type = '符号 (Symbol)';
      if (isControl) type = '控制字符 (Control)';
      else if (i >= 48 && i <= 57) type = '数字 (Number)';
      else if ((i >= 65 && i <= 90) || (i >= 97 && i <= 122)) type = '字母 (Letter)';

      const charDisplay = isControl ? CONTROL_CHARS[i].split(' ')[0] : String.fromCharCode(i);
      const desc = isControl ? CONTROL_CHARS[i] : `字符 ${charDisplay}`;

      return {
        dec: i,
        hex: i.toString(16).toUpperCase().padStart(2, '0'),
        oct: i.toString(8).padStart(3, '0'),
        bin: i.toString(2).padStart(8, '0'),
        char: charDisplay,
        html: `&#${i};`,
        type,
        desc
      };
    });
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return asciiData;
    const term = searchTerm.toLowerCase();
    return asciiData.filter(row => 
      row.dec.toString() === term ||
      row.hex.toLowerCase().includes(term) ||
      row.char.toLowerCase().includes(term) ||
      row.desc.toLowerCase().includes(term) ||
      row.type.toLowerCase().includes(term)
    );
  }, [searchTerm, asciiData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Hash className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">ASCII 编码表</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              标准 ASCII 字符编码速查及转换（包括控制字符、十进制、十六进制等）。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#e2e8f0] bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm outline-none"
              placeholder="搜索进制、字符或描述含义..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            检索结果: {filteredData.length} 条
          </div>
        </div>

        <div className="overflow-x-auto max-h-[700px] custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-[#f8fafc] sticky top-0 z-10 shadow-sm shadow-slate-100/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">十进制 (Dec)</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">十六进制 (Hex)</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">八进制 (Oct)</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">二进制 (Bin)</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">HTML</th>
                <th scope="col" className="px-6 py-4 text-center font-bold text-gray-600 uppercase tracking-wider">字符表现</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">描述定义</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row) => (
                <tr key={row.dec} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap font-mono text-emerald-700">{row.dec}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-mono text-gray-600">0x{row.hex}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-mono text-gray-500">{row.oct}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-mono text-gray-400">{row.bin}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-mono text-blue-600">{row.html}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={() => copyToClipboard(row.char)}
                      className={`inline-flex items-center justify-center min-w-[32px] h-[32px] px-2 rounded font-bold ${
                        row.dec < 32 || row.dec === 127 
                          ? 'bg-slate-100 text-slate-500 text-xs' 
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer shadow-sm text-lg'
                      }`}
                      title="点击提取字符"
                    >
                      {copiedText === row.char ? <Check className="w-4 h-4" /> : row.char}
                    </button>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-600 flex flex-col">
                    <span className="font-medium">{row.desc}</span>
                    <span className="text-xs text-gray-400">{row.type}</span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    未找到匹配的 ASCII 编码记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 ASCII 码表查询大全，程序员必备的字符编码速查手册</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          ASCII（American Standard Code for Information Interchange，美国信息交换标准代码）是基于拉丁字母的一套最广泛、最底层的单字节计算机编码系统。主要用于显示现代英语和其他西欧语言。本速查表收录了标准的 0~127 位字符簇全貌。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">全面通览 ASCII 字典的极客用法：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 多维进制并轨展示：</strong>
            <span>在逆向工程或者是 C 语言位运算等场景中，不仅仅只看十进制。这张详尽的清单直接为您平展开囊括了二、八、十、十六进制以及网页实体（HTML Entity）的多重映射关联面。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 控制字符透明化解析：</strong>
            <span>从 0 到 31 位以及 127 位属于不可见的控制命令符（如退格、换行符、终止通讯等）。以往的普通键盘无法敲击输出，但在本工具的定义表内附带了详细的信号解释备注，辅助物联网/串口调试人员排查机器通讯十六进制乱码。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 沉浸式搜索与单击速取：</strong>
            <span>相比挂图照片版的老式编码查询卡片，本页面具有完全的数据库化功能。通过头部强大的实时检索漏斗直接过滤对应符号；且所有可视区的原生字符只需轻点鼠标即可瞬间装入剪贴板中。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          关联延伸说明：标准的 ASCII 码其实只使用了一个字节（Byte）的后 7 位，最高位通常作为奇偶校验，因而总共只能表示 128 个字符。现在国际通用的 Unicode 和 UTF-8 都可以被视为包含了它的多字节扩容超集。
        </p>
      </div>
    </div>
  );
}
