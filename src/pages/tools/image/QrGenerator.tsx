import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

export default function QrGenerator() {
  const [value, setValue] = useState('https://toolorbit.site');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
      
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            二维码生成器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            一键创建高质量、可定制颜色的二维码及纠错率。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">生成内容（网址、文本、手机号...）</label>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">二维码颜色</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-8 w-12 rounded cursor-pointer p-0 border-0"
                  />
                  <span className="text-sm font-mono text-gray-500 uppercase">{fgColor}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-12 rounded cursor-pointer p-0 border-0"
                  />
                  <span className="text-sm font-mono text-gray-500 uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">容错率设置</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'L'|'M'|'Q'|'H')}
                className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
              >
                <option value="L">低 (7%) - 适用于简单文本</option>
                <option value="M">中 (15%)</option>
                <option value="Q">中高 (25%)</option>
                <option value="H">高 (30%) - 适用于带Logo的二维码</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center">
          <div 
            ref={qrRef}
            className="p-4 rounded-xl shadow-sm border border-gray-100 mb-6 bg-white transition-all transform hover:scale-105"
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeCanvas
              value={value || 'https://toolorbit.site'}
              size={220}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              includeMargin={false}
            />
          </div>
          
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Download size={18} /> 导出为 PNG
          </button>
        </div>
      </div>
    </div>
  );
}
