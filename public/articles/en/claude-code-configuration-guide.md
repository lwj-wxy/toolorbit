# Claude Code Configuration Guide: Set Up These 7 Things First

Claude Code can read code, edit files, run commands, call tools, and complete multi-step development tasks. The more active it becomes, the more it needs clear boundaries. When the setup is weak, the problem is often not that the model cannot write code. It lacks project rules, interrupts too often, or reaches files it should not touch.

Last reviewed: 2026-06-11. Maintained by the [ToolOrbit Editorial Team](/authors/toolorbit-editorial-team).

Before using Claude Code in a real project, set up these 7 areas: settings scopes, permissions, project memory, ignore rules, MCP, hooks, and environment variables. Once they are in place, Claude Code behaves more like a pair programmer who understands project boundaries, team conventions, and safe collaboration.

## 1. Understand where Claude Code stores configuration

Claude Code configuration mostly revolves around `settings.json` and `CLAUDE.md`. The official settings documentation explains that you can run `/config` in the interactive REPL to open the settings interface, or manage behavior through configuration files.([Claude Code][1])

Think about the common locations this way:

```bash
~/.claude/settings.json
```

This is user-level configuration. Use it for defaults on your machine, such as common permissions, environment variables, notification settings, and personal preferences.

```bash
.claude/settings.json
```

This is project-level configuration. Use it for repository rules, such as which commands are allowed, which paths are blocked, and which tool behavior the team wants to standardize.

```bash
.claude/settings.local.json
```

This is local project configuration. Use it for settings that should only affect your machine, such as temporary paths, personal environment variables, or local debugging habits. Do not commit it to Git.

A simple project configuration can look like this:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(.env)",
      "Read(**/.env)"
    ]
  }
}
```

This config sets a clear boundary: Claude Code can run tests, check code, and inspect Git status, but it cannot run dangerous deletion commands or read `.env` files.

Put personal preferences in `~/.claude/settings.json`, team rules in `.claude/settings.json`, and private local overrides in `.claude/settings.local.json`. Keeping those layers separate reduces collaboration friction.

## 2. Configure permissions before granting access

Claude Code is useful because it can operate directly inside your project. That also makes permissions the first safety boundary to configure. The official permissions documentation explains that `/permissions` lets you view and manage tool permissions and see which `settings.json` file each rule came from.([Claude Code][2])

Use a cautious default, then expand access as the project needs it.

You do not need to allow everything on day one. Start with safe commands, then add more permissions with intent.

Recommended baseline for JavaScript and TypeScript projects:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git log --oneline -10)",
      "Bash(npm test)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(npm run typecheck)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(chmod -R 777 *)",
      "Bash(curl * | sh)",
      "Bash(wget * | sh)",
      "Read(.env)",
      "Read(**/.env)",
      "Read(**/id_rsa)",
      "Read(**/credentials*)"
    ]
  }
}
```

For a Python project, adjust the allowed commands:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(pytest)",
      "Bash(ruff check .)",
      "Bash(mypy .)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Read(.env)",
      "Read(**/.env)",
      "Read(**/secrets*)"
    ]
  }
}
```

Backend projects need extra care around database commands. Do not give Claude Code production database access by default. Do not let it run migrations, deletes, truncations, resets, or destructive database operations automatically.

Add deny rules like these:

```json
{
  "permissions": {
    "deny": [
      "Bash(*DROP DATABASE*)",
      "Bash(*TRUNCATE*)",
      "Bash(*DELETE FROM*)",
      "Bash(*prisma migrate deploy*)",
      "Bash(*sequelize db:migrate*)",
      "Bash(*rails db:drop*)",
      "Bash(*rails db:reset*)"
    ]
  }
}
```

The more Claude Code resembles a pair programmer, the more it needs the same kind of boundaries you would give a teammate: what it can read, what it can run, and what it can change.

## 3. Set up `CLAUDE.md` so it understands the project

`CLAUDE.md` is Claude Code's project memory file. The official memory documentation explains that each Claude Code session starts with a fresh context window, while `CLAUDE.md` provides persistent instructions and project knowledge across sessions.([Claude Code][3])

In short, `settings.json` controls permissions and behavior. `CLAUDE.md` explains the project and working style.

Create this file at the project root:

```bash
CLAUDE.md
```

Then add project rules:

```markdown
# Project Guide for Claude Code

## Project Overview
This is a Next.js + TypeScript admin system for managing orders, users, and reporting data.

## Tech Stack
- Next.js
- TypeScript
- React
- Tailwind CSS
- Prisma
- PostgreSQL
- Vitest

## Common Commands
- Install dependencies: npm install
- Run locally: npm run dev
- Run tests: npm test
- Type check: npm run typecheck
- Lint: npm run lint
- Build: npm run build

