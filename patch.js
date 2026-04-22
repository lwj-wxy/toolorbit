import fs from 'fs';

let tools = fs.readFileSync('src/data/tools.ts', 'utf-8');

if (!tools.includes('Palette,')) {
  tools = tools.replace(/import {/, 'import { \n  Palette,\n  Pipette,');
}

const appendTools = `
  {
    id: "color-converter",
    name: "颜色代码转换",
    description: "HEX, RGB, HSL, HSV, CMYK 等多种工业色彩规格之间无损互转，支持透明度提取。",
    icon: Palette,
    category: "开发者工具",
    path: "/tools/dev/color-converter"
  },
  {
    id: "color-palette",
    name: "阶梯调色板推演工具",
    description: "针对主色调自动演化同色系更具层次的高级 Tints 与 Shades。",
    icon: Palette,
    category: "开发者工具",
    path: "/tools/dev/color-palette"
  },
  {
    id: "color-picker",
    name: "屏幕颜色拾取器",
    description: "调用浏览器原生 EyeDropper 接口全屏取色。",
    icon: Pipette,
    category: "开发者工具",
    path: "/tools/dev/color-picker"
  },
  {
    id: "image-to-ico",
    name: "图片转 ico 图标",
    description: "生成正规带 Header 的 ICO 系统级专用图标封装格式。",
    icon: ImageIcon,
    category: "图片处理",
    path: "/tools/image/image-to-ico"
  }
];`;

tools = tools.replace(/];[\s\n]*$/, appendTools);
fs.writeFileSync('src/data/tools.ts', tools);

let app = fs.readFileSync('src/App.tsx', 'utf-8');

const appImports = `
import ColorConverter from './pages/tools/dev/ColorConverter';
import ColorPalette from './pages/tools/dev/ColorPalette';
import ColorPicker from './pages/tools/dev/ColorPicker';
import ImageToIco from './pages/tools/image/ImageToIco';
`;

app = app.replace(/import TimestampConverter from '.\/pages\/tools\/dev\/TimestampConverter';/, appImports + "import TimestampConverter from './pages/tools/dev/TimestampConverter';");

const appRoutes = `
          <Route path="/tools/dev/color-converter" element={<ColorConverter />} />
          <Route path="/tools/dev/color-palette" element={<ColorPalette />} />
          <Route path="/tools/dev/color-picker" element={<ColorPicker />} />
          <Route path="/tools/image/image-to-ico" element={<ImageToIco />} />
`;

app = app.replace(/<Route path="\/tools\/dev\/timestamp-converter" element={<TimestampConverter \/>} \/>/, appRoutes + '          <Route path="/tools/dev/timestamp-converter" element={<TimestampConverter />} />');

fs.writeFileSync('src/App.tsx', app);
