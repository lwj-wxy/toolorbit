# 用 DeepSeek API 跑 Claude Code CLI：一套更省钱的终端编程助手配置方案

## 快速结论

Claude Code CLI 可以通过 DeepSeek 的 Anthropic API 兼容接口运行。核心配置是把 `ANTHROPIC_BASE_URL` 指向 `https://api.deepseek.com/anthropic`，用 `ANTHROPIC_AUTH_TOKEN` 放入 DeepSeek API Key，再把主模型和轻量模型设置为 DeepSeek 当前适配 Claude Code 的模型名。

最后审校：2026-06-02。维护者：[ToolOrbit 编辑团队](/authors/toolorbit-editorial-team)。

Claude Code 是 Anthropic 推出的终端编程助手。它可以在项目目录里读代码、改文件、执行命令、排查 Bug、重构模块，也能帮你生成测试和解释复杂代码。对于经常写代码的人来说，它已经不只是一个聊天机器人，更像是一个能直接参与工程工作的 AI 编程同事。

但问题也很现实：如果高频使用 Claude Code，API 成本会累积得比较快。所以很多人会关心一个问题：

**能不能继续使用 Claude Code CLI 的工作流，但把后端模型换成 DeepSeek API？**

答案是：可以。

DeepSeek 官方已经提供 Anthropic API 兼容接口，并且给出了 Claude Code 的配置方式。也就是说，我们可以让 Claude Code CLI 继续作为终端工具使用，但把请求转发到 DeepSeek 的模型服务。

## 一、你需要准备什么

开始之前，本机需要准备好这几样东西：

1. Node.js 18 或更高版本
2. Claude Code CLI
3. DeepSeek API Key
4. 一个可以运行终端命令的项目目录

如果还没安装 Claude Code，可以先执行：

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后检查版本：

```bash
claude --version
```

DeepSeek API Key 可以在 DeepSeek Platform 后台创建。

API Key 是敏感信息，不要提交到 Git 仓库，也不要截图发给别人。

## 二、核心配置原理

Claude Code 支持通过环境变量修改 API 请求地址、认证 Token 和默认模型。

这次最关键的是这几个变量：

```bash
ANTHROPIC_BASE_URL
ANTHROPIC_AUTH_TOKEN
ANTHROPIC_MODEL
ANTHROPIC_DEFAULT_OPUS_MODEL
ANTHROPIC_DEFAULT_SONNET_MODEL
ANTHROPIC_DEFAULT_HAIKU_MODEL
CLAUDE_CODE_SUBAGENT_MODEL
CLAUDE_CODE_EFFORT_LEVEL
```

其中最核心的是：

```bash
ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
```

这行配置的意思是：让 Claude Code 把请求发到 DeepSeek 的 Anthropic 兼容接口。

DeepSeek 文档给出的 Claude Code 配置方向是：

```text
主模型：deepseek-v4-pro[1m]
快速模型：deepseek-v4-flash
API 地址：https://api.deepseek.com/anthropic
```

其中 `deepseek-v4-pro[1m]` 适合复杂代码任务和长上下文项目，`deepseek-v4-flash` 更适合子任务、快速响应和轻量场景。

## 三、macOS / Linux / WSL 配置方法

如果你使用 macOS、Linux 或 WSL，可以在终端里执行：

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
```

然后进入你的项目目录：

```bash
cd /path/to/your-project
claude
```

如果希望长期生效，可以把这些配置写入 `~/.zshrc` 或 `~/.bashrc`。

例如：

```bash
nano ~/.zshrc
```

写入后重新加载：

```bash
source ~/.zshrc
```

不过从安全角度看，API Key 不建议随意写进会被同步或共享的配置文件里。

## 四、Windows PowerShell 配置方法

如果你使用 Windows，可以在 PowerShell 里执行：

```powershell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<你的 DeepSeek API Key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```

然后进入项目目录：

```powershell
cd C:\your-project
claude
```

注意：PowerShell 里的 `$env:` 配置只对当前窗口生效。关闭这个 PowerShell 窗口后，下次需要重新设置。如果你想长期生效，可以设置用户级环境变量，但 API Key 仍然要注意保密。

## 五、推荐做法：写到项目本地配置

如果你只想让某个项目使用 DeepSeek，而不是全局影响所有 Claude Code 项目，可以使用 Claude Code 的本地配置文件。

在项目目录下创建：

```text
.claude/settings.local.json
```

写入：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的 DeepSeek API Key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  }
}
```

