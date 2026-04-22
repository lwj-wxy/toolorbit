const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src/pages/tools', (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Update Header Card
  const headerVariants = [
    'className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between"',
    'className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8"',
    'className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between"',
    'className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"'
  ];

  headerVariants.forEach(cls => {
    content = content.replace(cls, 'className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"');
  });

  // Also catch variations with newlines
  content = content.replace(/className="bg-white rounded-2xl shadow-sm border border-\[#e2e8f0\] p-6 lg:p-8 flex items-center justify-between"/g, 
                            'className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"');

  // Update Main Card classes slightly
  content = content.replace(/shadow-sm border border-\[#e2e8f0\]/g, 'shadow-sm border border-slate-200/80');

  // Update SEO Card
  const seoVariants = [
    'className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8"',
    'className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 mt-8"',
    'className="bg-slate-50 rounded-2xl p-8 lg:p-12 mt-8"'
  ];

  seoVariants.forEach(cls => {
    content = content.replace(cls, 'className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mt-12 mb-12 bg-gradient-to-b from-white/50 to-transparent"');
  });
  
  content = content.replace(/className="text-2xl font-bold text-\[#1e293b\]"/g, 'className="text-3xl font-bold tracking-tight text-slate-900"');
  content = content.replace(/className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"/g, 'className="text-3xl font-bold tracking-tight text-slate-900"');
  content = content.replace(/className="text-2xl font-bold text-gray-900"/g, 'className="text-3xl font-bold tracking-tight text-slate-900"');

  if (content !== fs.readFileSync(filePath, 'utf-8')) {
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
});
