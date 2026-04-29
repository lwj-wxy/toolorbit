import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Type, Copy, Check, Hash } from 'lucide-react';

export default function SymbolLibrary() {
  const { t } = useTranslation();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const SYMBOL_CATEGORIES = useMemo(() => [
    { 
      id: 'emoji',
      name: t('tools.symbol-library.categories.emoji'), 
      symbols: ['😀', '😂', '😅', '😊', '😍', '😒', '😘', '😩', '😭', '😤', '😡', '👍', '👎', '👏', '🙏', '🔥', '✨', '🌟', '💧', '💤', '💩', '🎉', '🎁', '💡', '🚀', '✅', '❌', '❤️', '💔'] 
    },
    { 
      id: 'math',
      name: t('tools.symbol-library.categories.math'), 
      symbols: ['∀', '∁', '∂', '∃', '∄', '∅', '∆', '∇', '∈', '∉', '∊', '∋', '∌', '∍', '∎', '∏', '∐', '∑', '−', '∓', '∔', '∕', '∖', '∗', '∘', '√', '∛', '∜', '∝', '∞', '∟', '∠', '∡', '∢', '∣', '∤', '∥', '∦', '∧', '∨', '∩', '∪'] 
    },
    { 
      id: 'arrows',
      name: t('tools.symbol-library.categories.arrows'), 
      symbols: ['←', '↑', '→', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '↚', '↛', '↜', '↝', '↞', '↟', '↠', '↡', '↢', '↣', '↤', '↥', '↦', '⧼', '⧽', '➔', '➕', '➖', '➗', '✖', '🔺', '🔻', '▶', '◀'] 
    },
    { 
      id: 'marks',
      name: t('tools.symbol-library.categories.marks'), 
      symbols: ['©', '®', '™', '℠', '℗', '§', '¶', '‡', '†', '•', '‣', '⁃', '※', '‼', '‽', '‾', '‿', '⁀', '⁁', '⁂', '⁃', '⁄', '⁆', '✓', '✔', '✗', '✘', '⊕', '⊖', '⊗', '⊘'] 
    },
    { 
      id: 'currency',
      name: t('tools.symbol-library.categories.currency'), 
      symbols: ['¥', '$', '€', '£', '¢', '₩', '฿', '₽', '₹', '₺', '℃', '℉', '‰', '‱', '㎎', '㎏', '㎜', '㎝', '㎞', '㎡', '㎥', '㏎', '㏑', '㏒', '㏕'] 
    },
    { 
      id: 'stars',
      name: t('tools.symbol-library.categories.stars'), 
      symbols: ['★', '☆', '✡', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⁂', '⁎', '⁑', '❁', '❀', '✿', '✾', '✽', '💮', '🌸', '🏵️', '🌹', '🌺', '🌻', '🌼', '🌷'] 
    },
    { 
      id: 'brackets',
      name: t('tools.symbol-library.categories.brackets'), 
      symbols: ['「', '」', '『', '』', '【', '】', '《', '》', '〈', '〉', '〔', '〕', '‖', '—', '…', '！', '？', '；', '：', '、', '。', '，', '“', '”', '‘', '’'] 
    }
  ], [t]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredCategories = useMemo(() => SYMBOL_CATEGORIES.map(category => ({
    ...category,
    symbols: category.symbols.filter(symbol => 
      !search || symbol.toLowerCase().includes(search.toLowerCase()) || category.name.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.symbols.length > 0), [SYMBOL_CATEGORIES, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center shrink-0">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.symbol-library.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.symbol-library.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-[#e2e8f0] bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-72">
             <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('tools.symbol-library.searchPlaceholder')}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
             />
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-10 min-h-[500px]">
          {filteredCategories.length === 0 ? (
             <div className="text-center py-20 text-slate-400">
               {t('tools.symbol-library.noResults')}
             </div>
          ) : (
            filteredCategories.map((category, index) => (
              <div key={category.id} className="space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-pink-400" />
                  {category.name}
                  <span className="text-xs font-normal bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-auto">
                     {category.symbols.length} {t('tools.symbol-library.countSuffix')}
                  </span>
                </h3>
                
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-2 sm:gap-3">
                  {category.symbols.map((symbol, sIndex) => (
                    <button
                      key={sIndex}
                      onClick={() => copyToClipboard(symbol)}
                      title={t('tools.symbol-library.copyTooltip')}
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.symbol-library.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.symbol-library.seoDesc')}
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.symbol-library.seoHighlightsTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.symbol-library.highlight1Title')}</strong>
            <span>{t('tools.symbol-library.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.symbol-library.highlight2Title')}</strong>
            <span>{t('tools.symbol-library.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.symbol-library.highlight3Title')}</strong>
            <span>{t('tools.symbol-library.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          {t('tools.symbol-library.seoFooter')}
        </p>
      </div>
    </div>
  );
}
