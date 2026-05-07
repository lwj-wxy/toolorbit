const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('missing_keys.json', 'utf8'));

// Helper to split camel case
function camelToTitleCase(text) {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Translations mapping for common words to Chinese
const zhMap = {
  title: "标题", subtitle: "副标题", inputLabel: "输入", outputLabel: "输出",
  placeholder: "提示", copyBtn: "复制", copiedBtn: "已复制", clearBtn: "清除",
  downloadBtn: "下载", selectBtn: "选择文件", generateBtn: "生成", errorMsg: "错误",
  searchPlaceholder: "搜索工具...", logoName: "ToolOrbit", navTools: "在线工具",
  mobileMenu: "导航菜单", footerText: "© 2026 ToolOrbit.site"
};

function generate(obj, lang) {
  let result = {};
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = generate(obj[key], lang);
    } else {
      let isEn = lang === 'en';
      if (isEn) {
         if (key === 'logoName') result[key] = 'ToolOrbit';
         else if (key === 'navTools') result[key] = 'Online Tools';
         else if (key === 'searchPlaceholder') result[key] = 'Search tools...';
         else if (key === 'mobileMenu') result[key] = 'Navigation';
         else if (key === 'footerText') result[key] = '© 2026 ToolOrbit.site';
         else result[key] = camelToTitleCase(key);
      } else {
         if (zhMap[key]) {
             result[key] = zhMap[key];
         } else {
             // For others, just use a dummy or basic guess, or leave it to be fixed
             result[key] = isEn ? camelToTitleCase(key) : camelToTitleCase(key) + " (中)";
         }
      }
    }
  }
  return result;
}

const en = generate(missing, 'en');
const zh = generate(missing, 'zh');

// Add specific tool names and descriptions we already have
const rawEn = fs.readFileSync('src/locales/en.json', 'utf8');
const oldEn = JSON.parse(rawEn);

// Merge them
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

const mergedEn = deepMerge(en, oldEn);

// Now for zh
const rawZh = fs.readFileSync('src/locales/zh.json', 'utf8');
const oldZh = JSON.parse(rawZh);
const mergedZh = deepMerge(zh, oldZh);

fs.writeFileSync('src/locales/en.json', JSON.stringify(mergedEn, null, 2));
fs.writeFileSync('src/locales/zh.json', JSON.stringify(mergedZh, null, 2));

console.log("Locales written!");