## Code Standards
- Use TypeScript for all new code
- Do not use any unless there is a clear reason
- Use function components for React
- Give API responses explicit types
- Add tests for new features
- Explain impact before changing the database schema

## Directory Guide
- app/: Next.js routes and pages
- components/: shared components
- lib/: utilities and service wrappers
- prisma/: database schema and migrations
- tests/: test files

## Security Rules
- Do not read .env files
- Do not print secrets, tokens, or cookies
- Do not connect directly to production databases
- Do not run database deletion or reset commands

## Workflow
Before editing code:
1. Read the relevant files
2. Summarize the change plan
3. Edit the code
4. Run lint, typecheck, and tests
5. Summarize changes and risks
```

This `CLAUDE.md` does not need ornamental language. It needs specifics. Do not write only "write high-quality code." Tell Claude Code what high quality means in this repository: the stack, commands, directory structure, banned operations, and review workflow.

A useful `CLAUDE.md` usually includes:

| Content | Purpose |
| --- | --- |
| Project overview | Helps Claude Code understand the business context |
| Tech stack | Prevents code that does not fit the project |
| Common commands | Shows how to test and validate work |
| Directory structure | Reduces wrong-file edits |
| Code standards | Keeps team style consistent |
| Security rules | Avoids secrets and dangerous commands |
| Workflow | Makes it read, plan, edit, and verify |

For a large repository, add more specific `CLAUDE.md` files in subdirectories:

```bash
frontend/CLAUDE.md
backend/CLAUDE.md
packages/ui/CLAUDE.md
```

That gives Claude Code more precise context when it works inside a specific module.

## 4. Add ignore rules so Claude Code avoids the wrong files

Many projects contain files an AI agent should not read: environment variables, secrets, build outputs, logs, database backups, large dependency directories, and similar material. Even if permissions deny `.env` reads, an ignore file adds another layer of protection.

Create:

```bash
.claudeignore
```

Then add:

```gitignore
.env
.env.*
*.pem
*.key
*.crt
*.p12
*.sqlite
*.db
*.log
node_modules/
dist/
build/
coverage/
.next/
.cache/
tmp/
secrets/
credentials/
private/
```

Claude Code usually does not need those files. `.env`, certificates, private keys, and database files should be excluded by default.

If your project has generated code, decide case by case:

```gitignore
generated/
openapi-generated/
prisma/generated/
```

Be careful here. Some generated code should not be edited but may still be useful to read, such as SDK types, API type definitions, or database types. If Claude Code needs that context, say "do not modify generated directories" in `CLAUDE.md` instead of ignoring them completely.

Use this rule of thumb:

* Always ignore secret files
* Usually ignore build outputs
* Usually ignore dependency directories
* Decide generated code case by case
* Do not blindly ignore business configuration

Claude Code depends on context. Ignore rules should remove danger and noise while preserving the information needed to complete the task.

## 5. Configure MCP only for tools you really need

MCP, or Model Context Protocol, lets Claude Code connect to external tools and data sources. It can connect Claude Code to GitHub, databases, documentation systems, browser automation, and internal tools.

More MCP servers do not automatically make Claude Code better. Each new connection adds a permission boundary and a security risk. The official Hooks documentation also covers MCP tool hooks, which means MCP calls can become part of Claude Code's controlled lifecycle.([Claude Code][4])

Start with only the MCP tools you need:

| MCP type | Default recommendation | Reason |
| --- | --- | --- |
| GitHub | Recommended | Useful for issues, pull requests, and code context |
| Documentation knowledge base | Recommended | Helps it follow internal rules |
| Local filesystem | Use carefully | Can expand access too far |
| Database | Use carefully | Must be read-only and non-production |
| Browser automation | Use when needed | Fits E2E tests, but needs permission control |
| Production systems | Not recommended | High risk and real-world impact |

A safe MCP rule: connect development environments, not production; prefer read-only access; treat write access as exceptional.

If you configure a database MCP, use a read-only account connected to a test or staging database:

```bash
DATABASE_URL=postgresql://readonly_user:password@localhost:5432/app_staging
```

Do not connect Claude Code directly to production. Even if you trust the model, an AI agent should not sit next to production data by default.

In a team, review MCP configuration centrally. If every developer adds tools independently, the security boundary becomes hard to reason about.

## 6. Use hooks to run checks, not risky automation

Hooks are an advanced Claude Code feature. The official Hooks documentation explains that hooks can run shell commands, HTTP endpoints, or LLM prompts at specific points in the Claude Code lifecycle.([Claude Code][4])

Hooks are useful when you want checks to run at the right time. For example, after Claude Code edits files, it can run a formatter. Before commit, it can run tests.

Common hook uses:

| Scenario | Hook action |
| --- | --- |
| After code edits | Run formatter |
| After TypeScript edits | Run typecheck |
| After test edits | Run tests |
| Before dangerous commands | Block or warn |
| At session end | Output a change summary |

Example configuration:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint"
          }
        ]
      }
    ]
  }
}
```

