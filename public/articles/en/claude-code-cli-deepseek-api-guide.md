# Run Claude Code CLI with the DeepSeek API: A Lower-Cost Terminal Coding Assistant Setup

## TL;DR

Claude Code CLI can run against DeepSeek's Anthropic-compatible API. The essential setup is to point `ANTHROPIC_BASE_URL` at `https://api.deepseek.com/anthropic`, put your DeepSeek API key in `ANTHROPIC_AUTH_TOKEN`, and map Claude Code's main and lightweight model variables to DeepSeek models.

Post updated: 2026-06-02. Maintained by the [ToolOrbit Editorial Team](/authors/toolorbit-editorial-team).

Claude Code is Anthropic's terminal-based coding assistant. It can read code inside a project directory, edit files, run commands, debug issues, refactor modules, generate tests, and explain complex code. For frequent coding work, it feels less like a chatbot and more like an AI teammate that can participate directly in engineering tasks.

The practical concern is cost. If you use Claude Code heavily, API usage can add up quickly. That leads to a common question:

**Can you keep the Claude Code CLI workflow while switching the backend model provider to DeepSeek?**

Yes.

DeepSeek provides an Anthropic-compatible API and documents a Claude Code configuration path. That means Claude Code CLI can remain your terminal interface while requests are routed to DeepSeek's model service.

## Prepare the Local Environment

Before starting, make sure you have:

1. Node.js 18 or newer
2. Claude Code CLI
3. A DeepSeek API key
4. A project directory where you can run terminal commands

If Claude Code is not installed yet, run:

```bash
npm install -g @anthropic-ai/claude-code
```

Then verify the installation:

```bash
claude --version
```

Create your DeepSeek API key in the DeepSeek Platform dashboard.

API keys are sensitive. Do not commit them to Git and do not share screenshots that expose them.

## Route Claude Code Through DeepSeek

Claude Code supports environment variables for the API endpoint, auth token, and default models.

The key variables are:

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

The most important one is:

```bash
ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
```

This tells Claude Code to send Anthropic-format requests to DeepSeek's compatible endpoint.

DeepSeek's Claude Code setup points to this model split:

```text
Main model: deepseek-v4-pro[1m]
Fast model: deepseek-v4-flash
API endpoint: https://api.deepseek.com/anthropic
```

`deepseek-v4-pro[1m]` is better suited to complex coding tasks and long-context projects. `deepseek-v4-flash` is a better fit for subagents, fast responses, and lighter work.

## Temporary Setup for macOS, Linux, and WSL

On macOS, Linux, or WSL, run:

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<your DeepSeek API key>
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
```

Then enter your project directory:

```bash
cd /path/to/your-project
claude
```

If you want the variables to persist, add them to `~/.zshrc` or `~/.bashrc`.

For example:

```bash
nano ~/.zshrc
```

Reload the shell config:

```bash
source ~/.zshrc
```

From a security perspective, avoid putting API keys in files that are synced, shared, or committed.

## Temporary Setup for Windows PowerShell

On Windows, run this in PowerShell:

```powershell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<your DeepSeek API key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```

Then enter your project directory:

```powershell
cd C:\your-project
claude
```

PowerShell `$env:` assignments only apply to the current window. After closing that window, you need to set them again. You can use user-level environment variables for persistence, but still handle API keys carefully.

## Project-Local Settings Are Safer

If only one project should use DeepSeek, use Claude Code's local settings file instead of changing your global shell environment.

Create this file in the project:

```text
.claude/settings.local.json
```

Add:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "your DeepSeek API key",
    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  }
}
```

This is useful for project-level routing. Project A can use DeepSeek while Project B continues to use native Claude. The two setups do not have to interfere with each other.

If `.claude/settings.local.json` contains an API key, do not commit it. Check that `.gitignore` excludes local Claude settings.

## Use `ANTHROPIC_AUTH_TOKEN` for DeepSeek

This is an easy place to make a mistake.

Claude Code supports multiple authentication-related environment variables. DeepSeek's Claude Code integration recommends:

```bash
ANTHROPIC_AUTH_TOKEN
```

Claude Code documentation says `ANTHROPIC_AUTH_TOKEN` is sent as a Bearer token. `ANTHROPIC_API_KEY` is commonly sent as `X-Api-Key`.

For Claude Code + DeepSeek, prefer the DeepSeek-documented option:

```bash
ANTHROPIC_AUTH_TOKEN=<your DeepSeek API key>
```

That reduces the chance of using the wrong authentication header.

## Check Whether Claude Code Is Using DeepSeek

After configuration, start Claude Code in your project directory:

```bash
claude
```

Ask for a simple project-level task:

```text
Please read the current project structure and summarize the main modules.
```

If it responds normally, the basic setup is working.

If it fails, check:

1. Whether `ANTHROPIC_BASE_URL` is exactly `https://api.deepseek.com/anthropic`
2. Whether `ANTHROPIC_AUTH_TOKEN` contains a valid DeepSeek API key
3. Whether the model names are spelled correctly
4. Whether the account has enough balance
5. Whether the current terminal really has the environment variables loaded

On macOS / Linux / WSL:

```bash
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_MODEL
```

On Windows PowerShell:

```powershell
echo $env:ANTHROPIC_BASE_URL
echo $env:ANTHROPIC_MODEL
```

## Compatibility Boundaries

DeepSeek's Anthropic-compatible API is not identical to the native Anthropic API.

According to DeepSeek's documentation, the compatible endpoint supports text, tool calls, streaming output, thinking, and related features. Some fields may be unsupported or ignored. Multimodal image input, document input, and some MCP-related message types may not be fully compatible.

The practical takeaway:

**This setup is well suited to text-heavy and code-heavy Claude Code workflows, but it may not cover every advanced multimodal or specialized toolchain scenario.**

If you mainly use Claude Code for code reading, refactoring, bug fixes, and test generation, the setup is often useful. If you rely on native Claude-only capabilities, test the workflow before making it your default.

## Who Should Use This Setup

This configuration is useful if you:

1. Use Claude Code frequently and want lower API costs
2. Mostly run coding tasks rather than multimodal tasks
3. Work with larger project contexts
4. Want to keep Claude Code's terminal workflow
5. Want flexibility across model providers

In short, if you like how Claude Code works but want to try DeepSeek's cost and context advantages, this setup is worth testing.

## Keep the CLI Workflow, Swap the Model Backend

Running Claude Code CLI with the DeepSeek API comes down to three steps.

First, set the API endpoint:

```bash
https://api.deepseek.com/anthropic
```

Second, put your DeepSeek API key in:

```bash
ANTHROPIC_AUTH_TOKEN
```

Third, configure the models:

```bash
deepseek-v4-pro[1m]
deepseek-v4-flash
```

This keeps the Claude Code CLI workflow while routing model calls through DeepSeek.

It is not a universal native-Claude replacement. It is a practical compatibility setup. Whether it fits depends on your task type, reliability needs, and cost budget.

## References

- [DeepSeek Claude Code integration](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code)
- [DeepSeek Anthropic API docs](https://api-docs.deepseek.com/guides/anthropic_api)
- [DeepSeek models and pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [Claude Code environment variables](https://code.claude.com/docs/en/env-vars)
- [Claude Code model configuration](https://code.claude.com/docs/en/model-config)
