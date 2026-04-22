import { useState } from 'react';
import { Type, Copy, Check, Hash } from 'lucide-react';

const SYMBOL_CATEGORIES = [
  { 
    name: '常用表情 (Emoji)', 
    symbols: ['😀', '😂', '😅', '😊', '😍', '😒', '😘', '😩', '😭', '😤', '😡', '👍', '👎', '👏', '🙏', '🔥', '✨', '🌟', '💧', '💤', '💩', '🎉', '🎁', '💡', '🚀', '✅', '❌', '❤️', '💔'] 
  },
  { 
    name: '数学逻辑思维 (Math)', 
    symbols: ['∀', '∁', '∂', '∃', '∄', '∅', '∆', '∇', '∈', '∉', '∊', '∋', '∌', '∍', '∎', '∏', '∐', '∑', '−', '∓', '∔', '∕', '∖', '∗', '∘', '√', '∛', '∜', '∝', '∞', '∟', '∠', '∡', '∢', '∣', '∤', '∥', '∦', '∧', '∨', '∩', '∪'] 
  },
  { 
    name: '方向与箭头指引 (Arrows)', 
    symbols: ['←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '↚', '↛', '↜', '↝', '↞', '↟', '↠', '↡', '↢', '↣', '↤', '↥', '↦', '⧼', '⧽', '➔', '➕', '➖', '➗', '✖', '🔺', '🔻', '▶', '◀'] 
  },
  { 
    name: '符号标识与版权 (Marks)', 
    symbols: ['©', '®', '™', '℠', '℗', '§', '¶', '‡', '†', '•', '‣', '⁃', '※', '‼', '‽', '‾', '‿', '⁀', '⁁', '⁂', '⁃', '⁄', '⁆', '✓', '✔', '✗', '✘', '⊕', '⊖', '⊗', '⊘'] 
  },
  { 
    name: '全球货币单位 (Currency)', 
    symbols: ['¥', '$', '€', '£', '¢', '₩', '฿', '₽', '₹', '₺', '℃', '℉', '‰', '‱', '㎎', '㎏', '㎜', '㎝', '㎞', '㎡', '㎥', '㏎', '㏑', '㏒', '㏕'] 
  },
  { 
    name: '花边装饰星星 (Stars)', 
    symbols: ['★', '☆', '✡', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⁂', '⁎', '⁑', '❁', '❀', '✿', '✾', '✽', '💮', '🌸', '🏵️', '🌹', '🌺', '🌻', '🌼', '🌷'] 
  },
  { 
    name: '标点及括号集 (Brackets)', 
    symbols: ['「', '」', '『', '』', '【', '】', '《', '》', '〈', '〉', '〔', '〕', '‖', '—', '…', '！', '？', '；', '：', '、', '。', '，', '“', '”', '‘', '’'] 
  }
];

export default function SymbolLibrary() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredCategories = SYMBOL_CATEGORIES.map(category => ({
    ...category,
    symbols: category.symbols.filter(symbol => 
      !search || symbol.toLowerCase().includes(search.toLowerCase()) || category.name.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.symbols.length > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center shrink-0">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">特殊符号与 Emoji 大全</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              无需费力在输入法中翻找，一键点击复制全网覆盖面最广的特殊文本与表情图库。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="p-6 border-b border-[#e2e8f0] bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-72">
             <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="尝试检索：Emoji / 货币..."
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
             />
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-10 min-h-[500px]">
          {filteredCategories.length === 0 ? (
             <div className="text-center py-20 text-slate-400">
               没找到符合条件的符号，换个关键词试试吧。
             </div>
          ) : (
            filteredCategories.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-pink-400" />
                  {category.name}
                  <span className="text-xs font-normal bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-auto">
                     {category.symbols.length} 个
                  </span>
                </h3>
                
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-2 sm:gap-3">
                  {category.symbols.map((symbol, sIndex) => (
                    <button
                      key={sIndex}
                      onClick={() => copyToClipboard(symbol)}
                      title="点击提取复制"
                      className="aspect-square flex items-center justify-center text-xl sm:text-2xl border border-slate-200 rounded-xl hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-all hover:scale-110 active:scale-95 shadow-sm group relative"
                    >
                      {symbol}
                      {copiedText === symbol && (
                        <div className="absolute inset-0 bg-green-500/90 rounded-xl flex items-center justify-center z-10 text-white animate-in zoom-in spin-in-12 duration-200">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">特殊符号与 Emoji 表情大全，一键复制的排版文案图库</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          在新媒体文案撰写、小红书图文长篇幅排版抑或是前端开发进行界面 Icon 占位测试时，寻找一个能完美对应语境的特殊货币符号或心仪的花朵箭头，常常需要在输入法中翻阅几十页才能获取。这个分门别类的全景表情屋将解放您的右键查询操作。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么推荐在此进行长尾符号搜罗？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 无需键盘唤醒的宽幅图库：</strong>
            <span>在原生系统中唤醒 Emoji 画板常常受制于输入法卡顿且分类粗糙。此工具画板预置了常驻网页端的大体量矩阵合集，并且提供直接的一键单发复制操作（配合左键点选拷贝动画），在重度网编操作中行云流水。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 兼顾感性文案与理工科研：</strong>
            <span>除了为美编等文艺内容准备的星星装饰、颜文字脸谱，我们也一并收录了极其难拼打的偏门“物理高等数学推导符号”（如微积分、求和矩阵等），为论文撰稿人和知乎深度回答从业者提供后盾。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 规避系统乱码：</strong>
            <span>在这里提取出来并挂载上剪切板的全为基于全球通用 Unicode 标准的原生代码字符转换，并非图片贴图格式。这保障了它们在发送到绝大多数主流系统甚至古老文档时，皆能维持文本本质结构。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          版面说明：随着微信苹果系统版本库每年的更新推进，会有少部分新添加的极罕见 Emoji 如果在旧版本的 Win 操作系统的浏览器中渲染可能会出现空心方块，这属于本地域字库尚未覆盖正常表现。
        </p>
      </div>
    </div>
  );
}
