# Codex 如何安装和使用 ui-ux-pro-max 做前端设计

## 快速结论

ui-ux-pro-max 适合在 Codex 需要做设计判断时使用，而不是只补代码。做新页面、改工具区布局、优化仪表盘、检查移动端体验前，先让它给出设计系统、色彩、字体、布局模式、UX 约束和技术栈建议。

最后审校：2026-05-27。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

很多 AI 生成界面的问题不是代码跑不起来，而是缺少产品判断：卡片过大、颜色单一、间距不统一、控件不像真实工具、首屏像模板落地页。

`ui-ux-pro-max` 的作用就是让 Codex 在写代码前先做设计推理。它包含产品模式、视觉风格、色彩、字体、UX 规则、图表选择和不同技术栈实现建议。

## 什么时候该用？

只要任务有明显的视觉或交互界面，就适合使用：

- 新建工具页、仪表盘、落地页、应用或游戏。
- 优化一个看起来杂乱、模板感强或不协调的页面。
- 重做包含大量控件的工作区。
- 给 SaaS、电商、金融、教育、医疗、作品集或内部工具选择设计方向。
- 做 UI 可访问性、布局层级、交互质量检查。

如果只是改一行文案、纯数据调整、后端逻辑或没有界面影响的小 bug，就不需要用它。

## 推荐工作流

好的请求应该告诉 Codex 产品类型、受众、风格方向和技术栈。

```text
Use $ui-ux-pro-max to improve this ecommerce fee calculator page.
Audience: sellers comparing payment fees.
Style: practical, dense, trustworthy, not a marketing landing page.
Stack: React with Tailwind.
Keep the existing content structure, but improve layout, hierarchy, controls, and responsive behavior.
```

这个 Skill 应该先生成设计系统建议，也就是在动代码前确定布局模式、色彩、字体、效果和反模式。

## 为什么先做设计系统？

如果没有设计系统，Codex 很容易只修局部症状：这里缩一点卡片，那里加一条边框，再换一个颜色。局部可能好了，但整体仍然不统一。

有了设计系统，决策会互相连接：

- 产品类型决定信息密度和布局。
- 用户群体决定文案和视觉克制程度。
- 色彩决定强调、警告和状态表达。
- 字体影响扫描效率。
- 技术栈建议影响实现细节。

例如，费用计算器应该安静、实用、偏运营工具感。它不应该使用巨大的营销 Hero、卡片套卡片或装饰性渐变。作品集可以更表达性；数据仪表盘则需要更密集的对齐、稳定控件和可扫描结构。

## 好的前端提示词

提示词越具体，结果越可控：

```text
Use $ui-ux-pro-max to redesign the top configuration card.
Current problem: the amount input and fee presets are side by side, which looks unbalanced when content grows.
Preferred direction: vertical layout. Amount input on top, configuration below, output cards underneath.
Preserve existing calculations and translations.
```

这段话说明了真实 UX 问题，也保护了业务逻辑。Codex 就能专注在布局和表现上，不会误改计算规则。

如果是新页面，可以这样写：

```text
Use $ui-ux-pro-max to design a SaaS dashboard for weekly support metrics.
Audience: operations managers.
Style: compact, calm, information-dense.
Required views: KPI row, trend chart, queue table, filters, and empty states.
Stack: React and Tailwind.
```

## 搭配 ToolOrbit 工具

前端设计经常需要一些小工具辅助：

- 用 [配色生成器](/tools/dev/color-palette) 探索色彩方向。
- 用 [取色器](/tools/dev/color-picker) 从截图里确认精确颜色。
- 用 [AI 提示词生成器](/tools/ai/prompt-generator) 把模糊设计想法整理成清晰实现请求。

这些工具不能替代设计判断，但可以让工作流更具体。

## 常见坑

第一，只说“做漂亮一点”，却不给产品上下文。CRM、游戏和个人作品集不应该长得一样。

第二，把工具页做成落地页。计算器、格式化工具、仪表盘应该在首屏展示真实工作流，而不是先放一大段营销介绍。

第三，接受布局跳动。工具栏、卡片、网格和输入区应该有稳定尺寸，避免 hover 状态或动态内容让页面重新挤压。

第四，整页只用同一个色系。单一色相很容易显得扁平。好的调色板需要中性色、强调色、成功/警告/错误状态和足够对比度。

## 交付前检查清单

前端改动完成前，可以检查：

1. 首屏是否直接展示真实产品或工作流？
2. 控件是否放在用户自然需要的位置？
3. 重复项目是否对齐、可扫描？
4. 移动端按钮、卡片、侧栏里的文字是否放得下？
5. 空状态、加载、错误、选中、禁用状态是否完整？
6. 配色是否有层次，而不是单色堆叠？
7. 实现是否保留了原有行为？

## 总结

`ui-ux-pro-max` 最好在写大量 UI 代码前使用。它的价值不是给完成品贴装饰，而是提前塑造设计方向。使用时要给出产品上下文、约束、技术栈和你真正想解决的 UX 问题。
