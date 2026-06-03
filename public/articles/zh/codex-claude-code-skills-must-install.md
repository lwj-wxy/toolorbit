# Codex 和 Claude Code 该先装的 10 个 Skill

## 结论

如果你每天都在给 Codex 或 Claude Code 复制同一段要求，比如先读项目规范、按 review 标准报问题、查官方文档、前端改完打开浏览器检查，就该把这些要求写成 Skill。

Skill 适合放可复用工作流。`AGENTS.md` 和 `CLAUDE.md` 放项目长期规则。MCP 连接外部系统和实时数据。Hook 做强制拦截和自动校验。把这几类东西分开，Agent 更容易选对上下文，你后面也更好维护。

最后审校：2026-06-03。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

## Skill 是什么

Skill 通常是一个目录，核心文件叫 `SKILL.md`。这个文件至少要写清两件事：什么时候触发，以及触发后 Agent 按什么流程做事。

OpenAI 的 [Codex Skills 文档](https://developers.openai.com/codex/skills) 说明，Codex 会先读取 skill 的 `name`、`description` 和路径，选中后再加载完整说明。Skill 目录也可以带 `scripts/`、`references/`、`assets/` 等支持文件。

Anthropic 的 [Claude Code Skills 文档](https://code.claude.com/docs/en/skills) 采用同类结构。你把 `SKILL.md` 放进指定目录，Claude Code 会在相关任务里使用，也支持通过 `/skill-name` 手动调用。

一个可维护的分工可以这样定：

- `AGENTS.md` / `CLAUDE.md`：项目长期规则，比如禁止改无关文件、命名约束、构建命令限制。
- Skill：重复出现的工作流，比如 code review、CI 修复、文档写作、前端验收。
- MCP：外部系统和实时数据，比如 GitHub、Figma、浏览器、数据库、搜索。
- Hook：强制拦截，比如提交前检查、命令权限、敏感文件保护。

## Codex 怎么安装 Skill

Codex 常见有三种方式。

第一种是用内置创建器：

```text
$skill-creator
```

它会问你这个 Skill 解决什么问题、什么时候触发、是否需要脚本和参考资料。第一次写 Skill，可以先让它生成骨架，再手动删掉多余内容。

第二种是安装已有 Skill：

```text
$skill-installer linear
```

`$skill-installer` 可以安装 curated skills，也能从指定仓库安装 Skill。装第三方 Skill 前，先看 `SKILL.md`、脚本、工具权限和来源。

第三种是手动放目录。

项目级 Skill：

```text
.agents/skills/<skill-name>/SKILL.md
```

个人通用 Skill：

```text
$HOME/.agents/skills/<skill-name>/SKILL.md
```

Codex 会从当前目录向上查找 `.agents/skills`。如果一个 Skill 只服务前端或后端模块，可以把它放在对应子目录下，减少误触发。

最小可用的 `SKILL.md` 可以这样写：

```markdown
---
name: pr-review
description: Review code changes for bugs, regressions, security issues, and missing tests. Use when reviewing a diff or pull request.
---

Review the current changes like a senior engineer.

Focus on:
- correctness bugs
- behavior regressions
- missing tests
- risky permissions

Report findings first. Keep summaries short.
```

## Claude Code 怎么安装 Skill

Claude Code 使用 `.claude/skills/` 目录，和 Codex 的 `.agents/skills/` 分开。

个人通用 Skill：

```bash
mkdir -p ~/.claude/skills/my-skill
code ~/.claude/skills/my-skill/SKILL.md
```

项目 Skill：

```bash
mkdir -p .claude/skills/my-skill
code .claude/skills/my-skill/SKILL.md
```

Claude Code 会监听这些目录里的变更。新建顶层目录后，如果当前会话没识别，重启 Claude Code。

调用方式要分开记：Codex 常用 `$skill-name`，Claude Code 用 `/skill-name`。

## 先装这 10 个 Skill

这 10 个 Skill 覆盖开发、排错、审查、写作和安全。你可以先装个人通用版本，再把团队流程沉淀成项目级版本。

### 1. skill-creator

用它创建或改进 Skill。让 Agent 先问清楚：这个 Skill 解决什么问题、触发条件是什么、需要哪些参考文件、是否需要脚本。

适合场景：你发现自己第三次复制同一段流程说明。

建议 description：

```text
Use when the user wants to create, improve, or package an agent skill.
```

### 2. skill-installer

用它安装 curated skills 或仓库里的 Skill。新机器初始化、团队同步工具、试用可信 Skill 时，它能少掉很多手工复制。

安装前先检查来源。Skill 可以带脚本，也可能要求宽工具权限。陌生仓库里的 `allowed-tools`、shell 命令和动态上下文注入都要看一眼。

### 3. code-review

让 Agent 用 reviewer 的标准看变更，先报问题，再写摘要。重点看：

- 真实 bug
- 行为回归
- 安全风险
- 缺失测试
- 迁移和兼容性问题

Claude Code 有类似 bundled skill。Codex 项目也可以写一个同类 Skill，把团队 review 口径固化下来。

### 4. fix-ci

处理“本地通过，CI 失败”的任务。流程写清楚：

1. 先读失败日志。
2. 找到最小失败用例。
3. 本地复现。
4. 小步修复。
5. 重跑相关检查。

如果团队用 GitHub CLI，可以把 `gh run view`、`gh pr checks`、`gh run download` 放进 supporting scripts 或动态上下文里。

### 5. openai-docs

写 OpenAI API、Codex CLI、Codex app、Responses API、Agents SDK 或模型迁移内容时，别让 Agent 靠记忆。这个 Skill 应要求 Agent 查官方文档，找不到就明确说找不到。

模型名、参数、surface 和配置项会变。教程和集成代码尤其需要这一层。

### 6. browser

前端改完要真看页面。这个 Skill 可以要求 Agent：

- 启动本地服务。
- 打开目标页面。
- 截图检查。
- 点击关键交互。
- 看移动端布局。
- 确认没有空白、遮挡、溢出。

React、Vue、Next、管理后台、组件库、小游戏和落地页都适合加这一关。

### 7. frontend-design

把你的 UI 规则写进去：按钮、表单、卡片、信息密度、颜色、动效、移动端断点。做页面、改组件、生成 dashboard 或落地页时，让 Agent 按这套标准执行。

可以明确禁止这些常见问题：

- 大面积蓝紫渐变。
- 空洞 hero 文案。
- 卡片套卡片。
- 第一屏只有装饰，没有功能或产品信息。
- 按钮文字挤出容器。

### 8. docs-writer

让项目文档按读者能执行的顺序写：

1. 这个项目解决什么问题。
2. 最短安装路径。
3. 最小运行命令。
4. 常见错误。
5. 真实示例。

README、SDK 文档、内部接入文档和升级说明都可以用它打底。

### 9. stop-slop

写博客、PR 描述、产品文案、FAQ 和教程前后都可以用。它要删掉模板腔，比如：

- 模板化开场白
- 空泛提醒句
- 宏大但没有事实支撑的转型判断
- 空泛转折
- 没有信息量的金句
- 看起来会总结但没有具体信息的段落

如果你经常写中文技术内容，把它放进个人目录。成稿前跑一遍。

### 10. security-check

Agent 补功能时，容易顺手放宽权限。security-check 至少要盯住：

- 命令注入
- 路径穿越
- 硬编码密钥
- SSRF
- 过宽 CORS
- 不安全反序列化
- 日志里泄露 token
- Agent 工具权限过宽

后端接口、MCP server、脚本工具、部署配置和自动化任务都需要这层检查。

## 推荐安装顺序

今天只装一轮，可以按这个顺序：

1. `skill-creator`
2. `code-review`
3. `fix-ci`
4. `openai-docs`
5. `browser`
6. `frontend-design`
7. `docs-writer`
8. `stop-slop`
9. `security-check`
10. `skill-installer`

先装能影响日常开发质量的 Skill，再装安装器。原因很简单：你先把 review、CI、文档、前端验收这些高频任务稳住，再用 installer 扩展其它场景。

## description 要写触发条件

Agent 会先看 `name` 和 `description`，再决定是否加载完整 Skill。`description` 写得模糊，Agent 就容易错过或误用。

不要这样写：

```yaml
description: Help with frontend work.
```

改成这样：

```yaml
description: Use when building or reviewing frontend UI. Check layout, spacing, responsive states, visual hierarchy, and interaction states before final delivery.
```

好 description 有三个信息：任务类型、触发场景、检查重点。

## 控制 Skill 数量

Skill 不是越多越好。初始列表太长，Agent 可能截断或选择困难。Claude Code 在加载 Skill 正文后也会消耗上下文。

可以按这几条控制规模：

- 个人通用 Skill 放个人目录。
- 项目流程放项目目录。
- 高风险 Skill 尽量手动触发。
- 只信任来源明确的脚本。
- 一个 Skill 只做一类工作。

当你第三次对 Agent 说同一套要求时，再把它写成 Skill。这个节奏比一次装几十个更稳。

## 结尾

Codex 和 Claude Code 已经能处理很多开发任务，但它们需要稳定的工作流。Skill 的价值不在于让 Agent “更聪明”，而在于把你反复强调的标准写成可复用规则。

先从这 10 个 Skill 开始：审代码、修 CI、查文档、看前端、写文档、改文案、查安全。等团队流程变清楚，再把项目自己的经验写进去。
