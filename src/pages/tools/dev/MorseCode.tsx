import React, { useState } from 'react';
import { Radio, Copy, CheckCircle2, Trash2, Info, ArrowLeftRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.-..-.'
};

const REVERSE_MORSE: Record<string, string> = Object.entries(MORSE_MAP).reduce((acc, [char, code]) => {
  acc[code] = char;
  return acc;
}, {} as Record<string, string>);

export default function MorseCode() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [morse, setMorse] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedMorse, setCopiedMorse] = useState(false);

  const encode = (str: string) => {
    return str.toUpperCase().split('').map(char => {
      if (char === ' ') return '/';
      return MORSE_MAP[char] || char;
    }).join(' ');
  };

  const decode = (code: string) => {
    return code.trim().split(/\s+/).map(symbol => {
      if (symbol === '/') return ' ';
      return REVERSE_MORSE[symbol] || symbol;
    }).join('');
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setMorse(encode(val));
  };

  const handleMorseChange = (val: string) => {
    setMorse(val);
    setText(decode(val));
  };

  const copyToClipboard = (val: string, type: 'text' | 'morse') => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    if (type === 'text') {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedMorse(true);
      setTimeout(() => setCopiedMorse(false), 2000);
    }
  };

  const handleClear = () => {
    setText('');
    setMorse('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 sm:p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-200 text-white transform -rotate-3">
                <Radio size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {t('tools.morse-code.title')}
                </h1>
                <p className="text-slate-500 font-medium">
                  {t('tools.morse-code.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-red-100"
            >
              <Trash2 size={18} />
              {t('tools.morse-code.clearBtn')}
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="p-8 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,80px,1fr] gap-0 items-stretch relative">
            
            {/* Plain Text Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  {t('tools.morse-code.textLabel')}
                </label>
                <button
                  onClick={() => copyToClipboard(text, 'text')}
                  className={`p-2 rounded-xl transition-all ${
                    copiedText ? 'bg-emerald-50 text-emerald-600' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                >
                  {copiedText ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={t('tools.morse-code.textPlaceholder')}
                className="w-full h-80 p-8 text-xl font-bold bg-slate-50 border-2 border-transparent focus:border-amber-200 focus:bg-white rounded-[2rem] transition-all resize-none outline-none leading-relaxed text-slate-800 placeholder:text-slate-200"
              />
            </div>

            {/* Middle Divider */}
            <div className="flex flex-col items-center justify-center py-8 lg:py-0">
              <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl shadow-md flex items-center justify-center text-amber-500 z-10">
                <ArrowLeftRight size={28} className="animate-pulse" />
              </div>
              <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-slate-50/50 rounded-full"></div>
            </div>

            {/* Morse Code Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                  {t('tools.morse-code.morseLabel')}
                </label>
                <button
                  onClick={() => copyToClipboard(morse, 'morse')}
                  className={`p-2 rounded-xl transition-all ${
                    copiedMorse ? 'bg-emerald-50 text-emerald-600' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                >
                  {copiedMorse ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <textarea
                value={morse}
                onChange={(e) => handleMorseChange(e.target.value)}
                placeholder={t('tools.morse-code.morsePlaceholder')}
                className="w-full h-80 p-8 text-3xl font-mono bg-slate-900 border-2 border-transparent focus:border-amber-500/30 rounded-[2rem] transition-all resize-none outline-none text-amber-400 tracking-[0.1em] leading-[1.8] placeholder:text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Info Guide */}
        <div className="bg-slate-900 px-8 py-10 sm:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5 max-w-2xl">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                <Info size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  {t('tools.morse-code.guideTitle')}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('tools.morse-code.guideDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-amber-400 font-mono text-xl">.</span>
                <span className="text-[10px] text-slate-500 uppercase font-black">Dot</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-amber-400 font-mono text-xl">-</span>
                <span className="text-[10px] text-slate-500 uppercase font-black">Dash</span>
              </div>
              <div className="w-px h-10 bg-slate-800 mx-2"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-amber-400 font-mono text-xl">/</span>
                <span className="text-[10px] text-slate-500 uppercase font-black">Word</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
