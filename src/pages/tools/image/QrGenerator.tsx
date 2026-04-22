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
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
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

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">QR Code 免费在线生成器：定制专属商业名片与链接转换</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          数字化时代，扫描已成为连接线下与线上、屏幕与移动端最有效率的桥梁。无论是您的微信个人主页、独立站营销落地页网址，甚至是一段简单的 Wi-Fi 连接指令，都能通过这款无需注册的在线工具一键编码为黑白矩阵。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握多维矩阵编码的独家亮点：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 无级微调色彩与容错：</strong>
            <span>打破传统黑白双色的单调！您可以自由定义前景和背景色以搭配自家品牌 VI 视觉。同时支持 L、M、Q、H 级别容错率切换，即便中心被 Logo 遮挡或遭到轻度信损，依然能被摄像头高精扫出。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 高清 PNG 矢量级导出：</strong>
            <span>一键输出的高保真位图可直接用于易拉宝海报印刷包装、商品防伪标贴或简历打印，边缘拒绝锯齿与模糊，保证多机型全天候的超高一次性扫码成功率。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 基于 Local 的轻量化极客安全：</strong>
            <span>当您将加密邮箱或家庭联络方式转化为阵列时可能充满隐私性担忧。本模块组件坚持无后台上传和截留政策，纯 JavaScript 计算绘图，闭网状态下依旧能够流畅产出结果图片。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          友情建议：进行前景色与背景色倒挂调整的时候，必须确保扫码枪和大部分手机摄像头的感光算法能够感知足够的极度对比色差，否则存在“废码”无法被光学读取的风险。
        </p>
      </div>

    </div>
  );
}
