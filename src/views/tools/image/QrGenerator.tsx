import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {t('tools.qr-generator.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {t('tools.qr-generator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900">{t('tools.qr-generator.contentLabel')}</h3>
          </div>

          <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.qr-generator.contentLabel')}</label>
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
                className="block h-32 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.qr-generator.fgColorLabel')}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
                  />
                  <span className="font-mono text-sm uppercase text-slate-500">{fgColor}</span>
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.qr-generator.bgColorLabel')}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
                  />
                  <span className="font-mono text-sm uppercase text-slate-500">{bgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.qr-generator.errorLevelLabel')}</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'L'|'M'|'Q'|'H')}
                className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500"
              >
                <option value="L">{t('tools.qr-generator.errorLevels.L')}</option>
                <option value="M">{t('tools.qr-generator.errorLevels.M')}</option>
                <option value="Q">{t('tools.qr-generator.errorLevels.Q')}</option>
                <option value="H">{t('tools.qr-generator.errorLevels.H')}</option>
              </select>
            </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900">{t('tools.qr-generator.title')}</h3>
            <LoadingButton
              isLoading={isDownloading}
              onClick={handleDownload}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              loadingText={t('tools.qr-generator.preparing') || 'Preparing...'}
              icon={<Download size={16} />}
            >
              {t('tools.qr-generator.downloadBtn')}
            </LoadingButton>
          </div>

        <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div 
            ref={qrRef}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-transform hover:scale-[1.02]"
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
        </div>
        </div>
      </div>

    </div>
  );
}
