import { useState } from 'react';
import { Banknote, Copy, Check } from 'lucide-react';

const upperNumbers = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const upperUnits = ['', '拾', '佰', '仟'];
const bigUnits = ['', '万', '亿', '兆'];
const decimals = ['角', '分'];

function convertToRMB(amount: string): string {
  if (!amount) return '';
  const num = parseFloat(amount.replace(/,/g, ''));
  if (isNaN(num)) return '请输入有效的数字';
  if (num >= 9999999999999.99) return '数字过大，无法转换';
  if (num === 0) return '零元整';

  const parts = Number(num).toFixed(2).split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  let result = '';

  // Process integer part
  if (parseInt(intPart, 10) > 0) {
    let zeroCount = 0;
    for (let i = 0; i < intPart.length; i++) {
       const p = intPart.length - i - 1;
       const digit = parseInt(intPart[i], 10);
       const quotient = Math.floor(p / 4);
       const remainder = p % 4;

       if (digit === 0) {
          zeroCount++;
       } else {
          if (zeroCount > 0) {
             result += upperNumbers[0];
          }
          zeroCount = 0;
          result += upperNumbers[digit] + upperUnits[remainder];
       }

       if (remainder === 0 && zeroCount < 4) {
          result += bigUnits[quotient];
       }

       if (remainder === 0) {
          zeroCount = 0;
       }
    }
    result += '元';
  }

  // Process decimal part
  if (decPart === '00') {
    result += '整';
  } else {
    for (let i = 0; i < decPart.length; i++) {
        const digit = parseInt(decPart[i], 10);
        if (digit !== 0) {
           result += upperNumbers[digit] + decimals[i];
        } else if (i === 0 && decPart[1] !== '0' && intPart !== '0') {
           result += '零';
        }
    }
  }

  return result || '零元整';
}

export default function RmbConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const formatInput = (val: string) => {
    // Only allow numbers and one decimal dot
    const clean = val.replace(/[^\d.]/g, '');
    const dotIndex = clean.indexOf('.');
    if (dotIndex !== -1) {
       return clean.slice(0, dotIndex + 1) + clean.slice(dotIndex + 1).replace(/\./g, '').substring(0, 2);
    }
    // limit max length roughly 13 digits
    return clean.substring(0, 13);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setInput(formatInput(e.target.value));
  };

  const output = convertToRMB(input);

  const copyToClipboard = () => {
    if (!output || output.includes('无法转换') || output.includes('有效')) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">人民币大写转换</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              一键将阿拉伯数字金额翻译为规范的中华财务报销、合同书写大写金额格式。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8">
           <label className="block text-sm font-bold text-slate-700 mb-4">输入金额数字 (阿拉伯数字)</label>
           <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">¥</span>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="例如: 12345.67"
                className="w-full pl-10 pr-4 py-4 text-2xl font-mono border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-slate-300"
              />
           </div>
           
           <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                 {[100, 1000, 10000, 100000, 1000000].map(val => (
                    <button
                      key={val}
                      onClick={() => setInput(val.toString())}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 rounded-lg text-sm font-medium transition-colors"
                    >
                       快速填入: ¥{val.toLocaleString()}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="bg-slate-50 rounded-2xl shadow-inner border border-[#cbd5e1] p-6 lg:p-8 relative">
           <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-slate-700">财务标准大写结果</label>
              <button 
                onClick={copyToClipboard}
                disabled={!input}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 shadow-sm text-red-600 hover:bg-red-50 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制结果'}
              </button>
           </div>
           <div className="min-h-[120px] flex items-center justify-center p-6 bg-white border-2 border-red-100 rounded-xl">
              <span className={`text-2xl lg:text-3xl font-bold tracking-widest text-center ${input ? 'text-red-700' : 'text-slate-300'}`}>
                 {input ? output : '待输入...'}
              </span>
           </div>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">人民币大写强制转换器，杜绝合同账单金额涂改漏洞</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          在我们签署正规的商业合同、借款欠条或是填写银行转账对账单时，必须强制附带标准的汉字大写金额（如 壹、贰、叁）。这是因为常规的阿拉伯数字极其容易受到后来者的笔画涂改（例如把“1”画改成“7”，把“3”改成“8”）。但繁杂生僻的大写汉字让很多人提笔忘字，这款轻量的文本转换工具能瞬间助您写出天衣无缝的标准财务体。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">深入大写转化器在合规记账中的标准原则：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 空零位智能推导补全：</strong>
            <span>金额的书写远不是“照拼音翻译”那么简单。当遇到如 1001.5 这样的数字时，系统会自动将中间的空洞填充并优化语法为“壹仟零壹元伍角”，完美贴合银行对于中文借记金额连词的强制校验逻辑。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 圆满的角分“整”字关门：</strong>
            <span>如果在您的发票或账目输入中不存在小数点后的角与分，组件除了给到正确的整数域外，会在最终的结尾自动补上一个“整”或“正”字。这在会计法中，是防止不法分子伺机填补小数尾数的防火墙。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 规避系统乱码与隐私审计：</strong>
            <span>您可以放心地把你公司上亿级别或者附带薪资隐私的敏感流水在这里计算。该工具通过原生的 JS 语法拦截剥离技术在浏览器内核沙盒中直接渲染结果，任何外力均无法拦截或监听您的大额账面转账意图。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          填报提示：生成的汉字字符诸如“零、壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿”等，已经符合绝大部分国家和区域性银行柜台的标准手签报备规范。可以直接双击点选复制贴入您的 PDF 或 Word 电子合同中。
        </p>
      </div>

    </div>
  );
}