这种方式比较适合项目级使用。你可以让 A 项目使用 DeepSeek，让 B 项目继续使用原生 Claude，不同项目之间互不影响。

但要注意：`.claude/settings.local.json` 里如果写了 API Key，就不要提交到 Git。可以检查一下 `.gitignore` 是否已经忽略了本地配置文件。

## 六、为什么用 `ANTHROPIC_AUTH_TOKEN`，不是 `ANTHROPIC_API_KEY`

这是一个容易踩坑的地方。

Claude Code 支持多个认证相关环境变量。DeepSeek 的 Claude Code 集成文档推荐使用：

```bash
ANTHROPIC_AUTH_TOKEN
```

Claude Code 文档说明，`ANTHROPIC_AUTH_TOKEN` 会作为 Bearer Token 发送。而 `ANTHROPIC_API_KEY` 通常会作为 `X-Api-Key` 发送。

所以在 Claude Code + DeepSeek 这个场景里，建议优先按 DeepSeek 文档使用：

```bash
ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
```

这样可以减少鉴权方式不匹配的问题。

## 七、如何验证是否配置成功

配置完成后，在项目目录里启动：

```bash
claude
```

然后可以让它做一个简单任务，比如：

```text
请阅读当前项目结构，并总结主要模块。
```

如果能正常响应，说明基础配置已经跑通。

如果报错，可以优先检查这几项：

1. `ANTHROPIC_BASE_URL` 是否写成了 `https://api.deepseek.com/anthropic`
2. `ANTHROPIC_AUTH_TOKEN` 是否填写了正确的 DeepSeek API Key
3. 模型名是否拼写正确
4. 账户余额是否充足
5. 当前终端环境变量是否真的生效

macOS / Linux / WSL 可以检查：

```bash
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_MODEL
```

Windows PowerShell 可以检查：

```powershell
echo $env:ANTHROPIC_BASE_URL
echo $env:ANTHROPIC_MODEL
```

## 八、兼容性注意事项

虽然 DeepSeek 提供了 Anthropic API 兼容接口，但它不等于原生 Anthropic API 的所有能力都完整一致。

根据 DeepSeek 文档，兼容接口支持文本、工具调用、流式输出、thinking 等能力，但也有一些不支持或会被忽略的字段。例如多模态图片、文档输入、部分 MCP 相关消息类型，可能并不是完整兼容。

所以更准确的理解是：

**这套配置非常适合文本和代码为主的 Claude Code 工作流，但不一定适合所有复杂多模态或特殊工具链场景。**

如果你主要用 Claude Code 做代码阅读、项目重构、Bug 修复、测试生成，这套方案通常很实用。如果你依赖原生 Claude 的特殊能力，就需要按实际效果判断是否继续使用。

## 九、适合什么人使用

这套方案比较适合这几类人：

1. 高频使用 Claude Code，想降低 API 成本
2. 主要做代码类任务，不强依赖多模态输入
3. 项目上下文比较大，需要长上下文模型
4. 希望保留 Claude Code CLI 的终端工作流
5. 想在不同模型供应商之间灵活切换

简单说，如果你喜欢 Claude Code 的使用方式，但又想试试 DeepSeek 的成本和上下文优势，这个配置值得尝试。

## 十、总结

用 DeepSeek API 跑 Claude Code CLI，本质上只需要三步：

第一步，把 API 地址改成：

```bash
https://api.deepseek.com/anthropic
```

第二步，用：

```bash
ANTHROPIC_AUTH_TOKEN
```

填入 DeepSeek API Key。

第三步，把模型设置为：

```bash
deepseek-v4-pro[1m]
deepseek-v4-flash
```

这样就可以在保留 Claude Code CLI 工作流的同时，接入 DeepSeek 的模型服务。

当然，这不是“原生 Claude 平替”的万能答案，而是一个实用的兼容方案。适不适合你，最终还是要看你的任务类型、稳定性要求和成本预算。

## 参考资料

- [DeepSeek Claude Code 集成文档](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code)
- [DeepSeek Anthropic API 文档](https://api-docs.deepseek.com/guides/anthropic_api)
- [DeepSeek 模型与价格](https://api-docs.deepseek.com/quick_start/pricing)
- [Claude Code 环境变量文档](https://code.claude.com/docs/en/env-vars)
- [Claude Code 模型配置文档](https://code.claude.com/docs/en/model-config)
