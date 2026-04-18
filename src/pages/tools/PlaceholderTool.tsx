import React from 'react';
import { Settings2 } from 'lucide-react';

interface Props {
  title: string;
}

export default function PlaceholderTool({ title }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden flex flex-col items-center justify-center p-16 text-center min-h-[500px]">
      <div className="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-2xl flex items-center justify-center mb-6">
        <Settings2 className="w-10 h-10 animate-spin-slow" />
      </div>
      <h2 className="text-2xl font-extrabold text-[#1e293b] mb-4">{title}</h2>
      <p className="text-[#64748b] max-w-md leading-relaxed">
        这个工具正在火速开发中。如果您需要此功能，请持续关注我们的后续更新。
      </p>
    </div>
  );
}
