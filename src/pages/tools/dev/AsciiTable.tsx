import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Check, Copy, Hash } from 'lucide-react';

const CONTROL_CHARS: Record<number, string> = {
  0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 
  4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
  8: 'BS', 9: 'HT', 10: 'LF', 11: 'VT', 
  12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
  16: 'DLE', 17: 'DC1', 18: 'DC2', 
  19: 'DC3', 20: 'DC4', 21: 'NAK', 
  22: 'SYN', 23: 'ETB', 24: 'CAN', 25: 'EM', 
  26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 
  30: 'RS', 31: 'US', 127: 'DEL'
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
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const asciiData: AsciiRow[] = useMemo(() => {
    return Array.from({ length: 128 }, (_, i) => {
      const isControl = i < 32 || i === 127;
      let type = 'Symbol';
      if (isControl) type = 'Control';
      else if (i >= 48 && i <= 57) type = 'Number';
      else if ((i >= 65 && i <= 90) || (i >= 97 && i <= 122)) type = 'Letter';

      const charDisplay = isControl ? CONTROL_CHARS[i] : String.fromCharCode(i);
      const desc = isControl ? CONTROL_CHARS[i] : `Char ${charDisplay}`;

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
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Hash className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.ascii-table.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.ascii-table.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#e2e8f0] bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm outline-none"
              placeholder={t('tools.ascii-table.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {t('tools.ascii-table.resultsCount', { count: filteredData.length })}
          </div>
        </div>

        <div className="overflow-x-auto max-h-[700px] custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-[#f8fafc] sticky top-0 z-10 shadow-sm shadow-slate-100/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">{t('tools.ascii-table.colDec')}</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">{t('tools.ascii-table.colHex')}</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">{t('tools.ascii-table.colOct')}</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">{t('tools.ascii-table.colBin')}</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">{t('tools.ascii-table.colHtml')}</th>
                <th scope="col" className="px-6 py-4 text-center font-bold text-gray-600 uppercase tracking-wider">{t('tools.ascii-table.colChar')}</th>
                <th scope="col" className="px-6 py-4 text-left font-bold text-gray-600 uppercase tracking-wider">{t('tools.ascii-table.colDesc')}</th>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
