# Codex CLI Configuration Guide: Set Up These 6 Things Before Letting It Write Code

Codex CLI is OpenAI's local command-line coding agent. It can read your project, edit files, run commands, and help with development tasks directly from the terminal. The official GitHub README describes Codex CLI as a lightweight coding agent that "runs locally on your computer" and can be installed through the install script, npm, Homebrew, or binary releases.([GitHub][1])

Last reviewed: 2026-06-11. Maintained by the [ToolOrbit Editorial Team](/authors/toolorbit-editorial-team).

Many first-time users hit the same problem: Codex CLI runs, but the workflow feels uneven. It may ask for command approval too often, fail to write files, skip project-level settings, or use a model and permission setup you did not intend. The issue is often not Codex itself. The basic configuration is missing.

This guide focuses on the 6 settings that matter most. Once they are in place, code review, bug fixing, test work, and refactoring become easier to run through Codex CLI.

## 1. Find and understand `config.toml`

Codex CLI's main configuration file is:

```toml
~/.codex/config.toml
```

OpenAI's documentation explains that user-level configuration lives in `~/.codex/config.toml` by default. Project-level configuration can live in `.codex/config.toml` inside a repository, but Codex only loads that project `.codex/` layer after you trust the project.([OpenAI Developers][2])

This matters because many users create `.codex/config.toml` in a project and then wonder why nothing changed. The file may be valid. The project may simply not be trusted yet.

Think about configuration in two layers:

| Location | Good for |
| --- | --- |
| `~/.codex/config.toml` | Personal default model, approval policy, sandbox mode, global MCP setup |
| `.codex/config.toml` | Repository-specific rules, project writable paths, project-level overrides |

Start with user-level configuration. Once that feels stable, add project-level configuration for larger repositories.

A minimal setup can look like this:

```toml
model = "gpt-5.5"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

These three lines control most day-to-day behavior: which model Codex uses, when it asks for approval, and whether it can write inside your project.

## 2. Set a default model instead of passing it every time

Codex CLI supports a default model in the configuration file. OpenAI's configuration basics page uses this example:

```toml
model = "gpt-5.5"
```

That setting controls the default model used by the CLI and IDE extension.([OpenAI Developers][2])

The model is worth setting early because it affects three things.

First, code understanding. Large projects, complex type systems, and multi-file refactors benefit from stronger reasoning.

Second, response speed. Small tasks may not need the strongest model, and a lighter configuration can be faster.

Third, cost or quota usage. If you use Codex through an API key, the model choice can affect usage cost.

A practical pattern is to use a stable default model for daily development, then switch to a higher-reasoning profile for deep review, architecture work, or difficult debugging.

For example:

```toml
model = "gpt-5.5"
model_reasoning_effort = "medium"
```

When you need deeper review, configure a separate profile with higher reasoning effort. That keeps the global default usable for small tasks.

## 3. Configure approvals so Codex is neither noisy nor risky

The approval policy controls whether Codex pauses before running commands. OpenAI documents common approval policies such as `untrusted`, `on-request`, and `never`. With `on-request`, Codex works inside the sandbox by default and asks when it needs to go outside that boundary. With `never`, it does not stop for approval prompts.([OpenAI Developers][3])

Most developers should start with:

```toml
approval_policy = "on-request"
```

This is the balanced choice. It avoids approving every small step, but it still keeps a human gate for actions outside the configured boundary.

If you are new to Codex CLI or working in a sensitive repository, use a stricter mode:

```toml
approval_policy = "untrusted"
```

If you are running disposable automation in a temporary container with no sensitive data, you can consider:

```toml
approval_policy = "never"
```

Do not use `never` as your normal default. A coding agent can run shell commands, edit many files, and launch test scripts. Without an approval boundary, a bad instruction can have a larger blast radius.

A simple policy table:

| Scenario | Suggested approval policy |
| --- | --- |
| First-time trial | `untrusted` |
| Daily development | `on-request` |
| Temporary automation environment | `never` |
| Company or sensitive repository | `on-request` or stricter |

The goal is not to make approvals as loose as possible. The goal is to let Codex automate inside a safe boundary and pause when it needs to cross that boundary.

## 4. Configure sandbox mode so Codex knows what it can touch

Sandbox mode controls what Codex CLI can read, write, and execute. OpenAI documents common sandbox modes such as `read-only`, `workspace-write`, and `danger-full-access`. `workspace-write` lets Codex read files, edit inside the workspace, and run routine local commands. `danger-full-access` removes filesystem and network boundaries, so use it only when you intentionally want full access.([OpenAI Developers][3])

The recommended default is:

```toml
sandbox_mode = "workspace-write"
```

This mode fits most development tasks:

* editing code files
* adding tests
* running local test commands
* refactoring project modules
* fixing lint or type errors

If you only want Codex to read code, explain a project, or perform review without edits, use:

```toml
sandbox_mode = "read-only"
```

If you are in an isolated container and need full access, use:

```toml
sandbox_mode = "danger-full-access"
```

That mode is a poor default on a normal development machine. It weakens the protection that limits mistakes to the current project.

A safer habit is to keep `workspace-write` as the default and loosen access only for a specific trusted workflow.

## 5. Configure project rules and the trust boundary

Codex CLI supports both user-level and project-level configuration. OpenAI documents the configuration precedence roughly as CLI flags and `--config` overrides, project configuration, profiles, user configuration, system configuration, and built-in defaults.([OpenAI Developers][2])

This means a command-line override can beat your config file. A project `.codex/config.toml` can override part of your user default. A profile can add another layer.

A team project might use a `.codex/config.toml` like this:

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"

[sandbox_workspace_write]
writable_roots = [
  ".",
  "/tmp"
]
```