This lets Claude Code run lint after file edits.

Use hooks with restraint. Do not put slow, broad, or data-changing commands into automatic hooks. These are poor hook choices:

```bash
npm run deploy
npm run db:migrate
docker compose down -v
rails db:reset
terraform apply
kubectl delete
```

Better hook commands:

```bash
npm run lint
npm run typecheck
npm test
prettier --check .
ruff check .
pytest
```

Hooks should verify each step. They should not turn Claude Code into an unattended deployment system.

## 7. Set environment variables without exposing secrets

Claude Code supports environment variables for behavior control. The official environment variables documentation explains that you can set variables in the shell, or put them in the `env` field of `settings.json` so Claude Code reads them at startup.([Claude Code][5])

Put shared, non-sensitive environment variables in project settings. Keep private variables in your local shell or local-only configuration.

Example:

```json
{
  "env": {
    "NODE_ENV": "development",
    "CI": "true",
    "FORCE_COLOR": "1"
  }
}
```

These are safe because they do not contain secrets.

Do not write this:

```json
{
  "env": {
    "OPENAI_API_KEY": "sk-xxxx",
    "DATABASE_URL": "postgresql://prod-user:password@prod-db:5432/app",
    "AWS_SECRET_ACCESS_KEY": "xxxx"
  }
}
```

Secrets should not be committed to the repository or exposed to Claude Code casually. Even local configuration deserves care.

A better approach:

* Store secrets in a local environment manager
* Block Claude Code from reading `.env` by default
* Use fake data or local mocks for tests
* Use read-only, non-production database accounts
* Configure CI/CD secrets separately

For teams, you can standardize harmless context:

```json
{
  "env": {
    "CLAUDE_CODE_PROJECT": "admin-dashboard",
    "CLAUDE_CODE_ENV": "local-dev"
  }
}
```

Scripts, hooks, and logs can then tell which project and environment the Claude Code session belongs to.

## A starter Claude Code setup

Use this baseline and adjust it for your project.

File path:

```bash
.claude/settings.json
```

Configuration:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(git log --oneline -10)",
      "Bash(npm test)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(npm run typecheck)",
      "Bash(npm run build)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(chmod -R 777 *)",
      "Bash(curl * | sh)",
      "Bash(wget * | sh)",
      "Bash(*DROP DATABASE*)",
      "Bash(*TRUNCATE*)",
      "Bash(*DELETE FROM*)",
      "Read(.env)",
      "Read(**/.env)",
      "Read(**/id_rsa)",
      "Read(**/credentials*)",
      "Read(**/secrets*)"
    ]
  },
  "env": {
    "NODE_ENV": "development",
    "CI": "true",
    "FORCE_COLOR": "1"
  }
}
```

Then create:

```bash
.claudeignore
```

Add:

```gitignore
.env
.env.*
*.pem
*.key
*.crt
*.p12
*.sqlite
*.db
*.log
node_modules/
dist/
build/
coverage/
.next/
.cache/
tmp/
secrets/
credentials/
private/
```

Finally create:

```bash
CLAUDE.md
```

Add:

```markdown
# Claude Code Project Guide

## Project Overview
Describe the project purpose, main users, and core business modules.

## Tech Stack
- Add frontend framework
- Add backend framework
- Add database
- Add testing tools

## Common Commands
- Install dependencies:
- Start development:
- Run tests:
- Type check:
- Lint:
- Build:

## Code Standards
- Read relevant files before editing
- Add tests for new features
- Do not introduce new dependencies casually
- Do not modify unrelated files
- Do not use any unless you explain why
- Do not delete existing tests unless they are obsolete and you explain why

## Security Rules
- Do not read .env files
- Do not print secrets, tokens, or cookies
- Do not connect to production databases
- Do not run destructive database commands
- Do not run deployment commands

## Workflow
1. Understand the task and relevant files
2. Briefly explain the plan
3. Edit the code
4. Run tests and checks
5. Summarize changes, validation, and risks
```

This setup is small but effective. It tells Claude Code what the project expects and what it must not do.

## Common Claude Code configuration mistakes

### Mistake 1: Writing `CLAUDE.md` but skipping permissions

`CLAUDE.md` is instruction, not a hard boundary. You can write "do not read `.env`" there, but it is safer to block `.env` in permissions and ignore rules too.

Use:

```json
{
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(**/.env)"
    ]
  }
}
```

Then add:

```gitignore
.env
.env.*
```

### Mistake 2: Allowing every Bash command immediately

Some users give Claude Code broad command permissions to save time. A coding agent that can execute commands can also create real damage.

Start with safe commands:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff)",
      "Bash(npm test)",
      "Bash(npm run lint)"
    ]
  }
}
```

