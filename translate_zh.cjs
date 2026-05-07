const fs = require('fs');

const zhMap = {
  // Common action buttons
  clearBtn: "清空",
  downloadBtn: "下载",
  selectBtn: "选择文件",
  copyBtn: "复制",
  copiedBtn: "已复制",
  generateBtn: "生成",
  resetBtn: "重置",
  decodeBtn: "解码",
  encodeBtn: "编码",
  swapBtn: "交换",
  reselectBtn: "重新选择",
  
  // Common labels & headings
  title: "工具标题",
  subtitle: "副标题说明",
  inputLabel: "输入内容",
  outputLabel: "输出结果",
  settingsTitle: "工具设置",
  detailsTitle: "详细信息",
  resultTitle: "处理结果",
  previewTitle: "效果预览",
  placeholder: "请输入...",
  
  // Common errors
  errorMsg: "发生错误",
  invalidFormat: "格式无效",
  unknownError: "未知错误",
  parseError: "解析错误",
  
  // Common terms
  dropLabel: "拖动文件到此处",
  dropDesc: "或点击选择文件",
  waitingMsg: "等待处理中...",
  successMsg: "处理成功！",
  fileName: "文件名",
  fileSize: "文件大小",
  fileFormat: "文件格式",
  widthLabel: "宽度",
  heightLabel: "高度",
  qualityLabel: "图片质量",
  colorLabel: "颜色配置",
  
  // Custom specific ones by regex or exact
  "2532": "2532",
  "1920": "1920",
  "2560": "2560",
  "3840": "3840",
  "1234567": "1234567"
};

function translateObj(obj, path = "") {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      translateObj(obj[key], path + "." + key);
    } else {
      // if it ends with " (中)", let's try to translate it!
       if (typeof obj[key] === 'string' && obj[key].endsWith('(中)')) {
          if (zhMap[key]) {
             obj[key] = zhMap[key];
          } else {
             // Fallback: translate some common patterns
             let text = key.replace(/([A-Z])/g, " $1").toLowerCase();
             if (text.includes('placeholder')) obj[key] = "请输入...";
             else if (text.includes('label')) obj[key] = "请输入内容";
             else if (text.includes('title')) obj[key] = "在此进行设置";
             else if (text.includes('btn')) obj[key] = "点击操作";
             else if (text.includes('error')) obj[key] = "出现错误";
             else if (text.includes('msg')) obj[key] = "提示信息";
             else if (text.includes('desc')) obj[key] = "详细描述说明文字。";
             else obj[key] = obj[key].replace(" (中)", ""); // Just remove the suffix
          }
       }
    }
  }
}

const rawZh = fs.readFileSync('src/locales/zh.json', 'utf8');
const objZh = JSON.parse(rawZh);
translateObj(objZh);

// Some specific keys that are really weird
if (objZh.tools["json-formatter"]) {
  objZh.tools["json-formatter"].title = "JSON 格式化工具";
  objZh.tools["json-formatter"].subtitle = "在线验证、压缩、格式化 JSON 数据";
  objZh.tools["json-formatter"].inputLabel = "JSON 源码";
  objZh.tools["json-formatter"].btnFormat2 = "2空格缩进";
  objZh.tools["json-formatter"].btnFormat4 = "4空格缩进";
  objZh.tools["json-formatter"].outputLabel = "格式化结果";
  objZh.tools["json-formatter"].errorTitle = "JSON 格式错误：";
}

fs.writeFileSync('src/locales/zh.json', JSON.stringify(objZh, null, 2));

console.log('Translated generic keys');
