import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const { t } = useTranslation();
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
    let uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"; 
    let lowercase = "abcdefghijkmnpqrstuvwxyz"; 
    let numbers = "23456789"; 
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
      setPassword(t('tools.password-generator.errorNoChars'));
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
    if (password === t('tools.password-generator.errorNoChars')) return;
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
    
    if (score < 3) return { label: t('tools.password-generator.strengthWeak'), color: 'text-rose-500', bar: 'w-1/4 bg-rose-500' };
    if (score < 5) return { label: t('tools.password-generator.strengthMedium'), color: 'text-amber-500', bar: 'w-2/4 bg-amber-500' };
    if (score < 7) return { label: t('tools.password-generator.strengthStrong'), color: 'text-emerald-500', bar: 'w-3/4 bg-emerald-500' };
    return { label: t('tools.password-generator.strengthVeryStrong'), color: 'text-blue-500', bar: 'w-full bg-blue-500' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{t('tools.password-generator.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {t('tools.password-generator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900">{t('tools.password-generator.adjustLength')}</h3>
          </div>

          <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    {t('tools.password-generator.lengthLabel')}: {length}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {t('tools.password-generator.strengthLabel')}: <span className={strength.color}>{strength.label}</span>
                  </span>
                </div>
                <input 
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-cyan-600"
                />
                <div className="flex justify-between pt-1 text-[10px] font-semibold uppercase text-slate-400">
                   <span>{t('tools.password-generator.lenShort')}</span>
                   <span>{t('tools.password-generator.lenNormal')}</span>
                   <span>{t('tools.password-generator.lenLong')}</span>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full transition-all duration-500 ${strength.bar}`} />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'uppercase', label: t('tools.password-generator.optUppercase') },
                  { id: 'lowercase', label: t('tools.password-generator.optLowercase') },
                  { id: 'numbers', label: t('tools.password-generator.optNumbers') },
                  { id: 'symbols', label: t('tools.password-generator.optSymbols') },
                  { id: 'excludeSimilar', label: t('tools.password-generator.optExcludeSimilar') }
                ].map(opt => (
                  <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-cyan-300">
                     <div className="relative">
                        <input 
                          type="checkbox"
                          checked={(options as any)[opt.id]}
                          onChange={(e) => setOptions(prev => ({ ...prev, [opt.id]: e.target.checked }))}
                          className="peer sr-only"
                        />
                        <div className="h-5 w-5 rounded border-2 border-slate-300 transition-all peer-checked:border-cyan-600 peer-checked:bg-cyan-600" />
                        <Check className="absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 transition-all peer-checked:opacity-100" />
                     </div>
                     <span className="text-sm font-medium text-slate-600">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900">{t('tools.password-generator.title')}</h3>
            <div className="flex gap-2">
              <button
                onClick={generatePassword}
                className="rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-cyan-700"
                title={t('tools.password-generator.refreshTitle')}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  copied ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t('tools.password-generator.copiedBtn') : t('tools.password-generator.copyBtn')}
              </button>
            </div>
          </div>

          <div className="flex h-[500px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="w-full break-all text-center font-mono text-2xl font-semibold tracking-wide text-slate-900 md:text-4xl">
              {password}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
