import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TOOLS, Category } from '../data/tools';

const getCategoryStyles = (category: Category) => {
  switch(category) {
    case '开发者工具': return { bg: 'bg-[#f0f9ff]', icon: 'text-[#0ea5e9]', tagBg: 'bg-[#dcfce7]', tagText: 'text-[#166534]', tag: 'DEV' };
    case '站长工具': return { bg: 'bg-[#f3e8ff]', icon: 'text-[#a855f7]', tagBg: 'bg-[#f3e8ff]', tagText: 'text-[#6b21a8]', tag: 'NET' };
    case '文本排版': return { bg: 'bg-[#eff6ff]', icon: 'text-[#3b82f6]', tagBg: 'bg-[#dbeafe]', tagText: 'text-[#1e40af]', tag: 'TXT' };
    case '生成器': return { bg: 'bg-[#fff7ed]', icon: 'text-[#f97316]', tagBg: 'bg-[#fef9c3]', tagText: 'text-[#854d0e]', tag: 'GEN' };
    case '电商工具': return { bg: 'bg-[#f0fdf4]', icon: 'text-[#22c55e]', tagBg: 'bg-[#f1f5f9]', tagText: 'text-[#475569]', tag: 'ECOMMERCE' };
    case 'PDF工具': return { bg: 'bg-[#fef2f2]', icon: 'text-[#ef4444]', tagBg: 'bg-[#fee2e2]', tagText: 'text-[#b91c1c]', tag: 'PDF' };
    case '图片处理': return { bg: 'bg-[#ecfeff]', icon: 'text-[#0891b2]', tagBg: 'bg-[#cffafe]', tagText: 'text-[#155e75]', tag: 'IMAGE' };
    case '计算转换': return { bg: 'bg-[#f5f3ff]', icon: 'text-[#7c3aed]', tagBg: 'bg-[#ede9fe]', tagText: 'text-[#5b21b6]', tag: 'CALC' };
    default: return { bg: 'bg-[#f0fdf4]', icon: 'text-[#22c55e]', tagBg: 'bg-[#f1f5f9]', tagText: 'text-[#475569]', tag: 'OTHER' };
  }
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') as Category | null;
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [filteredTools, setFilteredTools] = useState(TOOLS);

  useEffect(() => {
    let result = TOOLS;
    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter);
    }
    if (searchQuery) {
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchQuery) || 
        t.description.toLowerCase().includes(searchQuery)
      );
    }
    setFilteredTools(result);
  }, [categoryFilter, searchQuery]);

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-[24px]">
        <h2 className="text-[20px] font-bold text-[#1e293b]">
          {categoryFilter ? `${categoryFilter}` : '热门推荐'}
        </h2>
        <span className="text-[13px] text-[#94a3b8] ml-3 hidden sm:inline">
          {categoryFilter 
            ? `为您精选的 ${categoryFilter} 集合`
            : 'ToolOrbit 每日精选最常用的效率工具'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
        {filteredTools.map((tool) => {
          const styles = getCategoryStyles(tool.category);
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className="bg-white border border-[#e2e8f0] rounded-[12px] p-[20px] transition-all duration-200 cursor-pointer flex flex-col gap-[12px] hover:-translate-y-[2px] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:border-[#cbd5e1] group"
            >
              <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center ${styles.bg} ${styles.icon}`}>
                <tool.icon size={22} strokeWidth={2} />
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-[15px] font-semibold text-[#334155] mb-[4px] group-hover:text-[#2563eb] transition-colors">{tool.name}</h3>
                <p className="text-[12px] text-[#64748b] leading-[1.4] line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-auto pt-2">
                <span className={`inline-block px-[8px] py-[2px] rounded-[4px] text-[10px] uppercase font-bold ${styles.tagBg} ${styles.tagText}`}>
                  {styles.tag}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-[#1e293b]">没有找到相关工具</h3>
          <p className="mt-1 text-sm text-[#64748b]">
            我们未能找到与您搜索匹配的工具，请尝试其他关键词。
          </p>
        </div>
      )}
    </div>
  );
}
