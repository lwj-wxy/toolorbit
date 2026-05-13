import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { LoadingButton } from '../../../components/ui/LoadingButton';

export default function QrGenerator() {
  const { t } = useTranslation();
  const [value, setValue] = useState('https://toolorbit.site');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    setIsDownloading(true);
    
    // Artificial delay for feedback
    await new Promise(resolve => setTimeout(resolve, 800));

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) {
      setIsDownloading(false);
      return;
    }

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
      
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    
    analytics.trackEvent({
      category: 'Image Tools',
      action: 'Download QR Code',
      label: level,
      metadata: { contentLength: value.length }
    });

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setIsDownloading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('tools.qr-generator.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('tools.qr-generator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('tools.qr-generator.contentLabel')}</label>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                  if (value) {
                    analytics.trackEvent({
                      category: 'Image Tools',
                      action: 'Generate QR Content',
                      value: value.length
                    });
                  }
                }}
                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tools.qr-generator.fgColorLabel')}</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tools.qr-generator.bgColorLabel')}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('tools.qr-generator.errorLevelLabel')}</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'L'|'M'|'Q'|'H')}
                className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
              >
                <option value="L">{t('tools.qr-generator.errorLevels.L')}</option>
                <option value="M">{t('tools.qr-generator.errorLevels.M')}</option>
                <option value="Q">{t('tools.qr-generator.errorLevels.Q')}</option>
                <option value="H">{t('tools.qr-generator.errorLevels.H')}</option>
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
          
          <LoadingButton
            isLoading={isDownloading}
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            loadingText={t('tools.qr-generator.preparing') || 'Preparing...'}
            icon={<Download size={18} />}
          >
            {t('tools.qr-generator.downloadBtn')}
          </LoadingButton>
        </div>
      </div>

      <ToolSEOCard toolKey="qr-generator" />
    </div>
  );
}
