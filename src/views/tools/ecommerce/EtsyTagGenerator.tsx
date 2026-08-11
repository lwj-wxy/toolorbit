import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag as TagIcon, Copy, Check, Plus, Trash2, RefreshCw } from 'lucide-react';

type EtsyTagGeneratorProps = {
  hideHeader?: boolean;
};

const DEFAULT_PRESET = 'Personalized leather tote bag with laptop sleeve and custom initials';

const EtsyTagGenerator = ({ hideHeader = false }: EtsyTagGeneratorProps) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState(DEFAULT_PRESET);
  const [tags, setTags] = useState<string[]>([
    'leather tote bag',
    'personalized tote',
    'custom work bag',
    'laptop compartment',
    'gift for graduate',
    'mothers day gift',
    'minimalist work bag',
    'full grain leather',
    'custom initials bag',
    'commuter handbag',
    'leather purse',
    'gift for her',
    'handcrafted tote',
  ]);
  const [newTagInput, setNewTagInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateTags = () => {
    if (!inputText.trim()) return;

    // Split words, extract phrases, filter by 20 char limit and unique words
    const words = inputText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 1);

    const generated: string[] = [];
    const usedWords = new Set<string>();

    // Step 1: Combine adjacent pairs
    for (let index = 0; index < words.length - 1; index += 1) {
      const phrase = `${words[index]} ${words[index + 1]}`;
      if (phrase.length <= 20 && !generated.includes(phrase)) {
        generated.push(phrase);
        usedWords.add(words[index]);
        usedWords.add(words[index + 1]);
      }
      if (generated.length >= 13) break;
    }

    // Step 2: Add remaining single words or combinations
    for (let index = 0; index < words.length; index += 1) {
      if (generated.length >= 13) break;
      const word = words[index];
      if (word.length <= 20 && !generated.includes(word)) {
        generated.push(word);
      }
    }

    // Step 3: Pad with common seller tags if under 13
    const fallbackTags = [
      'handmade gift',
      'personalized item',
      'custom craft',
      'gift for her',
      'unique present',
      'artisan quality',
      'custom order',
    ];

    for (const fallback of fallbackTags) {
      if (generated.length >= 13) break;
      if (!generated.includes(fallback)) {
        generated.push(fallback);
      }
    }

    setTags(generated.slice(0, 13));
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (tags.length >= 13) return;
    if (tags.includes(trimmed)) return;

    setTags([...tags, trimmed]);
    setNewTagInput('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleCopyAll = () => {
    const copyText = tags.join(', ');
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!hideHeader ? (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Etsy 13 Tag & Keyword Optimizer
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Generate and validate 13 Etsy listing tags under 20 characters per tag for instant Etsy backend copy-pasting.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
        {/* Left Form Panel */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Product Seed / Listing Title
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Product Title or Keywords
              </label>
              <textarea
                rows={3}
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder="Example: Personalized leather tote bag with laptop sleeve and custom initials"
                className="w-full resize-none rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateTags}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--app-text)] px-5 py-2.5 text-sm font-bold text-[var(--app-bg)] transition hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" />
              Generate & Verify 13 Tags
            </button>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Add Manual Custom Tag
            </h3>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                maxLength={20}
                value={newTagInput}
                onChange={(event) => setNewTagInput(event.target.value)}
                placeholder="Custom tag (max 20 chars)"
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={tags.length >= 13}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Character limit: {newTagInput.length}/20 characters
            </p>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                13 Etsy Backend Tags
              </h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {tags.length} / 13 Tags
            </span>
          </div>

          <div className="mt-5 space-y-2.5">
            {tags.map((tagItem, index) => {
              const charLength = tagItem.length;
              const isOverLimit = charLength > 20;

              return (
                <div
                  key={`${tagItem}-${index}`}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {tagItem}
                  </span>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {charLength}/20
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-slate-400 transition hover:text-red-600"
                      aria-label="Remove tag"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--app-text)] py-3 text-sm font-bold text-[var(--app-bg)] transition hover:opacity-90"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied 13 Tags!' : 'Copy All 13 Tags (Comma Formatted)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtsyTagGenerator;
