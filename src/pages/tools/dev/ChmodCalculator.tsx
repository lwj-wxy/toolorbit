import { useState, useMemo } from 'react';
import { FileKey, Copy, Check } from 'lucide-react';

export default function ChmodCalculator() {
  const [permissions, setPermissions] = useState({
    owner: { read: false, write: false, execute: false },
    group: { read: false, write: false, execute: false },
    public: { read: false, write: false, execute: false }
  });

  const [copiedOctal, setCopiedOctal] = useState(false);
  const [copiedSymbolic, setCopiedSymbolic] = useState(false);

  // Toggle a specific permission bit
  const handleToggle = (type: 'owner' | 'group' | 'public', perm: 'read' | 'write' | 'execute') => {
    setPermissions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [perm]: !prev[type][perm]
      }
    }));
  };

  // Derive Octal String (e.g., 755)
  const octalValue = useMemo(() => {
    const calc = (block: { read: boolean, write: boolean, execute: boolean }) => {
      let val = 0;
      if (block.read) val += 4;
      if (block.write) val += 2;
      if (block.execute) val += 1;
      return val.toString();
    };
    return calc(permissions.owner) + calc(permissions.group) + calc(permissions.public);
  }, [permissions]);

  // Derive Symbolic String (e.g., -rwxr-xr-x)
  const symbolicValue = useMemo(() => {
    const calc = (block: { read: boolean, write: boolean, execute: boolean }) => {
      let str = '';
      str += block.read ? 'r' : '-';
      str += block.write ? 'w' : '-';
      str += block.execute ? 'x' : '-';
      return str;
    };
    return '-' + calc(permissions.owner) + calc(permissions.group) + calc(permissions.public); // Assuming file prefix '-'
  }, [permissions]);

  // Preset quick sets
  const setPreset = (preset: string) => {
    const parseDigit = (d: number) => ({
      read: (d & 4) !== 0,
      write: (d & 2) !== 0,
      execute: (d & 1) !== 0
    });
    setPermissions({
      owner: parseDigit(parseInt(preset[0])),
      group: parseDigit(parseInt(preset[1])),
      public: parseDigit(parseInt(preset[2]))
    });
  };

  const copyText = (text: string, type: 'octal' | 'symbolic') => {
    navigator.clipboard.writeText(text);
    if (type === 'octal') {
       setCopiedOctal(true);
       setTimeout(() => setCopiedOctal(false), 2000);
    } else {
       setCopiedSymbolic(true);
       setTimeout(() => setCopiedSymbolic(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <FileKey className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">Linux chmod 权限掩码计算器</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              直观点击多选框，在八进制数字掩码与 RWX 符号模式之间快速推导转换。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
             <span className="w-2 h-6 bg-indigo-500 rounded block"></span>
             文件属性访问权限配置 (Access Classes)
           </h3>

           <div className="space-y-6">
              {['owner', 'group', 'public'].map((groupType) => {
                 const typeKey = groupType as 'owner' | 'group' | 'public';
                 const labels = { owner: '拥有者 (Owner)', group: '所属组 (Group)', public: '公共 (Public)' };
                 return (
                 <div key={groupType} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <div className="font-bold text-slate-700 mb-4">{labels[typeKey]}</div>
                    <div className="grid grid-cols-3 gap-4">
                       <label className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={permissions[typeKey].read}
                            onChange={() => handleToggle(typeKey, 'read')}
                            className="w-5 h-5 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className="text-sm font-medium text-slate-700">读取 (r = 4)</span>
                       </label>
                       <label className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={permissions[typeKey].write}
                            onChange={() => handleToggle(typeKey, 'write')}
                            className="w-5 h-5 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className="text-sm font-medium text-slate-700">写入 (w = 2)</span>
                       </label>
                       <label className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={permissions[typeKey].execute}
                            onChange={() => handleToggle(typeKey, 'execute')}
                            className="w-5 h-5 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className="text-sm font-medium text-slate-700">执行 (x = 1)</span>
                       </label>
                    </div>
                 </div>
              )})}
           </div>

           <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="font-bold text-slate-700 mb-4">常用预设 (Presets)</div>
              <div className="flex flex-wrap gap-2">
                 {[
                   {val: '777', tag: '完全开放'},
                   {val: '755', tag: 'Web目录'},
                   {val: '644', tag: 'Web文件'},
                   {val: '600', tag: '私密密钥'}
                 ].map(preset => (
                    <button
                      key={preset.val}
                      onClick={() => setPreset(preset.val)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-lg transition-colors border border-indigo-200"
                    >
                       chmod {preset.val}
                       <span className="block text-xs font-normal opacity-80">{preset.tag}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-indigo-900 rounded-2xl shadow-lg p-6 lg:p-8 flex flex-col">
              <h3 className="font-bold text-indigo-100 mb-8 flex items-center gap-2 uppercase tracking-wider text-sm">
                 Result Output
              </h3>

              <div className="space-y-8 flex-1">
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="block text-sm font-medium text-indigo-300">八进制 (Octal)</label>
                       <button
                          onClick={() => copyText(octalValue, 'octal')}
                          className="text-indigo-400 hover:text-white transition-colors p-1"
                       >
                         {copiedOctal ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </div>
                    <div className="text-5xl font-mono text-white font-bold tracking-widest pt-2">
                       {octalValue}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-indigo-800">
                    <div className="flex items-center justify-between mb-2">
                       <label className="block text-sm font-medium text-indigo-300">符号表示 (Symbolic)</label>
                       <button
                          onClick={() => copyText(symbolicValue, 'symbolic')}
                          className="text-indigo-400 hover:text-white transition-colors p-1"
                       >
                         {copiedSymbolic ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </div>
                    <div className="text-3xl font-mono text-indigo-200 font-bold pt-2">
                       {symbolicValue}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 Chmod 权限计算推导器，Linux 运维必装瑞士军刀</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          当你在配置云服务器（诸如 Nginx Web 目录或是 SSH 私钥文件 `~/.ssh/id_rsa`）的系统安全隔离组时，通常避不开和 `chmod` 指令打交道。它那抽象古板的八进制掩码结构往往令非科班运维开发者摸不着头脑。这款转换器将命令行中生涩的 4/2/1 转化为了傻瓜式的可视化点选面板。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握操作系统底层的权限组合哲学：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. RWX 的三要素算理：</strong>
            <span>在 Unix-like 系统中，读（Read）、写（Write）、执行（Execute）所代表的二进制权重值分别是 4、2、1。当你需要让用户组既能够读又能够执行但不赋予写入权的时候，“4+1” 组合便导出了标志性的数字 `5`。你可以在上方点选测试这套严谨的加法机制。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 可视化八进制/符号模式双排互转：</strong>
            <span>不论你是在系统 FTP 客户端属性项里看到了诸如 `-rwxr-xr-x` 这样如同摩斯密码一样的字母带，还是打算通过终端执行 `chmod 755 index.html`，面板右侧均会随堂变动且同时抛出这两个答案以备不时之需的黏贴。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 规避系统事故的一键预设挡位：</strong>
            <span>我们在计算器的下方直接锁定了诸如 `644`、`777` 这样最常见的场景挡位。警示：请不要在除开发调试或临时文件挂载之外的根目录随意应用 777 最高掩码，这相当于给公网的黑客敞开了自家机器底层的读写提权大门！</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          运维提示：我们默认符号计算推导时携带了开头的 `-` 号（代表普通文件档），如果是需要应用于目录挂载树，这第一位元应该表示为表示文件夹特性的 `d` （如 drwxr-xr-x）。
        </p>
      </div>

    </div>
  );
}
