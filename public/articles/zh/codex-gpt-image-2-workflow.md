# Codex 如何使用 GPT Image 2 生成项目图片

## 快速结论

当你需要真正的位图素材时，例如博客封面、Hero 图、产品场景图、缩略图、贴图或社交分享图，可以让 Codex 生成图片。关键流程是：写清提示词，检查结果，把最终图片保存进项目目录，再更新页面引用，不能让线上页面依赖临时生成目录。

最后审校：2026-05-27。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

Codex 适合把“设计意图”推进到“可落地资源”。你可以让它生成图片、检查画面、裁切转换、保存到仓库，并修改使用这张图的页面配置。

OpenAI 的 [GPT Image 2 模型文档](https://developers.openai.com/api/docs/models/gpt-image-2) 是能力参考。落到 Codex 工作流时，可以先记住一个更实用的判断：普通项目图片优先走内置图片生成；只有明确需要模型级参数、批量脚本或 API/CLI 控制时，才切到命令行或接口路径。

## 什么场景适合生成图片？

适合生成的是位图资产，比如博客封面、Open Graph 图、商品展示场景、引导页插画、演示背景、电商运营桌面图和营销缩略图。

不适合生成的是应该保持可编辑、可访问、可复用的界面元素。图标、简单示意图、UI 控件、图表骨架和线框图通常应该用 SVG、HTML/CSS 或组件代码实现。

在 ToolOrbit 这类工具站里，可以这样分工：

- 博客和落地页图片：用 Codex 生成，再保存为优化后的 JPG 或 WebP。
- UI 控件、图标和布局：用代码实现。
- 提示词草稿：用 [AI 提示词生成器](/tools/ai/prompt-generator) 辅助整理。
- 最终图片处理：用 [图片压缩工具](/tools/image/image-compressor) 和 [图片格式转换工具](/tools/image/image-converter) 优化。

## 推荐的提示词结构

好的提示词要说明图片用途、比例、画面内容、视觉风格、限制条件和不要出现的内容。不要只写“生成一张好看的博客图”，这会让结果很随机。

可以按这个结构写：

```text
Create a 16:9 editorial blog cover for a tutorial about using Codex with GPT Image 2.
Scene: realistic developer desk, laptop with blurred image generation workspace, prompt notes, color swatches, and camera lens.
Style: professional tech blog, dark navy and cyan accents, realistic lighting.
Constraints: no readable text, no logos, no watermark, no 3D render.
```

“不要出现什么”非常重要。博客卡片经常会裁切图片，生成图里的文字也容易失真。除非必须保留精确文字，否则建议明确写上 no readable text。

## 必须保存到项目目录

生成图片通常会先出现在项目外部的生成目录。这适合预览，但不能直接作为生产页面引用。选定最终图片后，应该复制到项目里的稳定路径，例如：

```text
public/images/blog/codex-gpt-image-2-workflow.jpg
```

然后更新页面数据源。博客列表一般改 `blogData.ts`，落地页 Hero 图则可能改组件属性或资源引用。

这一步很容易漏。如果图片只留在本地生成目录，部署后的站点就读不到。

## 裁切和格式要有标准

生成图通常比页面需要的尺寸更大。保存前应该裁切到实际展示比例。博客封面常用 `1200 x 675` 的 16:9 尺寸。摄影类封面适合 JPG；扁平图形或截图适合 PNG；站点支持时也可以输出 WebP。

转换后要检查最终图片，而不是只看原始生成图。裁切可能会把主体裁掉，压缩也可能让小界面细节变糊。

## 一个稳定的 Codex 迭代流程

推荐流程很短：

1. 生成一张目标明确的图片。
2. 视觉检查。
3. 如果接近要求，只做一个明确调整。
4. 把认可版本保存进项目。
5. 更新页面引用。
6. 验证页面或数据源。

不要一开始就生成很多方向完全不同的图。问题如果是“太像 3D 插画”，就直接要求真实摄影风格；问题如果是“和现有博客封面不搭”，就提供参考截图或描述共同元素。

## 常见坑

第一，把生成图当作 UI 使用。生成出来的工具栏可能看起来像界面，但它不可访问、不可响应、不可选择，也不好维护。UI 应该用代码实现。

第二，封面里出现假文字。它会降低质感，也容易让用户分心。可以要求模糊屏幕、抽象文档或图标化形状。

第三，只看大图，不看卡片尺寸。全尺寸很好看的封面，缩成博客卡片后可能过于嘈杂。

第四，没有保留原始输出。最终转换图确认前，原图最好先留着，方便重新裁切或压缩。

## 在 ToolOrbit 里的用法

Codex 图片生成最适合提升内容呈现。可以先用 [AI 提示词生成器](/tools/ai/prompt-generator) 整理提示词，再用 [图片压缩工具](/tools/image/image-compressor) 降低体积，用 [图片格式转换工具](/tools/image/image-converter) 输出页面需要的格式。

如果你要长期生产内容，最好固定一份站点图片规范：比例、光线、色彩、主体、禁止风格和保存路径。规范越稳定，后面就越少出现“封面不搭”的返工。
