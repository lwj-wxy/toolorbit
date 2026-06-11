# Codex CLI 实用配置指南：先把这 6 件事配好，再开始让它写代码

Codex CLI 是 OpenAI 推出的本地命令行 coding agent，可以直接在你的终端里读取项目、修改文件、运行命令，并辅助完成开发任务。官方 GitHub README 也明确说明，Codex CLI 是一个 "runs locally on your computer" 的轻量级 coding agent，支持通过安装脚本、npm、Homebrew 或二进制包安装。([GitHub][1])

博文更新时间：2026-06-11。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

很多人第一次用 Codex CLI 时会遇到同一个问题：工具能跑，但体验不稳定。有时它频繁问你要不要批准命令，有时它不能写文件，有时项目配置不生效，有时模型和权限不是你想要的默认值。问题不一定出在 Codex 本身，而是你还没把基础配置理顺。

这篇博客不讲复杂理论，只讲最实用的 6 件事。把它们配好之后，你再用 Codex CLI 做代码审查、修 bug、补测试、重构项目，体验会顺很多。

## 1. 先找到并理解 `config.toml`

Codex CLI 的核心配置文件是：

```toml
~/.codex/config.toml
```

官方文档说明，用户级配置默认放在 `~/.codex/config.toml`，项目级配置可以放在仓库里的 `.codex/config.toml`；但出于安全考虑，Codex 只会在你信任该项目后加载项目级 `.codex/` 配置层。([OpenAI 开发者][2])

这点非常重要。因为很多人会在项目目录里新建 `.codex/config.toml`，然后发现“怎么没生效”。原因可能不是写错了，而是项目还没有被 Codex 标记为可信。

你可以把配置分成两类：

| 配置位置 | 适合放什么 |
| --- | --- |
| `~/.codex/config.toml` | 个人默认模型、默认审批策略、默认沙箱模式、全局 MCP |
| `.codex/config.toml` | 当前项目专属规则、项目写入路径、项目级覆盖配置 |

建议先从用户级配置开始，不要一上来就在每个项目里放复杂配置。用户级配置稳定之后，再针对大型项目添加项目级配置。

一个最小配置可以这样写：

```toml
model = "gpt-5.5"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

这三行已经能决定 Codex CLI 的大部分日常行为：用哪个模型、什么时候问你、能不能写项目文件。

## 2. 配好默认模型，不要每次手动指定

Codex CLI 支持通过配置文件设置默认模型。官方配置基础文档给出的示例是：

```toml
model = "gpt-5.5"
```

它用于选择 CLI 和 IDE 扩展默认使用的模型。([OpenAI 开发者][2])

为什么这件事值得优先配置？因为模型会直接影响三件事：

第一，代码理解能力。大型项目、复杂类型系统、多文件重构，更依赖强推理模型。

第二，响应速度。简单任务不一定需要最强模型，用中等能力模型可能更快。

第三，成本或额度消耗。如果你通过 API key 使用 Codex，模型选择也会影响使用成本。

推荐做法是：日常开发使用一个稳定默认模型；深度审查、架构重构、复杂 debug 再切换高推理配置。

例如：

```toml
model = "gpt-5.5"
model_reasoning_effort = "medium"
```

当你需要更深的代码审查，可以通过 Profile 单独配置高推理模式，而不是把全局默认值调得过重。这样既节省资源，也不会让每个小任务都变慢。

## 3. 配好审批策略：别让 Codex 既烦人又危险

Codex CLI 的审批策略控制它在运行命令前是否暂停询问。官方文档列出了常见审批策略：`untrusted`、`on-request` 和 `never`。其中，`on-request` 表示 Codex 默认在沙箱内工作，只有需要越界时才会请求批准；`never` 表示不会因为审批提示而停下来。([OpenAI 开发者][3])

建议大多数开发者使用：

```toml
approval_policy = "on-request"
```

这是一个比较平衡的选择。它不会每一步都打断你，也不会完全放手让 Codex 自己执行所有操作。

如果你刚开始试用 Codex CLI，或者项目很敏感，可以选择更保守的方式：

```toml
approval_policy = "untrusted"
```

如果你在一次性容器、临时目录、无敏感数据的实验环境里跑自动化任务，才考虑：

```toml
approval_policy = "never"
```

但不要把 `never` 当成默认配置。因为 coding agent 不是普通代码补全工具，它可能会执行 shell 命令、批量改文件、调用测试脚本。如果没有审批边界，出错时影响会更大。

实用建议是：

| 使用场景 | 推荐审批策略 |
| --- | --- |
| 新手试用 | `untrusted` |
| 日常开发 | `on-request` |
| 自动化临时环境 | `never` |
| 公司项目或敏感仓库 | `on-request` 或更严格 |

审批策略不是越宽松越好。真正高效的配置，是让 Codex 在安全范围内尽量自动化，在越界时及时停下来问你。

## 4. 配好沙箱模式：决定 Codex 能碰哪里

沙箱模式决定 Codex CLI 能读取、写入和执行到什么程度。官方文档说明，常见沙箱模式包括：`read-only`、`workspace-write` 和 `danger-full-access`。其中 `workspace-write` 允许 Codex 在当前工作区内读写文件并运行常规本地命令，也是本地开发常用的低摩擦模式；`danger-full-access` 会移除文件系统和网络边界，应只在你确实希望 Codex 拥有完整访问权限时使用。([OpenAI 开发者][3])

推荐默认配置：

```toml
sandbox_mode = "workspace-write"
```

这个配置适合大多数日常开发任务，比如：

* 修改代码文件
* 新增测试
* 运行本地测试命令
* 重构项目内模块
* 修复 lint 或类型错误

如果你只是想让 Codex 读代码、解释项目、做审查，不希望它直接改文件，可以使用：

```toml
sandbox_mode = "read-only"
```

如果你在隔离容器里运行，并且明确需要完全访问权限，可以使用：

```toml
sandbox_mode = "danger-full-access"
```

但这个模式不适合普通开发机默认开启。它会削弱沙箱保护，一旦 Codex 执行了错误命令，影响范围可能超出当前项目。

更稳妥的思路是：默认 `workspace-write`，必要时临时放宽。不要为了少点几次确认，就长期打开全权限。

## 5. 配好项目级规则和信任边界

Codex CLI 支持用户级配置，也支持项目级 `.codex/config.toml`。官方文档说明，配置优先级从高到低大致是：CLI flags 和 `--config` 覆盖、项目配置、Profile、用户配置、系统配置、内置默认值。([OpenAI 开发者][2])

这意味着：如果你在命令行里临时传了参数，它会覆盖配置文件；如果项目里有 `.codex/config.toml`，它可能覆盖你的用户级默认值；如果你使用了 Profile，也会叠加一层配置。

一个适合团队项目的 `.codex/config.toml` 可以这样写：

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"

[sandbox_workspace_write]
writable_roots = [
  ".",
  "/tmp"
]
```

