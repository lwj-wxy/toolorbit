# Codex 如何安装和使用 Skill

## 快速结论

Codex Skill 是一组可复用的工作流说明，用来告诉 Codex 在某类任务中应该如何读文件、用工具、跑脚本、校验和交付。安装时要选择可信来源，安装后重启 Codex，再通过技能名称或匹配场景触发使用。

最后审校：2026-05-27。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

Skill 能让 Codex 的行为更稳定。你不需要每次重复一大段说明，而是把“什么时候用、怎么做、要避开什么、最后交付什么”写进一个 Skill。OpenAI 的 [Codex Skills 文档](https://developers.openai.com/codex/skills) 是理解这个机制的官方入口。

在日常项目里，Skill 很适合处理重复工作流：图片生成、SEO 审计、PDF 处理、表格处理、Figma、GitHub Review、前端设计系统、仓库级质量规范等。

## 什么是 Codex Skill？

一个 Skill 通常是一个包含 `SKILL.md` 的目录。这个文件会描述技能用途、触发条件、工作流、约束和参考资料。有些 Skill 还会附带脚本、模板、素材或数据库。

Skill 的描述很重要，因为 Codex 会根据它判断什么时候应该使用这个技能。好的 Skill 不是一段提示词，而是一份小型操作手册。

## Skill 安装在哪里？

在本地 Codex 环境里，用户安装的 Skill 通常放在：

```text
~/.codex/skills
```

系统 Skill 可能已经预装在 Codex 管理目录下，一般不需要重新安装。

安装新 Skill 后，要重启 Codex，让新会话重新发现这些技能。如果你刚安装完就发现 Codex 看不到，大概率是还没有重启。

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

## 从 GitHub 安装

Skill 也可以来自 GitHub 仓库路径。这适合团队私有工作流或实验性技能。只安装可信来源，因为 Skill 可能包含脚本和会影响操作行为的规则。

典型请求类似：

```text
Install the Codex skill from github.com/owner/repo at skills/my-workflow.
```

私有仓库可能需要本地 Git 凭据或 token。把它当作普通的软件供应链问题处理：使用前先检查 Skill 目录内容。

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

## 如何判断 Skill 质量？

一个有用的 Skill 应该说明：

- 什么时候使用，什么时候不要使用。
- 行动前需要收集哪些输入。
- 优先读取哪些文件或使用哪些脚本。
- 有哪些安全约束。
- 最终应该交付什么。

弱 Skill 往往很泛，比如“做一个好 UI”或“做 SEO”，但没有工作流。强 Skill 会降低歧义，让重复任务更稳定。

## 团队使用建议

Skill 应该保持聚焦。设计 Skill、图片生成 Skill、SEO 审计 Skill 通常应该分开。这样更容易预测，也更容易测试。

重要 Skill 应该进 Git 管理。如果它影响团队工作流，就应该像代码一样审查、记录假设、保留示例。

编辑元数据时可以用 [JSON 格式化工具](/tools/dev/json-formatter)，比较 Skill 版本可以用 [文本对比工具](/tools/dev/text-diff)，起草可复用说明可以用 [AI 提示词生成器](/tools/ai/prompt-generator)。

## 常见坑

最常见的问题是安装完 Skill 后继续使用旧会话。安装后要重启 Codex。

第二个问题是安装未审查的 Skill。Skill 可能包含脚本或规则，会影响文件编辑、网络访问和工作流判断。

第三个问题是把所有东西塞进一个巨大 Skill。小而清晰的 Skill 更容易测试，也更容易被 Codex 正确选择。

第四个问题是忘记仓库规则。Skill 不会覆盖项目里的 `AGENTS.md` 等本地规范，仓库规则仍然优先。

## 总结

Codex Skill 的价值在于把重复判断变成可复用流程。只安装需要的 Skill，安装后重启，使用时明确触发，并像审查自动化脚本一样审查 Skill 内容。
