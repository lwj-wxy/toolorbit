# Codex 如何安装和使用 Skill

## 快速结论

Codex Skill 是一组可复用的工作流说明，用来告诉 Codex 在某类任务中应该如何读文件、用工具、跑脚本、校验和交付。安装时要选择可信来源，安装后重启 Codex，再通过技能名称或匹配场景触发使用。团队使用时，把 Skill 当代码管理：版本化、审查变更、每个 Skill 只聚焦一个工作流。

最后审校：2026-05-27。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

Skill 能让 Codex 的行为更稳定。你不需要每次重复一大段说明，而是把"什么时候用、怎么做、要避开什么、最后交付什么"写进一个 Skill。OpenAI 的 [Codex Skills 文档](https://developers.openai.com/codex/skills) 是理解这个机制的官方入口。

在日常项目里，Skill 很适合处理重复工作流：图片生成、SEO 审计、PDF 处理、表格处理、Figma、GitHub Review、前端设计系统、仓库级质量规范等。

## 什么是 Codex Skill？

一个 Skill 通常是一个包含 `SKILL.md` 的目录。这个文件会描述技能用途、触发条件、工作流、约束和参考资料。有些 Skill 还会附带脚本、模板、素材或数据库。

Skill 的描述很重要，因为 Codex 会根据它判断什么时候应该使用这个技能。好的 Skill 不是一段提示词，而是一份小型操作手册。

### SKILL.md 文件结构详解

一个结构良好的 `SKILL.md` 通常包含以下部分：

```markdown
---
name: imagegen
description: 使用 GPT Image 2 生成和优化项目图片。
---

# 图片生成 Skill

## 何时使用
- 用户要求创建博客封面、Hero 图、产品模型或缩略图。
- 用户想要为特定页面或组件生成图片。

## 何时不使用
- 素材应该用 SVG 或代码实现（图标、示意图、UI 控件）。

## 工作流
1. 询问：宽高比、主题、风格、目标文件路径。
2. 使用内置图片生成工具生成图片。
3. 展示结果并请求确认。
4. 确认后，裁切到目标尺寸并保存到指定路径。
5. 更新所有引用该图片的页面配置。

## 约束
- 绝不将图片保存到项目仓库之外。
- 保存前始终优化（照片类 JPG 85% 质量，图形类 PNG）。
- 不为 UI 元素生成图片。

## 参考资料
- 项目图片路径规范：public/images/articles/{slug}.jpg
- 风格规范：编辑类摄影，深海军蓝 + 暖色点缀，16:9，无文字。
```

文件头部的 frontmatter（`---` 分隔符之间的部分）包含 Skill 名称和一行描述。Codex 会先读这里来判断 Skill 是否匹配当前请求。描述要具体，像搜索关键词一样，包含用户可能自然输入的词汇。

正文部分，何时使用、工作流、约束、参考资料，构成了操作流程。每一部分都在减少歧义。好的 Skill 让 Codex 几乎没有自行发挥的空间。

### Skill vs 提示词：核心区别

提示词是一次性指令："按这些规格生成一张博客封面。"Skill 是持久指令："每当有人要求生成博客封面，就按这个流程执行。"Skill 跨会话、跨对话持续存在。它还包含否定性规则（不要做什么），这是提示词很难做好的。

## Skill 安装在哪里？

在本地 Codex 环境里，用户安装的 Skill 通常放在：

```text
~/.codex/skills
```

系统 Skill 可能已经预装在 Codex 管理目录下，一般不需要重新安装。

安装新 Skill 后，要重启 Codex，让新会话重新发现这些技能。如果你刚安装完就发现 Codex 看不到，大概率是还没有重启。

### Skill 发现机制

Codex 启动时会扫描 skills 目录，读取每个 `SKILL.md` 的 frontmatter 和描述。这些信息会作为可用工具加载到会话上下文中。当你发出请求时，Codex 会将你的请求与每个 Skill 的描述和触发条件进行匹配。

这就是为什么描述如此重要。模糊的描述如"帮助设计"很少被触发，因为 Codex 无法可靠地将其匹配到具体请求。精确的描述如"使用 GPT Image 2 生成和优化项目图片"能清晰地匹配图片相关请求。

Skill 在被触发之前不会加载完整内容。安装很多 Skill 不会让每次对话都变得臃肿，启动时只扫描 Skill 描述，完整内容只在 Skill 被触发后才加载。

## 从精选列表安装

如果你的 Codex 环境里有 skill installer，推荐先列出可安装的 Skill，再按名称安装需要的那一个。不要一次性安装一堆暂时用不到的 Skill，否则行为会更难预测。

实用流程是：

1. 让 Codex 列出可安装 Skill。
2. 选择明确的 Skill 名称。
3. 让 Codex 安装该 Skill。
4. 重启 Codex。
5. 开始一个匹配该 Skill 的任务。

示例：

```text
List available Codex skills.
Install the imagegen skill.
Restart Codex after installation.
```

部分系统 Skill 可能已经存在，比如图片生成辅助技能。如果已经安装，不要随意覆盖，除非你知道为什么要这么做。

### 精选 Skill vs 社区 Skill

精选 Skill 由平台或可信发布者维护，经过安全审查，遵循规范，通常有版本管理。社区 Skill 来自个人开发者或团队，质量和维护程度参差不齐。

生产环境优先选精选 Skill。实验性或团队专用工作流，社区或自写 Skill 是正确选择，只要按照审查依赖项的同样标准来审查它们。

## 从 GitHub 安装

Skill 也可以来自 GitHub 仓库路径。这适合团队私有工作流或实验性技能。只安装可信来源，因为 Skill 可能包含脚本和会影响操作行为的规则。

典型请求类似：

```text
Install the Codex skill from github.com/owner/repo at skills/my-workflow.
```

私有仓库可能需要本地 Git 凭据或 token。把它当作普通的软件供应链问题处理：使用前先检查 Skill 目录内容。

### 从本地路径安装

如果你正在开发或测试 Skill，可以从本地目录安装：

```text
Install the skill from ~/projects/my-team-skills/imagegen.
```

这是发布前测试 Skill 的最快方式。修改本地 `SKILL.md`，重启 Codex，用匹配的请求测试。当 Skill 行为符合预期后，再推送到共享仓库给团队使用。

### 团队 Skill 的版本锁定

如果团队在 Git 仓库中维护 Skill，应该锁定到特定 tag 或 commit，而不是直接从 `main` 拉取：

```text
Install the skill from github.com/owner/repo at skills/my-workflow@v1.2.0.
```

这可以避免上游更新 Skill 时引发意外行为变化。对待 Skill 版本更新要像对待依赖更新一样：审查更新日志，在非关键会话中测试，然后推广。

## 创建自己的 Skill

创建 Skill 的最快方式是写一个 `SKILL.md` 文件，放到 `~/.codex/skills/<skill-name>/` 目录。先写 frontmatter，再逐一填充各部分。

### 从有效的提示词开始

如果你已经有了一段用得很顺的提示词来处理重复任务，就用它作为起点。把一次性指令转化为持久规则：

1. **何时使用：** 什么请求模式应该触发这个 Skill？
2. **工作流：** 步骤是什么，按什么顺序执行？
3. **约束：** 什么事情绝对不能做？
4. **参考资料：** Codex 应该查阅哪些文件、规范或外部文档？

### 最简模板

```markdown
---
name: my-workflow
description: 简短描述，包含用户会输入的关键词。
---

# 我的工作流 Skill

## 何时使用
- 场景 A。
- 场景 B。

## 何时不使用
- 场景 X（应使用 Y 替代）。

## 工作流
1. 向用户收集必要输入。
2. 执行主要任务。
3. 验证输出。
4. 报告结果。

## 约束
- 绝不执行 Z 操作。
- 执行前始终检查 W。

## 参考资料
- 项目规范：[链接或路径]。
```

### 测试你的 Skill

写完 Skill 后，马上测试：

1. 把 `SKILL.md` 保存到正确的目录。
2. 重启 Codex。
3. 让 Codex 列出已安装的 Skill，确认你写的出现在列表中。
4. 发出一个应该触发该 Skill 的请求。
5. 检查 Codex 是否遵循了工作流、遵守了约束，并产出了预期结果。

如果 Skill 没有被触发，很可能是描述太模糊。添加更具体的关键词再试。如果 Skill 被触发了但行为不对，通常是工作流部分有遗漏，添加更明确的步骤和约束。

## 如何触发 Skill？

常见有两种方式。

第一种是显式点名：

```text
Use $imagegen to create a blog cover for this article.
```

第二种是提出匹配技能描述的任务：

```text
Create a realistic product hero image and save it into public/images.
```

如果 Skill 描述足够清楚，Codex 往往能自动选择。但对重要任务来说，显式点名更稳。

### 什么时候显式调用 vs 隐式触发

**显式调用（`$skillname`）** 最适用于：
- 多个已安装的 Skill 可能匹配同一个请求。
- 任务很重要，你需要确定跑的是哪个 Skill。
- 你正在测试某个特定 Skill。

**隐式触发（自然语言）** 最适用于：
- Skill 描述独特且边界清晰。
- 请求是常规任务，Skill 是显而易见的匹配。
- 你希望对话流程更自然。

### 向 Skill 传递参数

部分 Skill 支持参数或标志。语法取决于 Skill 的设计，常见模式是：

```text
Use $imagegen --style=photorealistic --ratio=16:9 to create a blog cover.
```

查看 Skill 文档了解支持的参数。如果 Skill 没有记录参数，在 Skill 名称后用自然语言描述你的需求。

## 管理已安装的 Skill

### 列出已安装 Skill

直接问 Codex：

```text
List all installed Codex skills.
```

这会显示每个已安装 Skill 的名称、描述和来源。在开始重要工作前用它来审查当前激活了哪些 Skill。

### 移除 Skill

要移除不再需要的 Skill：

```text
Remove the imagegen skill.
```

或者直接从 `~/.codex/skills/` 删除对应的 Skill 文件夹，然后重启 Codex。移除不用的 Skill 能让 Skill 列表保持简洁，减少意外匹配的概率。

### 更新 Skill

精选 Skill 可以从源头重新安装获取最新版：

```text
Update the imagegen skill to the latest version.
```

从 GitHub 安装的 Skill，从同一路径重新安装（可以指定新版本标签）。本地开发的 Skill，直接编辑 `SKILL.md` 然后重启。

### 临时禁用 Skill

如果你想保留一个 Skill 但不让它被触发，把它的文件夹移出 `~/.codex/skills/` 然后重启。这在排查"某个 Skill 是否导致了异常行为"时很有用。移回来再重启即可重新启用。

## Skill 与项目级指令的关系

Skill 不会覆盖本地项目指令，如 `AGENTS.md`、`CLAUDE.md` 或仓库级规则。项目指令和 Skill 共存，但优先级不同：

1. **用户请求**：你明确要求的任务。
2. **项目指令**：仓库中的 `AGENTS.md`、`CLAUDE.md` 等文件。
3. **Skill 工作流**：Skill 中定义的操作流程。
4. **Codex 默认行为**：内置行为。

当 Skill 与项目指令冲突时，项目指令优先。例如，如果 `AGENTS.md` 说"永远不直接修改 `public/images/` 下的文件"，而某个 Skill 通常会把图片保存到那里，Codex 应该遵守项目规则并询问你怎么处理。

### 设计尊重项目上下文的 Skill

好的 Skill 应该承认项目规则优先：

```markdown
## 约束
- 将图片保存到项目的图片目录。如果项目规范文件
 （AGENTS.md、CLAUDE.md）指定了不同路径，遵循该路径。
```

这让 Skill 可以在不同项目之间移植而不引发冲突。

## 常见问题排查

### 安装后 Skill 不出现

1. 确认 Skill 文件夹存在于 `~/.codex/skills/`。
2. 检查文件夹内是否包含 `SKILL.md` 文件。
3. 验证 `SKILL.md` 的 frontmatter 有效且包含 `name` 字段。
4. 重启 Codex。
5. 让 Codex 列出已安装 Skill，检查是否出现。

如果 Skill 仍然不出现，`SKILL.md` 的 frontmatter 可能格式错误。检查 `---` 分隔符之间的 YAML 是否有效。

### Skill 不响应匹配的请求

1. 检查 Skill 描述，是否足够具体？
2. 尝试显式调用（`$skillname`）确认 Skill 已加载。
3. 如果显式调用有效但隐式不行，重写描述，加入更多匹配关键词。
4. 检查"何时使用"部分，触发条件是否清晰？

### Skill 产生意外行为

1. 阅读完整的 `SKILL.md`，理解预期工作流。
2. 检查是否某个项目指令覆盖了 Skill 的部分行为。
3. 检查是否有另一个已安装的 Skill 描述重叠，被优先选中了。
4. 尝试临时移除其他 Skill，隔离问题。

### 两个 Skill 冲突

如果两个已安装的 Skill 描述重叠，Codex 可能选错。解决办法：

- 让两个描述更差异化，加入区分关键词。
- 对你想要的那个 Skill 使用显式调用。
- 移除或禁用一个你较少使用的 Skill。

## 如何判断 Skill 质量？

一个有用的 Skill 应该说明：

- 什么时候使用，什么时候不要使用。
- 行动前需要收集哪些输入。
- 优先读取哪些文件或使用哪些脚本。
- 有哪些安全约束。
- 最终应该交付什么。

弱 Skill 往往很泛，比如"做一个好 UI"或"做 SEO"，但没有工作流。强 Skill 会降低歧义，让重复任务更稳定。

### 第三方 Skill 的危险信号

安装来自不熟悉来源的 Skill 之前，检查：

- **没有"何时不使用"部分。** 从不说"不"的 Skill 可能在不当的场景被触发。
- **文件系统访问范围过宽。** Skill 只应该接触与其工作流相关的文件。
- **网络请求未声明。** Skill 应该记录所有外部 API 调用。
- **没有约束部分。** 缺乏安全规则的 Skill 是隐患。
- **脚本被混淆。** 如果 Skill 包含脚本，安装前先阅读它们。

## 团队使用建议

Skill 应该保持聚焦。设计 Skill、图片生成 Skill、SEO 审计 Skill 通常应该分开。这样更容易预测，也更容易测试。

重要 Skill 应该进 Git 管理。如果它影响团队工作流，就应该像代码一样审查、记录假设、保留示例。

为团队 Skill 在 `SKILL.md` 旁边写一份简短的 `README.md`。README 是给人看的，解释这个 Skill 为什么存在、谁在维护、遵循什么规范。`SKILL.md` 是给 Codex 看的，包含操作指令。

编辑元数据时可以用 [JSON 格式化工具](/tools/dev/json-formatter)，比较 Skill 版本可以用 [文本对比工具](/tools/dev/text-diff)，起草可复用说明可以用 [AI 提示词生成器](/tools/ai/prompt-generator)。

### 团队 Skill 审查清单

合并新的或更新的 Skill 之前：

1. 描述是否准确反映了 Skill 的功能？
2. 触发条件是否足够具体，避免误匹配？
3. 工作流是否覆盖了完整任务，包括验证和错误处理？
4. 约束是否清晰且可执行？
5. Skill 是否用至少三个不同请求进行了测试？
6. Skill 是否尊重项目级指令的优先级？

## 常见坑

最常见的问题是安装完 Skill 后继续使用旧会话。安装后要重启 Codex。

第二个问题是安装未审查的 Skill。Skill 可能包含脚本或规则，会影响文件编辑、网络访问和工作流判断。

第三个问题是把所有东西塞进一个巨大 Skill。小而清晰的 Skill 更容易测试，也更容易被 Codex 正确选择。

第四个问题是忘记仓库规则。Skill 不会覆盖项目里的 `AGENTS.md` 等本地规范，仓库规则仍然优先。

第五个问题是 Skill 描述写得太泛。"帮助前端工作"匹配的东西太多，要么频繁误触发，要么从不触发。要具体："审查 React 组件的可访问性、响应式布局和设计一致性。"

第六个问题是从来不更新 Skill。项目规范会变，Skill 会过时。每季度安排一次 Skill 审查：移除不用的、更新活跃的、检查 Skill 行为是否仍与当前工作流一致。

## 总结

Codex Skill 的价值在于把重复判断变成可复用流程。只安装需要的 Skill，安装后重启，使用时明确触发，并像审查自动化脚本一样审查 Skill 内容。对团队来说，写好一个 Skill 的投入，会在每次有人"不再需要重复一大段说明"或"不再犯同样的错误"时得到回报。
