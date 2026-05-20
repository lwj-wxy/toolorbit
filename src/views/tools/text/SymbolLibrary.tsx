import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Hash } from 'lucide-react';

export default function SymbolLibrary() {
  const { t } = useTranslation();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  const filteredCategories = useMemo(() => SYMBOL_CATEGORIES
    .filter(category => activeCategory === 'all' || category.id === activeCategory)
    .map(category => ({
      ...category,
      symbols: category.symbols.filter(symbol => 
        !search || symbol.toLowerCase().includes(search.toLowerCase()) || category.name.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(category => category.symbols.length > 0), [SYMBOL_CATEGORIES, activeCategory, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{t('tools.symbol-library.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {t('tools.symbol-library.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900">{t('tools.symbol-library.searchPlaceholder')}</h3>
          </div>

          <div className="flex h-[500px] flex-col gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('tools.symbol-library.searchPlaceholder')}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500"
            />
            <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`mb-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  activeCategory === 'all' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-600 hover:bg-white'
                }`}
              >
                <span>{t('common.allTools', { defaultValue: '全部符号' })}</span>
                <span>{SYMBOL_CATEGORIES.reduce((total, category) => total + category.symbols.length, 0)}</span>
              </button>
              {SYMBOL_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`mb-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    activeCategory === category.id ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Hash className="h-4 w-4 text-slate-400" />
                    {category.name}
                  </span>
                  <span>{category.symbols.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900">{t('tools.symbol-library.title')}</h3>
            <span className="font-mono text-sm text-slate-400">
              {filteredCategories.reduce((total, category) => total + category.symbols.length, 0)} {t('tools.symbol-library.countSuffix')}
            </span>
          </div>

          <div className="h-[500px] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
          {filteredCategories.length === 0 ? (
             <div className="flex h-full items-center justify-center text-center text-slate-400">
               {t('tools.symbol-library.noResults')}
             </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="mb-8 space-y-4 last:mb-0">
                <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                  <Hash className="w-4 h-4 text-cyan-600" />
                  {category.name}
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-normal text-slate-500">
                     {category.symbols.length} {t('tools.symbol-library.countSuffix')}
                  </span>
                </h3>
                
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-8 xl:grid-cols-10">
                  {category.symbols.map((symbol, sIndex) => (
                    <button
                      key={sIndex}
                      onClick={() => copyToClipboard(symbol)}
                      title={t('tools.symbol-library.copyTooltip')}
                      className="relative flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-white text-xl shadow-sm transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 active:scale-95 sm:text-2xl"
                    >
                      {symbol}
                      {copiedText === symbol && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-emerald-500/90 text-white animate-in zoom-in spin-in-12 duration-200">
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
      </div>
    </div>
  );
}
