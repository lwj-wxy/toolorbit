import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, RefreshCcw } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const COMMON_TIMEZONES = [
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Australia/Sydney',
  'UTC'
];

interface TimeBox {
  id: string;
  tz: string;
}

export default function TimeConverter() {
  const [baseTime, setBaseTime] = useState<string>(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [baseTz, setBaseTz] = useState<string>(dayjs.tz.guess() || 'Asia/Shanghai');
  const [timeBoxes, setTimeBoxes] = useState<TimeBox[]>([]);
  const [newTz, setNewTz] = useState<string>(COMMON_TIMEZONES[0]);

  useEffect(() => {
    // Add some default target zones if empty
    if (timeBoxes.length === 0) {
      const defaultTz = baseTz === 'Asia/Shanghai' ? 'America/New_York' : 'Asia/Shanghai';
      setTimeBoxes([{ id: Date.now().toString(), tz: defaultTz }]);
    }
  }, [baseTz, timeBoxes.length]);

  const addTimeBox = () => {
    if (timeBoxes.length >= 6) return;
    setTimeBoxes([...timeBoxes, { id: Date.now().toString(), tz: newTz }]);
  };

  const removeTimeBox = (id: string) => {
    setTimeBoxes(timeBoxes.filter(box => box.id !== id));
  };

  const handleSetCurrentTime = () => {
    setBaseTime(dayjs().format('YYYY-MM-DDTHH:mm'));
  };

  const parseBaseTime = () => {
    return dayjs.tz(baseTime, baseTz);
  };

  const validBase = parseBaseTime();
  const isValid = validBase.isValid();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">时间与时区转换器</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在各大主流时区之间快速转换时间，协助跨国协作排期规划。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Base Time Input */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-[#1e293b] flex items-center gap-2 text-lg">
                 基准时间设定
               </h3>
               <button 
                 onClick={handleSetCurrentTime}
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors border border-slate-200"
               >
                 <RefreshCcw className="w-4 h-4" /> 现在
               </button>
            </div>
            
            <div className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-[#475569] mb-2">选择您的基础时区</label>
                  <select
                    value={baseTz}
                    onChange={(e) => setBaseTz(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-orange-500"
                  >
                     {COMMON_TIMEZONES.map(tz => (
                       <option key={tz} value={tz}>{tz}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-bold text-[#475569] mb-2">输入时间</label>
                  <input
                    type="datetime-local"
                    value={baseTime}
                    onChange={(e) => setBaseTime(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-orange-500 text-slate-800"
                  />
               </div>

               {isValid && (
                 <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <div className="text-sm text-orange-800 font-medium mb-1">
                       Unix 时间戳 (毫秒)
                    </div>
                    <div className="font-mono text-lg text-orange-900 break-all select-all">
                       {validBase.valueOf()}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Target Timezones Preview */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                 <h3 className="font-bold text-[#1e293b] flex items-center gap-2 text-lg">
                    目标时区换算面板
                 </h3>
              </div>

              {!isValid ? (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                     请在左侧输入有效日期与时间
                  </div>
              ) : (
                 <div className="space-y-4 flex-1">
                    {timeBoxes.map((box) => {
                       const targetTime = validBase.tz(box.tz);
                       return (
                         <div key={box.id} className="relative group bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-orange-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                               <div className="font-bold text-slate-800">{box.tz}</div>
                               <button 
                                 onClick={() => removeTimeBox(box.id)}
                                 className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 <Trash2 className="w-5 h-5" />
                               </button>
                            </div>
                            <div className="text-2xl sm:text-3xl font-mono text-orange-600 font-bold mb-1">
                               {targetTime.format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 font-medium">
                               相对于此时区的时间差： {targetTime.utcOffset() / 60} 小时
                            </div>
                         </div>
                       );
                    })}

                    {timeBoxes.length < 6 && (
                       <div className="mt-8 p-5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                          <select
                             value={newTz}
                             onChange={(e) => setNewTz(e.target.value)}
                             className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 outline-none focus:border-orange-500"
                          >
                             {COMMON_TIMEZONES.map(tz => (
                               <option key={tz} value={tz}>{tz}</option>
                             ))}
                          </select>
                          <button 
                             onClick={addTimeBox}
                             className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg font-bold transition-colors"
                          >
                             <Plus className="w-5 h-5" /> 追加该时区
                          </button>
                       </div>
                    )}
                 </div>
              )}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线时区对比与会议换排工具，破除全球协作壁垒</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          在全球化办公以及跨国电竞、海外项目协同中，换算洛杉矶时间、伦敦时间或者北京时间常常让人抓狂，因为夏令时 (DST) 等政策会让单纯的心算加上或者减去固定小时数完全失效。利用这款具有校准基因的时间工具，能够一并消灭排期困扰。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握多维时间对照表的应用优势：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 对接全球地理时间体系：</strong>
            <span>内置了标准的世界各地标准时间片网络，在不需要任何时差换算公式背书的情况下，只要您在面板左侧给出一个“发车锚点”时间，右侧的对比列表瞬间就能翻译成各区域代表的当地时历。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 自适应计算底层的夏令时偏移：</strong>
            <span>本计算器采用的是实时且极高精准度的标准开源库时间轮子，您不必费心挂记北半球北美地区什么时候进入或结束夏令时间，系统会自动识别输入日期在其时区中是否属于 DST 并校正输出结果。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 附带 Unix 时间戳直出：</strong>
            <span>除了对普通用户十分友好的年-月-日可视化格式外，它也会非常硬核地在底部随动生成供程序员写入数据库使用的国际长整型毫秒级时间戳代码。为业务研发与日志回溯对比提供快捷通路。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          商务提示：若您在制定含有欧洲多国的全球视频联合会议之前使用本面板排期，请一定务必要留意不同子列表时区内的营业或睡眠时长碰撞节点。左侧提供快捷重置当前系统“本地时间”的归零点按钮供您多次沙盘推演。
        </p>
      </div>
    </div>
  );
}