项目级配置适合解决这类问题：

第一，项目需要固定安全边界。比如只允许 Codex 写当前仓库，不允许碰用户目录。

第二，项目需要额外可写目录。比如构建缓存、临时输出目录、测试快照目录。

第三，团队希望统一 Codex 行为。比如所有成员都使用相同审批策略和项目规则。

不过，不建议把所有个人偏好写进项目配置。像默认模型、个人 MCP 服务、通知方式、认证相关配置，更适合放在用户级配置里。官方配置参考也指出，项目级配置不能覆盖一些机器本地 provider、auth、通知、遥测等键；这些应放在用户级配置中。([OpenAI 开发者][4])

简单说：项目配置管“这个仓库怎么用 Codex”，用户配置管“我个人怎么用 Codex”。

## 6. 配好 Profile：为不同任务准备不同模式

Profile 是 Codex CLI 里非常实用但容易被忽略的功能。官方高级配置文档说明，Profile 可以保存命名配置层，并通过 `--profile profile-name` 从 CLI 切换；Profile 文件放在 `~/.codex/profile-name.config.toml`，使用顶层配置键，不要再嵌套到 `[profiles.profile-name]` 下。([OpenAI 开发者][5])

这意味着你可以为不同任务准备不同配置，而不是频繁改同一个 `config.toml`。

比如，日常开发使用默认配置：

```toml
# ~/.codex/config.toml
model = "gpt-5.5"
model_reasoning_effort = "medium"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

再创建一个深度审查 Profile：

```toml
# ~/.codex/deep-review.config.toml
model = "gpt-5.5"
model_reasoning_effort = "xhigh"
approval_policy = "on-request"
sandbox_mode = "read-only"
```

使用时运行：

```bash
codex --profile deep-review
```

这个 Profile 很适合做代码审查。它可以提高推理强度，同时用 `read-only` 限制写入，避免 Codex 在审查时顺手改文件。

你还可以准备一个自动修复 Profile：

```toml
# ~/.codex/fix.config.toml
model = "gpt-5.5"
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

然后这样使用：

```bash
codex --profile fix
```

Profile 的好处是清晰。你不用每次都思考“这次要不要开写权限、要不要高推理、要不要更严格审批”。不同任务一个 Profile，打开就用。