Project-level configuration is useful when:

First, the repository needs a fixed security boundary. For example, Codex can write the current repository but not the user directory.

Second, the project needs extra writable paths for build caches, temporary output, or snapshots.

Third, the team wants consistent Codex behavior across contributors.

Do not put every personal preference into project configuration. Default model, personal MCP servers, notifications, and auth-related settings usually belong in user-level configuration. OpenAI's configuration reference also notes that project-level configuration cannot override some machine-local provider, auth, notification, and telemetry keys.([OpenAI Developers][4])

A short rule: project configuration describes how this repository uses Codex. User configuration describes how you use Codex.

## 6. Set up profiles for different tasks

Profiles are one of the most useful Codex CLI features, but many users ignore them. OpenAI's advanced configuration docs explain that profiles save named configuration layers and can be selected with `--profile profile-name`. Each profile file lives at `~/.codex/profile-name.config.toml` and uses top-level configuration keys, not a nested `[profiles.profile-name]` table.([OpenAI Developers][5])

That lets you keep different modes without rewriting the same `config.toml`.

For daily development:

```toml
# ~/.codex/config.toml
model = "gpt-5.5"
model_reasoning_effort = "medium"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

For deep review:

```toml
# ~/.codex/deep-review.config.toml
model = "gpt-5.5"
model_reasoning_effort = "xhigh"
approval_policy = "on-request"
sandbox_mode = "read-only"
```

Run it with:

```bash
codex --profile deep-review
```

This profile fits code review because it raises reasoning effort and uses `read-only` to avoid accidental edits during review.

You can also create an automatic-fix profile:

```toml
# ~/.codex/fix.config.toml
model = "gpt-5.5"
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

Then run:

```bash
codex --profile fix
```

Profiles keep intent visible. You do not need to rethink write access, reasoning effort, and approval strictness for every task.

## A good starter configuration

If you want a simple starting point, use this:

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

This setup lets Codex edit code in the current project, keeps network access off by default, and asks for approval when it needs to cross the boundary. For most personal projects and daily work, this is a solid baseline.

OpenAI's sandbox documentation notes that default permissions usually let Codex read and edit the current workspace and run routine local commands. When it needs internet access or access outside the workspace, it asks for approval.([OpenAI Developers][3])

You do not need a complex configuration on day one. Set model, approval policy, and sandbox mode first. Add profiles, project-level configuration, and MCP later.

## Common mistake: why did my configuration not take effect?

When configuration does not work, check these 5 things.

First, confirm the file path. User-level configuration belongs here:

```bash
~/.codex/config.toml
```

Second, check TOML syntax. Strings need quotes. Booleans do not:

```toml
model = "gpt-5.5"
network_access = false
```

Third, check whether a command-line flag overrode your file. Codex gives CLI flags and `--config` the highest precedence.([OpenAI Developers][2])

Fourth, check whether the project is trusted. If the project is not trusted, Codex skips the project-level `.codex/` configuration layer.([OpenAI Developers][2])

Fifth, check whether your profile format is outdated. Current OpenAI docs describe profiles as separate `~/.codex/profile-name.config.toml` files with top-level configuration keys, not `[profiles.name]` tables inside the main config file.([OpenAI Developers][5])

## FAQ: Codex CLI configuration

### 1. Where is the Codex CLI configuration file?

By default, it is `~/.codex/config.toml`. For project-level configuration, create `.codex/config.toml` inside the repository, but Codex only loads that file after the project is trusted.([OpenAI Developers][2])

### 2. Which approval policy should beginners use?

Use `approval_policy = "on-request"`. It lets Codex work inside the sandbox and asks for approval when it needs to go outside the boundary.

### 3. Can I keep `sandbox_mode = "danger-full-access"` on all the time?

Do not use it as your normal default. OpenAI's docs state that this mode removes sandbox restrictions, including filesystem and network boundaries. It fits cases where you intentionally want full access, not ordinary development machines.([OpenAI Developers][3])

### 4. What is the difference between a profile and project configuration?

A profile is your personal work mode, such as deep review, quick fix, or read-only analysis. Project configuration is a repository rule, such as which directories Codex can write and which permission setup the project expects.

### 5. Can I override configuration for one command?

Yes. OpenAI's advanced configuration docs explain that Codex supports dedicated flags and `-c` or `--config` for one-off overrides, such as temporarily setting a model or overriding a configuration key.([OpenAI Developers][5])

### 6. Do Codex CLI and the IDE extension use separate configuration?

OpenAI's configuration basics docs state that CLI and IDE extension share the same configuration layers. You can open `config.toml` from the IDE extension or edit it by hand.([OpenAI Developers][2])

## Conclusion: set boundaries before chasing speed

Codex CLI works better when you define boundaries before asking it to make broad changes.

Set the default model so Codex uses the capability you expect. Set approval policy so you control when it needs your confirmation. Set sandbox mode so it knows where it can read, write, and execute. Use project configuration for repository differences. Use profiles for daily development, deep review, and automatic fixes.

A good Codex CLI setup should be safe by default, smooth for daily work, and easy to loosen when a trusted workflow needs more access.

[1]: https://github.com/openai/codex "GitHub - openai/codex: Lightweight coding agent that runs in your terminal"
[2]: https://developers.openai.com/codex/config-basic "Config basics - Codex | OpenAI Developers"
[3]: https://developers.openai.com/codex/concepts/sandboxing "Sandbox - Codex | OpenAI Developers"
[4]: https://developers.openai.com/codex/config-reference "Configuration Reference - Codex | OpenAI Developers"
[5]: https://developers.openai.com/codex/config-advanced "Advanced Configuration - Codex | OpenAI Developers"
