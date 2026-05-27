# Codex 如何使用 GPT Image 2 生成项目图片

## 快速结论

当你需要真正的位图素材时，例如博客封面、Hero 图、产品场景图、缩略图、贴图或社交分享图，可以让 Codex 生成图片。关键流程是：写清提示词，检查结果，把最终图片保存进项目目录，再更新页面引用，不能让线上页面依赖临时生成目录。要想结果可复现，就固定一份站点图片规范，像管理代码一样管理生成图——版本化、检查、优化。

最后审校：2026-05-27。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

Codex 适合把"设计意图"推进到"可落地资源"。你可以让它生成图片、检查画面、裁切转换、保存到仓库，并修改使用这张图的页面配置——所有这些都在同一次对话中完成。

OpenAI 的 [GPT Image 2 模型文档](https://developers.openai.com/api/docs/models/gpt-image-2) 是能力参考。落到 Codex 工作流时，可以先记住一个更实用的判断：普通项目图片优先走内置图片生成；只有明确需要模型级参数、批量脚本或 API/CLI 控制时，才切到命令行或接口路径。

## 了解 GPT Image 2 的能力边界

写提示词之前，先搞清楚模型擅长什么、不擅长什么，能避免大量返工。

**擅长领域：** GPT Image 2 在真实感场景、编辑类构图、实物表面产品模型、建筑和室内渲染、食物和生活摄影、抽象科技背景方面表现出色。它对光线、景深和材质纹理的处理精度出人意料。用于博客封面、Hero 区域和营销素材时，输出质量可以媲美商业图库。

**薄弱领域：** 模型在图像内精确渲染文字方面仍然吃力。生成的文字经常出现拼写错误、间距异常或笔画瑕疵。它也不擅长精确复制 UI——仪表盘截图或特定按钮样式无法做到像素级匹配。包含复杂空间关系的多主体场景，结果可能不一致。

**分辨率和格式：** 生成图通常输出高分辨率，但具体尺寸取决于你要求的宽高比。正方形（1:1）、横版（16:9）和竖版（3:4）支持较好。每次都应该明确指定比例，不要依赖默认值。

**风格范围：** 模型支持的风格词汇很广：编辑摄影、3D 渲染、扁平插画、等距视角、水彩、线稿、赛博朋克、极简主义等等。关键是要明确——"真实感编辑类桌面场景"和"开发者工作区的 3D 等距插画"会产生截然不同的结果。

## 什么场景适合生成图片？

适合生成的是位图资产，比如博客封面、Open Graph 图、商品展示场景、引导页插画、演示背景、电商运营桌面图和营销缩略图。

不适合生成的是应该保持可编辑、可访问、可复用的界面元素。图标、简单示意图、UI 控件、图表骨架和线框图通常应该用 SVG、HTML/CSS 或组件代码实现。

在 ToolOrbit 这类工具站里，可以这样分工：

- 博客和落地页图片：用 Codex 生成，再保存为优化后的 JPG 或 WebP。
- UI 控件、图标和布局：用代码实现。
- 提示词草稿：用 [AI 提示词生成器](/tools/ai/prompt-generator) 辅助整理。
- 最终图片处理：用 [图片压缩工具](/tools/image/image-compressor) 和 [图片格式转换工具](/tools/image/image-converter) 优化。

### 位图 vs 矢量：先做判断

这个判断值得单独说明，因为它能避免大量返工。如果一个素材可以用形状、路径和颜色来描述——比如图标、示意图、图表——就用代码或 SVG 实现。结果将是分辨率无关、可访问、易修改的。

如果素材依赖摄影、材质、光线或有机构图——比如 Hero 图、产品场景、情绪板——生成是更好的路径。生成图本质上是位图，一开始就接受这个限制。

### 什么时候图库照片更合适

有些项目场景下，授权图库照片仍然是正确答案。如果你需要可识别的地标建筑、带有精确品牌信息的产品图，或者要面对法律审查的图片，使用图库服务。生成图适合原创构图，但并非在所有场景下都能替代有授权的、可溯源的摄影作品。

## 推荐的提示词结构

好的提示词要说明图片用途、比例、画面内容、视觉风格、限制条件和不要出现的内容。不要只写"生成一张好看的博客图"，这会让结果很随机。

可以按这个结构写：

```text
Create a 16:9 editorial blog cover for a tutorial about using Codex with GPT Image 2.
Scene: realistic developer desk, laptop with blurred image generation workspace, prompt notes, color swatches, and camera lens.
Style: professional tech blog, dark navy and cyan accents, realistic lighting.
Constraints: no readable text, no logos, no watermark, no 3D render.
```

### 每个组成部分为什么重要

**先定宽高比。** 把比例放在最前面，模型在构图之前就知道画布形状。16:9 横版和 1:1 正方形需要完全不同的构图方式。

**场景描述要具体。** 明确说明画面中出现的物体及其空间关系。与其写"开发者桌面"，不如写"木质桌面，左侧放置笔记本电脑，右侧有笔记本和钢笔，前景有一枚相机镜头"。模型会利用空间线索构建深度感。

**风格关键词叠加。** "Professional tech blog"定调，"dark navy and cyan accents"约束色彩，"realistic lighting"避免模型默认使用平淡的影棚光。叠加多个风格关键词可以收窄输出的分布范围。

**负面约束同样重要。** 博客卡片经常会裁切图片，生成图里的文字也容易失真。除非必须保留精确文字，否则建议明确写上 no readable text。同理，"no 3D render"会在需要摄影感的时候把模型推向真实摄影方向。

### 更多提示词示例

产品场景图：

```text
Create a 1:1 square product scene for a note-taking app.
Scene: a smartphone resting on a wooden cafe table, the screen showing a clean note editor interface with placeholder text blocks. A coffee cup in the background, out of focus.
Style: warm natural lighting, shallow depth of field, modern minimalist.
Constraints: no readable text on the screen, no brand logos, no human hands.
```

技术插图：

```text
Create a 16:9 technical illustration explaining API request flow.
Scene: abstract diagram showing arrows between a client icon, a server icon, and a database icon, using clean geometric shapes.
Style: flat vector illustration, blue and teal palette, white background, thin consistent stroke width.
Constraints: no text labels, no 3D perspective, no gradients.
```

抽象背景：

```text
Create a 16:9 abstract background for a cybersecurity blog.
Scene: flowing digital particles forming network-like patterns, with subtle grid lines and depth fog.
Style: dark background, cyan and electric blue accents, subtle glow effects, cinematic.
Constraints: no recognizable shapes, no text, no sharp edges.
```

## 必须保存到项目目录

生成图片通常会先出现在项目外部的生成目录。这适合预览，但不能直接作为生产页面引用。选定最终图片后，应该复制到项目里的稳定路径，例如：

```text
public/images/blog/codex-gpt-image-2-workflow.jpg
```

然后更新页面数据源。博客列表一般改 `blogData.ts`，落地页 Hero 图则可能改组件属性或资源引用。

这一步很容易漏。如果图片只留在本地生成目录，部署后的站点就读不到。

### 不同框架的集成方式

**Next.js（pages 或 app router）：** 图片放在 `public/images/`，用前导斜杠引用：`/images/blog/cover.jpg`。需要优化加载时，使用 `next/image` 组件配合静态导入或 public 路径。

```tsx
import Image from 'next/image';
import coverImg from '@/public/images/blog/cover.jpg';

<Image src={coverImg} alt="博客封面" width={1200} height={675} priority />
```

或者直接引用 public 目录路径：

```tsx
<Image src="/images/blog/cover.jpg" alt="博客封面" width={1200} height={675} />
```

**原生 HTML 或静态站点：** 图片放在 `images/` 或 `assets/` 目录，用相对路径或根相对路径引用。`<img>` 标签要加上明确的 `width` 和 `height` 属性，防止加载时的布局偏移。

**React（Vite 或 CRA）：** 在组件文件顶部 import 图片，打包工具会处理哈希和优化。

```tsx
import coverImg from './assets/blog-cover.jpg';

<img src={coverImg} alt="博客封面" width={1200} height={675} loading="lazy" />
```

### 更新博客元数据

在 ToolOrbit 及类似站点中，博客图片往往存储在数据文件中，而不是直接写在组件里。保存图片后，更新对应条目：

```typescript
{
  slug: 'codex-gpt-image-2-workflow',
  title: 'Codex 如何使用 GPT Image 2 生成项目图片',
  image: '/images/blog/codex-gpt-image-2-workflow.jpg',
  // ...
}
```

如果站点支持 Open Graph 图片，生成并保存一张单独的 1200x630 OG 版本。

## 裁切和格式要有标准

生成图通常比页面需要的尺寸更大。保存前应该裁切到实际展示比例。博客封面常用 `1200 x 675` 的 16:9 尺寸。摄影类封面适合 JPG；扁平图形或截图适合 PNG；站点支持时也可以输出 WebP。

转换后要检查最终图片，而不是只看原始生成图。裁切可能会把主体裁掉，压缩也可能让小界面细节变糊。

### 格式选择矩阵

| 格式 | 最适合 | 避免用于 |
|------|--------|----------|
| JPG | 摄影封面、Hero 图、含渐变的场景 | 截图、文字密集图、扁平图形 |
| PNG | 截图、示意图、含文字图片、扁平插画 | 大幅摄影图片 |
| WebP | 浏览器兼容性良好的现代生产站点 | 老旧邮件客户端、旧版 CMS |
| AVIF | 需要最佳压缩率的新一代站点 | 不支持 AVIF 解码的环境 |

### 各场景推荐分辨率

| 使用场景 | 推荐尺寸 | 宽高比 |
|----------|----------|--------|
| 博客卡片缩略图 | 800 x 450 | 16:9 |
| 博客主图 / 页头 | 1200 x 675 | 16:9 |
| Open Graph 图 | 1200 x 630 | ~1.91:1 |
| 方形社交帖子 | 1080 x 1080 | 1:1 |
| 产品场景图 | 1200 x 1200 | 1:1 |
| Twitter 卡片 | 1200 x 600 | 2:1 |
| 全宽 Hero | 1920 x 1080 | 16:9 |

始终生成不低于目标分辨率的图，然后缩小。把小图放大只会得到模糊的结果，而从大图缩小可以保留细节。

### 优化流水线

一条实用的博客封面优化流水线：

1. 要求 Codex 生成高分辨率图片（如 16:9）。
2. 检查原始输出，确认构图和主体无误。
3. 用图片工具或 Codex 本身裁切到 1200x675。
4. 转换为目标格式（照片类用 JPG，85% 质量是良好默认值）。
5. 可选：为支持 WebP 的浏览器额外生成一份 WebP。
6. 将两个版本都用 [图片压缩工具](/tools/image/image-compressor) 做最终体积优化。
7. 保存到 `public/images/blog/`。

## 一个稳定的 Codex 迭代流程

推荐流程很短：

1. 生成一张目标明确的图片。
2. 视觉检查。
3. 如果接近要求，只做一个明确调整。
4. 把认可版本保存进项目。
5. 更新页面引用。
6. 验证页面或数据源。

不要一开始就生成很多方向完全不同的图。问题如果是"太像 3D 插画"，就直接要求真实摄影风格；问题如果是"和现有博客封面不搭"，就提供参考截图或描述共同元素。

### 有效的迭代提示词

模糊的反馈产生随机的变化，具体的反馈产生精准的修正。对比一下：

- 弱："让它好看一点。" → 随机风格变化。
- 强："光线太平面了，从左上角加入暖色主光，加深阴影。" → 精准的光线调整。

- 弱："构图感觉不对。" → 模型猜你要改什么。
- 强："把笔记本电脑移到画面左侧三分之一处，右侧增加留白空间。" → 明确的空间指令。

- 弱："让它更专业。" → 方向不明确。
- 强："饱和度降低 30%，去掉装饰元素，桌面换成干净的白色表面，不要木纹。" → 可执行的约束。

核心模式一致：先识别具体症状，再命名修正方案，保持其他条件不变。摄影师和美术指导就是这样给修改意见的，模型对这种沟通方式响应最好。

### 重来还是迭代？

如果第一张图的生成方向根本不对——主题错误、风格错误、构图错误——就重写提示词重新生成。在坏的基础上迭代浪费时间，且模型可能难以跳出初始构图。

如果第一张图接近目标，只是有具体问题——光线、色偏、某个物体位置不对——用有针对性的反馈迭代。一到两轮修改是正常的，超过三轮通常说明初始提示词需要重新思考。

## 批量图片工作流

如果项目需要多张图片（博客系列、工具页插图组、分类页头图组），批量工作流可以节省时间并确保视觉统一。

### 先定义批量规格

在生成任何图片之前，先写下：

- 共享的风格约束（光线、色彩、主体距离、氛围）。
- 每张图片的场景描述。
- 共享的负面约束。
- 所有图片的目标格式和分辨率。

一份批量规格可能长这样：

```text
系列：开发者工具分类页头（6 张）
共享风格：编辑类科技摄影，深海军蓝配暖琥珀色点缀，真实感光线，浅景深。
共享约束：无清晰文字，无 logo，无 3D 渲染，无人脸。
格式：1200x675 JPG，85% 质量。

1. JSON 工具：结构化数据在深色屏幕上发光的特写。
2. 图片工具：干净桌面上的相机镜头和色卡。
3. 安全工具：由电路轨迹构成的抽象锁形图标。
4. 文本工具：放在手写编辑标记上的钢笔。
5. 编码工具：汇聚成一条线的抽象数据流。
6. PDF 工具：带有细微网格和页边距参考线的文档版面。
```

逐张按照共享约束生成。一次生成一张、使用相同的风格描述，比在一个提示词里要求六张图更稳定。

### 批量输出的命名规范

使用可预测、可排序的文件名，让图片之间的关系一目了然：

```text
category-header-json.jpg
category-header-image.jpg
category-header-security.jpg
category-header-text.jpg
category-header-encoding.jpg
category-header-pdf.jpg
```

这样既容易发现遗漏，也方便批量更新引用。

## 常见生成问题排查

### 图片"AI 味"太重

这是最常见的抱怨，通常来自以下几个根源：

- **光线过于完美：** 要求"自然光线，细微的不完美，真实的阴影"。
- **塑料感表面：** 添加"真实感纹理，表面颗粒，自然使用痕迹"。
- **构图过于模板化：** 加入具体构图规则："三分法构图，主体放在左侧三分之一，从右下角引入引导线"。
- **色彩饱和度过高：** 要求"柔和色调，饱和度降低 20%，编辑类调色"。

### 主体被错误裁切

如果主体被切断或位置不对，通常是宽高比和主体位置冲突。尝试："让主体居中，四周保留充足留白"或"使用更宽的构图，主体仅占据画面中央 60%"。

### 图片与站点现有风格不匹配

这是已有项目中最常见的问题。解决办法是创建一份可复用的风格提示词，存放在项目的贡献文档或共享笔记中：

```text
ToolOrbit 博客封面风格规范：
- 16:9 宽高比，最终尺寸 1200x675。
- 编辑类科技摄影，非插画或 3D。
- 深海军蓝背景，配单一点缀暖色（琥珀或铜色）。
- 一个与文章主题相关的焦点物体。
- 浅景深，虚化背景。
- 无文字，无 logo，无人脸，无卡通元素。
```

把这份规范分享给所有为项目生成图片的人。一致性来自约束，而不是每次都重新描述风格。

### 生成失败或报错

如果 Codex 报告图片生成不可用或返回错误：

1. 检查当前会话的模型端点是否支持图片生成。
2. 简化提示词——过长或过于复杂的提示词有时会导致失败。
3. 移除可能触发安全过滤的特定词汇。
4. 如果内置路径不可用，尝试通过 API 路径作为备选。

## 常见坑

第一，把生成图当作 UI 使用。生成出来的工具栏可能看起来像界面，但它不可访问、不可响应、不可选择，也不好维护。UI 应该用代码实现。

第二，封面里出现假文字。它会降低质感，也容易让用户分心。可以要求模糊屏幕、抽象文档或图标化形状。

第三，只看大图，不看卡片尺寸。全尺寸很好看的封面，缩成博客卡片后可能过于嘈杂。上线前一定在实际展示尺寸下预览。

第四，没有保留原始输出。最终转换图确认前，原图最好先留着，方便重新裁切或压缩。硬盘空间很便宜，重新生成一张"差一点就满意"的图很贵。

第五，全站风格不统一。如果三张博客封面用编辑摄影风格，第四张突然变成扁平插画，整体系列感就碎了。定义一份风格规范然后坚持用它。

第六，忘了做 Open Graph 版本。一张为 16:9 Hero 区优化的博客封面，分享到社交媒体时会被尴尬地裁切。单独生成一张 1200x630 的 OG 图，或者确保主图同时适配两种比例。

## 在 ToolOrbit 里的用法

Codex 图片生成最适合提升内容呈现。可以先用 [AI 提示词生成器](/tools/ai/prompt-generator) 整理提示词，再用 [图片压缩工具](/tools/image/image-compressor) 降低体积，用 [图片格式转换工具](/tools/image/image-converter) 输出页面需要的格式。

对颜色敏感的工作，可以用 [配色生成器](/tools/dev/color-palette) 定义风格规范的调色板，用 [取色器](/tools/dev/color-picker) 从参考图中采样颜色。

如果你要长期生产内容，最好固定一份站点图片规范：比例、光线、色彩、主体、禁止风格和保存路径。规范越稳定，后面就越少出现"封面不搭"的返工。

## 总结

Codex 配合 GPT Image 2 最有效的使用方式，是把图片生成当作工程流程，而不是创意抽奖。写具体的提示词，带明确约束。把成品保存进有版本管理的项目路径。按实际展示尺寸优化。用有针对性的反馈做迭代，而不是随机重新生成。记录一份风格规范，让项目里的每张图都像来自同一个家族。目标不是一张完美的图片，而是一个可重复的流程，能持续产出统一、可上线的素材。