For uncertain commands, make Claude Code ask first.

### Mistake 3: Giving Claude Code production environment variables

Claude Code should not have production secrets by default. Keep `.env.production`, database URLs, cloud tokens, and similar credentials away from the agent.

For database access, stick to:

* local databases first
* test databases first
* read-only users first
* no production write permissions
* no automatic production migrations

### Mistake 4: Making hooks too aggressive

Hooks are powerful, but they can become dangerous. Running lint, tests, and type checks is useful. Running deploy, migrate, delete, or reset commands is not.

Good hooks:

```bash
npm run lint
npm run typecheck
npm test
```

Bad hooks:

```bash
npm run deploy
terraform apply
kubectl delete
rails db:reset
```

### Mistake 5: No shared team configuration

If everyone on a team uses Claude Code with different settings, results drift. One person can run tests, another cannot. One person can read a directory, another cannot. One person has project rules loaded, another does not.

Put these files into team standards:

```bash
CLAUDE.md
.claude/settings.json
.claudeignore
```

Do not commit:

```bash
.claude/settings.local.json
.env
.env.*
```

## Claude Code configuration checklist

Use this checklist before bringing Claude Code into a new project.

| Check | Done |
| --- | --- |
| `CLAUDE.md` exists | ✅ |
| Project tech stack is documented | ✅ |
| Test, lint, and build commands are listed | ✅ |
| `.claude/settings.json` is configured | ✅ |
| Dangerous Bash commands are restricted | ✅ |
| `.env` and secret files are blocked | ✅ |
| `.claudeignore` exists | ✅ |
| Build outputs and dependency directories are ignored | ✅ |
| Production database access is avoided | ✅ |
| Only necessary MCP tools are configured | ✅ |
| Hooks are used carefully | ✅ |
| Team and local configuration are separated | ✅ |
| Private local settings are in `.gitignore` | ✅ |

## FAQ: Claude Code configuration

### 1. What are the most important Claude Code configuration files?

The most important files are `CLAUDE.md` and `.claude/settings.json`. `CLAUDE.md` explains project rules and working style. `.claude/settings.json` controls permissions, environment variables, hooks, and related behavior.

### 2. Should `CLAUDE.md` be committed to Git?

Usually yes. It is project-level collaboration guidance, and it gives team members consistent context when they use Claude Code.

### 3. Should `.claude/settings.json` be committed to Git?

Commit it if it contains shared team rules. Do not commit it if it contains personal paths, private variables, or local experiments. Put those in local-only configuration.

### 4. Can Claude Code read `.env` files?

It may be technically possible, but you should not allow it by default. A safer setup blocks `.env`, secrets, certificates, and credential files through permissions and ignore rules.

### 5. Should I configure MCP immediately?

No. First use Claude Code for local code reading, edits, and tests. Once the workflow is stable, connect GitHub, docs, or testing tools as needed. Treat databases and production systems with extra care.

### 6. What should hooks do?

Hooks are best for low-risk validation commands such as lint, typecheck, unit tests, and formatter checks. Do not use hooks for automatic deployment, resource deletion, database resets, or production changes.

### 7. Is Claude Code good for fully automated development?

Do not start there. Claude Code works better as a pair programmer: it can act on tasks, but you should keep approval gates, code review, and test verification in the workflow.

## Conclusion: Claude Code works better with clear boundaries

Claude Code is powerful because it can keep working inside your project. It reads files, understands context, runs commands, edits code, and summarizes results. With the right setup, it can behave like a reliable engineering collaborator.

That requires clear boundaries first.

Prioritize these 7 tasks:

1. Set up `settings.json` scopes
2. Configure permission rules
3. Write `CLAUDE.md` project memory
4. Add `.claudeignore`
5. Connect MCP carefully
6. Use hooks with restraint
7. Manage environment variables and team configuration

An effective Claude Code workflow does not give it unlimited access. It tells Claude Code what to do and what to avoid. Once configuration, permissions, memory, and verification are in place, Claude Code can move from a smart chat assistant to a useful engineering partner.

[1]: https://code.claude.com/docs/en/settings "Claude Code settings - Claude Code Docs"
[2]: https://code.claude.com/docs/en/permissions "Configure permissions - Claude Code Docs"
[3]: https://code.claude.com/docs/en/memory "How Claude remembers your project - Claude Code Docs"
[4]: https://code.claude.com/docs/en/hooks "Hooks reference - Claude Code Docs"
[5]: https://code.claude.com/docs/en/env-vars "Environment variables - Claude Code Docs"
