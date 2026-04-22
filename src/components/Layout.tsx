import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { TOOLS } from '../data/tools';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-[#1e293b] font-sans relative overflow-x-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-50/50 blur-[100px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex h-[64px] items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center gap-4 lg:gap-8 xl:gap-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 lg:gap-[10px] text-[18px] lg:text-[20px] font-extrabold text-blue-600 tracking-tight shrink-0">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[14px] lg:text-[16px] shadow-sm">
              Ω
            </div>
            ToolOrbit
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-stretch gap-1 lg:gap-2 h-full">
            {categories.map((category) => {
              const categoryTools = TOOLS.filter(t => t.category === category);
              const isActive = location.search.includes(category);
              
              return (
                <div key={category} className="group flex items-center h-full">
                  <Link
                    to={`/?category=${category}`}
                    className={cn(
                      "px-2 lg:px-3 flex items-center gap-1 h-full text-[14px] lg:text-[15px] font-bold transition-all duration-200 border-b-[3px] border-transparent mt-[3px] cursor-pointer whitespace-nowrap",
                      isActive ? "text-blue-600 border-blue-600" : "text-slate-600 group-hover:text-slate-900"
                    )}
                  >
                    {category}
                    <ChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-200 group-hover:rotate-180 text-slate-400" />
                  </Link>

                  {/* Mega Menu Full Width Dropdown */}
                  <div className="absolute top-[64px] left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-1 group-hover:translate-y-0 z-50">
                    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-8 gap-y-3 lg:gap-y-4">
                        {categoryTools.map(tool => (
                          <Link
                            key={tool.id}
                            to={tool.path}
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group/item"
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center flex-shrink-0 text-slate-500 group-hover/item:text-blue-600 group-hover/item:bg-blue-50 group-hover/item:border-blue-200 transition-colors">
                              <tool.icon size={20} strokeWidth={2} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[14px] font-bold text-slate-800 group-hover/item:text-blue-600 mb-1 truncate">{tool.name}</h4>
                              <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed">{tool.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center shrink-0">
          <div className="relative group hidden md:block w-[180px] lg:w-[240px] xl:w-[280px] mr-2">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search');
                window.location.href = `/?search=${query}`;
              }}
            >
              <Search
                className="absolute left-[14px] top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="search-field"
                className="w-full py-[8px] pr-[16px] pl-[38px] rounded-full border border-slate-200/80 bg-slate-50 text-[13px] outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-[3px] focus:ring-blue-500/10 placeholder:text-slate-400 text-slate-800"
                placeholder="搜索工具..."
                type="search"
                name="search"
                defaultValue={new URLSearchParams(useLocation().search).get('search') || ''}
              />
            </form>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-[300px] bg-white shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
              <span className="font-bold text-[18px] text-slate-900">导航菜单</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-md">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('search');
                  setMobileMenuOpen(false);
                  window.location.href = `/?search=${query}`;
                }}
                className="relative md:hidden"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="w-full py-2.5 pr-4 pl-9 rounded-lg border border-slate-200 bg-slate-50 text-[14px] outline-none focus:border-blue-500 focus:bg-white focus:ring-[2px] focus:ring-blue-500/10 placeholder:text-slate-400 text-black"
                  placeholder="搜索工具..."
                  type="search"
                  name="search"
                  defaultValue={new URLSearchParams(useLocation().search).get('search') || ''}
                />
              </form>

              {categories.map((category) => {
                const categoryTools = TOOLS.filter(t => t.category === category);
                return (
                  <div key={category} className="flex flex-col gap-3">
                    <h4 className="font-bold text-slate-900 text-[15px] border-b border-slate-200 pb-2">{category}</h4>
                    <div className="flex flex-col gap-2">
                       {categoryTools.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-2 px-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                        >
                          <tool.icon size={16} />
                          <span className="text-[14px] font-medium">{tool.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col min-w-0 relative z-10">
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>

      <footer className="bg-transparent py-8 flex items-center justify-center text-[13px] text-slate-400 mt-auto relative z-10">
        <p>© 2024 ToolOrbit.site - 专业的一站式效率工具聚合平台 | 备案号: 鄂ICP备20210001号-1</p>
      </footer>

    </div>
  );
}