## 推荐的一套起步配置

如果你只想快速开始，可以直接参考下面这份配置：

```toml
# ~/.codex/config.toml

model = "gpt-5.5"
model_reasoning_effort = "medium"

approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
writable_roots = ["."]
network_access = false
```

这套配置的思路是：允许 Codex 在当前项目里改代码，但默认不开放网络访问；当它需要越界时，让它询问你。对大多数个人项目和日常开发来说，这是一个比较稳的起点。

需要注意的是，官方沙箱说明里提到，默认权限通常允许 Codex 读取和编辑当前 workspace，并运行常规本地命令；当它要使用互联网或越过 workspace 边界时会请求批准。([OpenAI 开发者][3])

所以，你不必一开始就配置得特别复杂。先把模型、审批、沙箱这三个核心项设好，再逐步加入 Profile、项目级配置和 MCP。

## 常见错误：为什么我的配置不生效？

配置不生效时，通常先检查这 5 点。

第一，文件路径是否正确。用户级配置应放在：

```bash
~/.codex/config.toml
```

第二，TOML 格式是否正确。字符串要加引号，布尔值不要加引号：

```toml
model = "gpt-5.5"
network_access = false
```

第三，是否被命令行参数覆盖。Codex 的配置优先级中，CLI flags 和 `--config` 覆盖优先级最高。([OpenAI 开发者][2])

第四，项目是否可信。如果项目未被信任，Codex 会跳过项目级 `.codex/` 配置层。([OpenAI 开发者][2])

第五，Profile 写法是否过时。较新的官方文档说明，Profile 应放在单独的 `~/.codex/profile-name.config.toml` 文件中，并用顶层配置键，而不是写在主配置里的 `[profiles.name]` 表下面。([OpenAI 开发者][5])

## FAQ：Codex CLI 配置常见问题

### 1. Codex CLI 配置文件在哪里？

默认在 `~/.codex/config.toml`。如果要做项目级配置，可以在仓库里创建 `.codex/config.toml`，但项目需要被信任后才会加载该配置。([OpenAI 开发者][2])

### 2. 新手应该用什么审批策略？

建议使用 `approval_policy = "on-request"`。它能让 Codex 在沙箱内正常工作，遇到越界操作时再请求批准，兼顾效率和安全。

### 3. `sandbox_mode = "danger-full-access"` 可以长期打开吗？

不建议。官方文档说明该模式会移除沙箱限制，包括文件系统和网络边界，适合明确需要完整访问权限的场景。普通开发机最好不要把它设为默认值。([OpenAI 开发者][3])

### 4. Profile 和项目配置有什么区别？

Profile 是你的个人工作模式，比如“深度审查”“快速修复”“只读分析”。项目配置是某个仓库的规则，比如允许写哪些目录、默认采用什么项目级权限。

### 5. 我可以临时覆盖配置吗？

可以。官方高级配置文档说明，Codex 支持通过专用 flag 或 `-c` / `--config` 做单次覆盖，例如临时指定模型或覆盖某个配置键。([OpenAI 开发者][5])

### 6. Codex CLI 和 IDE 扩展配置是分开的吗？

官方配置基础文档说明，CLI 和 IDE 扩展共享相同的配置层。你可以在 IDE 扩展里打开 `config.toml`，也可以手动编辑文件。([OpenAI 开发者][2])

## 结论：先配边界，再谈效率

Codex CLI 真正好用的关键，不是装完就马上让它大改项目，而是先把边界配清楚。

先设置默认模型，让它稳定使用你想要的能力；再设置审批策略，决定什么时候需要你点头；接着设置沙箱模式，控制它能写哪里、能访问什么；然后用项目配置处理仓库差异；最后用 Profile 区分日常开发、深度审查和自动修复。

一套好的 Codex CLI 配置，应该做到三点：默认安全、日常顺手、需要时可放宽。这样你既能享受 AI coding agent 带来的效率，也不会把项目安全完全交给一次自动执行。

[1]: https://github.com/openai/codex "GitHub - openai/codex: Lightweight coding agent that runs in your terminal"
[2]: https://developers.openai.com/codex/config-basic "Config basics - Codex | OpenAI Developers"
[3]: https://developers.openai.com/codex/concepts/sandboxing "Sandbox - Codex | OpenAI Developers"
[4]: https://developers.openai.com/codex/config-reference "Configuration Reference - Codex | OpenAI Developers"
[5]: https://developers.openai.com/codex/config-advanced "Advanced Configuration - Codex | OpenAI Developers"
