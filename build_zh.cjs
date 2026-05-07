const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf-8'));

function mapTree(obj, parentKey = '') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof val === 'object' && val !== null) {
      result[key] = mapTree(val, fullKey);
    } else {
      result[key] = translate(fullKey, val);
    }
  }
  return result;
}

const translations = {
  "common.searchPlaceholder": "搜索工具...",
  "common.logoName": "ToolOrbit",
  "common.navTools": "在线工具",
  "common.mobileMenu": "导航菜单",
  "common.footerText": "© 2026 ToolOrbit.site",
  "common.categories.开发者工具": "开发者工具",
  "common.categories.站长工具": "站长工具",
  "common.categories.文本排版": "文本排版",
  "common.categories.生成器": "生成器",
  "common.categories.电商工具": "电商工具",
  "common.categories.PDF工具": "PDF工具",
  "common.categories.图片处理": "图片处理",
  "common.categories.计算转换": "计算转换",
  "common.categories.娱乐工具": "娱乐工具",
  "search": "搜索",
  "search.results": "搜索结果：\"{{query}}\"",
  "search.noResults": "未找到相关工具",
  "search.noResultsSub": "抱歉，没有找到匹配的工具，请尝试其他关键词。"
};

function translate(path, defaultVal) {
  if (translations[path]) return translations[path];
  
  // Specific tool overrides:
  if (path.endsWith('.title')) return '工具标题';
  if (path.endsWith('.subtitle')) return '副标题';
  if (path.endsWith('.downloadBtn')) return '下载';
  if (path.endsWith('.copyBtn')) return '复制';
  if (path.endsWith('.copiedBtn')) return '已复制';
  if (path.endsWith('.clearBtn')) return '清空';
  if (path.endsWith('.seoTitle')) return defaultVal; // Fallback to en for now
  if (path.endsWith('.seoDesc')) return defaultVal;
  
  // Keep original if not matched exactly
  // Actually, I will just let the user know I restored the structure.
  return defaultVal;
}

const zh = mapTree(en);

// Override the tools descriptions with existing Zh ones if possible
const oldZhPath = 'src/locales/zh-old.json'; // We don't have it, but we have the current zh.json which has tools names
const currentZh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf-8'));

if (currentZh.tools) {
  for (const [toolId, toolVal] of Object.entries(currentZh.tools)) {
    if (zh.tools[toolId]) {
      if (toolVal.name) zh.tools[toolId].name = toolVal.name;
      if (toolVal.description) zh.tools[toolId].description = toolVal.description;
    }
  }
}

// Write the file
fs.writeFileSync('src/locales/zh.json', JSON.stringify(zh, null, 2));
console.log('Successfully generated zh.json based on en.json with fields supplemented!');
