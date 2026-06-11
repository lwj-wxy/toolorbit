# Claude Code 配置指南：先把这 7 件事配好

Claude Code 能读代码、改文件、运行命令、调用工具，也能连续完成多步开发任务。它越主动，你越需要先把边界讲清楚。配置没做好时，常见问题通常不是模型不会写代码，而是它不知道项目规则、频繁打断你，或者碰到不该碰的文件。

最后审校：2026-06-11。维护者：[ToolOrbit Editorial Team](/authors/toolorbit-editorial-team)。

使用 Claude Code 前，建议先把这 7 件事配好：配置文件层级、权限、项目记忆、忽略规则、MCP、Hooks、环境变量。配完之后，它更像一个知道项目边界、遵守团队规范、能安全协作的结对程序员。

## 1. 先搞清楚配置文件放在哪里

Claude Code 的配置主要围绕 `settings.json` 和 `CLAUDE.md` 展开。官方设置文档说明，你可以在交互式 REPL 中运行 `/config` 打开设置界面，也可以通过配置文件管理行为。([Claude Code][1])

常见配置位置可以这样理解：

```bash
~/.claude/settings.json
```

这是用户级配置，适合放个人电脑上的默认习惯，比如常用权限、环境变量、通知设置等。

```bash
.claude/settings.json
```

这是项目级配置，适合放当前仓库相关规则，比如这个项目允许执行哪些命令、不允许访问哪些路径、团队统一的工具行为等。

```bash
.claude/settings.local.json
```

这是本地项目配置，适合放只在你电脑上生效的内容，比如临时路径、个人环境变量、本地调试习惯。通常不要提交到 Git。

一个简单的项目配置示例：

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

这份配置表达了清晰边界：Claude Code 可以运行测试、检查代码、查看 Git 状态，但不能执行危险删除命令，也不能读取 `.env` 文件。

建议把个人习惯放在 `~/.claude/settings.json`，团队规则放在 `.claude/settings.json`，私有本地配置放在 `.claude/settings.local.json`。这三层分开后，协作成本会低很多。

## 2. 配好权限：先决定 Claude Code 能做什么

Claude Code 的价值之一，是能直接操作项目。官方权限文档说明，你可以用 `/permissions` 查看和管理工具权限，并能看到规则来自哪个 `settings.json` 文件。([Claude Code][2])

权限配置建议遵循一个原则：默认谨慎，逐步放开。

你不需要一开始就允许 Claude Code 做所有事。更好的做法是先开放安全命令，再根据项目需要增加。

推荐基础权限：

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

这份配置适合大多数 JavaScript、TypeScript、Node.js 项目。如果你的项目是 Python，可以换成：

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

后端项目还要特别小心数据库命令。不要让 Claude Code 默认拥有生产数据库权限，也不要让它自动执行迁移、删除、清库、重置等命令。

可以增加这些拒绝规则：

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

Claude Code 越像结对程序员，你越应该像对待真实同事一样给它边界。能看什么、能跑什么、能改什么，都要提前说清楚。

## 3. 配好 `CLAUDE.md`：让它理解你的项目

`CLAUDE.md` 是 Claude Code 的项目记忆文件。官方记忆文档说明，每个会话都会从新的上下文窗口开始，而 `CLAUDE.md` 可以提供跨会话保留的持久指令和项目知识。([Claude Code][3])

简单说，`settings.json` 管权限和行为，`CLAUDE.md` 管项目知识和工作方式。

推荐在项目根目录创建：

```bash
CLAUDE.md
```

然后写入项目规则：

```markdown
# Project Guide for Claude Code

## 项目简介
这是一个基于 Next.js + TypeScript 的后台管理系统，用于管理订单、用户和报表数据。

## 技术栈
- Next.js
- TypeScript
- React
- Tailwind CSS
- Prisma
- PostgreSQL
- Vitest

## 常用命令
- 安装依赖：npm install
- 本地开发：npm run dev
- 运行测试：npm test
- 类型检查：npm run typecheck
- 代码检查：npm run lint
- 构建项目：npm run build

## 代码规范
- 所有新代码必须使用 TypeScript
- 不要使用 any，除非有明确理由
- React 组件使用函数组件
- API 返回值必须有明确类型
- 新功能必须补充测试
- 修改数据库 schema 前必须先说明原因和影响

## 目录说明
- app/：Next.js 路由和页面
- components/：通用组件
- lib/：工具函数和服务封装
- prisma/：数据库 schema 和 migration
- tests/：测试文件

## 安全规则
- 不要读取 .env 文件
- 不要输出密钥、token、cookie
- 不要直接连接生产数据库
- 不要执行删除数据库或重置数据库的命令

## 工作方式
在修改代码前，请先：
1. 阅读相关文件
2. 简述修改计划
3. 再开始编辑
4. 修改后运行 lint、typecheck 和测试
5. 最后总结变更点和风险
```

这份 `CLAUDE.md` 不需要写得花哨，但必须具体。不要只写“请写高质量代码”，而要告诉它什么叫高质量：用什么技术栈、跑什么命令、遵守什么目录结构、禁止什么操作。

一个好用的 `CLAUDE.md` 通常包含：

| 内容 | 作用 |
| --- | --- |
| 项目简介 | 帮 Claude Code 快速理解业务背景 |
| 技术栈 | 避免生成不符合项目技术路线的代码 |
| 常用命令 | 让它知道如何测试和验证 |
| 目录结构 | 减少找错文件、乱放代码 |
| 编码规范 | 保持团队风格一致 |
| 安全规则 | 避免读取密钥或执行危险命令 |
| 工作流程 | 让它先计划、再修改、最后验证 |

如果项目很大，可以在子目录中补充更具体的 `CLAUDE.md`。例如：

```bash
frontend/CLAUDE.md
backend/CLAUDE.md
packages/ui/CLAUDE.md
```

这样 Claude Code 进入不同模块时，可以获得更贴近当前目录的上下文。

## 4. 配好忽略规则：别让 Claude Code 读错东西

很多项目里都有一些不该被 AI 读取的内容，比如环境变量、密钥、构建产物、日志、数据库备份、大型依赖目录等。即使你在权限里拒绝读取 `.env`，也建议再用忽略规则做一层保护。

你可以创建：

```bash
.claudeignore
```

然后写入：

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

这类文件通常不需要 Claude Code 读取。特别是 `.env`、证书、私钥、数据库文件，应该默认排除。

如果你的项目有生成代码，也可以根据情况忽略：

```gitignore
generated/
openapi-generated/
prisma/generated/
```

这里要注意：有些生成代码虽然不该改，却可能需要读。比如 SDK 类型、API 类型定义、数据库类型声明。如果 Claude Code 需要理解它们，可以只在 `CLAUDE.md` 里说明“不要修改 generated 目录”，而不是完全忽略。

推荐规则是：

* 密钥类文件必须忽略
* 构建产物建议忽略
* 依赖目录建议忽略
* 生成代码视项目情况决定
* 业务配置不要盲目忽略

Claude Code 的效果很依赖上下文。忽略规则不是越多越好，而是把危险和噪音隔离掉，同时保留它完成任务所需的信息。

## 5. 配好 MCP：只连接真正需要的外部工具

MCP，也就是 Model Context Protocol，是 Claude Code 连接外部工具和数据源的重要方式。它可以让 Claude Code 接入 GitHub、数据库、文档系统、浏览器自动化、内部工具等。

但 MCP 不是越多越好。每多接一个 MCP 服务，就多一个权限边界和安全风险。官方 Hooks 文档也提到 Claude Code 支持 MCP tool hooks，这说明 MCP 工具调用已经是 Claude Code 生命周期中可以被精细控制的一部分。([Claude Code][4])

建议你先只配置最必要的 MCP：

| MCP 类型 | 是否推荐默认开启 | 原因 |
| --- | --- | --- |
| GitHub | 推荐 | 方便查看 Issue、PR、代码上下文 |
| 文档知识库 | 推荐 | 帮助理解内部规范 |
| 本地文件系统 | 谨慎 | 容易扩大访问范围 |
| 数据库 | 谨慎 | 必须限制只读和非生产环境 |
| 浏览器自动化 | 按需 | 适合 E2E 测试，但要控制权限 |
| 生产系统 | 不推荐 | 风险高，容易造成真实影响 |

一个安全的 MCP 使用原则是：开发环境可以接，生产环境不要接；只读优先，写入慎重。

如果你配置数据库 MCP，建议只给只读账号，并且连接测试库或 staging 库：

```bash
DATABASE_URL=postgresql://readonly_user:password@localhost:5432/app_staging
```

不要把生产库连接直接给 Claude Code。即使你信任模型，也不应该让 AI agent 默认靠近生产数据。

在团队里，MCP 配置最好统一审查。不要让每个开发者各自随意添加工具，否则安全边界会变得很难管理。

## 6. 配好 Hooks：让 Claude Code 自动做检查

Hooks 是 Claude Code 的高级能力。官方 Hooks 文档说明，Hooks 可以是在 Claude Code 生命周期特定节点自动执行的 shell 命令、HTTP endpoint 或 LLM prompt。([Claude Code][4])

Hooks 的价值很大。比如你可以在 Claude Code 修改文件后自动运行格式化，或者在它准备提交前自动跑测试。

常见 Hook 场景：

| 场景 | Hook 作用 |
| --- | --- |
| 修改代码后 | 自动运行 formatter |
| 修改 TypeScript 文件后 | 自动运行 typecheck |
| 修改测试文件后 | 自动运行 test |
| 执行危险命令前 | 阻止或提醒 |
| 会话结束前 | 输出变更总结 |

示例配置：

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

这表示 Claude Code 在编辑文件后，可以自动运行 lint。

不过，Hooks 一定要克制使用。不要把耗时很长、影响范围很大、可能修改数据的命令放进 Hook。比如下面这些就不适合作为自动 Hook：

```bash
npm run deploy
npm run db:migrate
docker compose down -v
rails db:reset
terraform apply
kubectl delete
```

更推荐的 Hook 是：

```bash
npm run lint
npm run typecheck
npm test
prettier --check .
ruff check .
pytest
```

Hooks 的目标不是让 Claude Code 自动干所有事，而是让它每一步都自动被验证。

## 7. 配好环境变量：把默认行为固定下来

Claude Code 支持通过环境变量控制行为。官方环境变量文档说明，可以在 shell 中设置环境变量，也可以把变量放到 `settings.json` 的 `env` 字段中，这样 Claude Code 启动时会读取。([Claude Code][5])

推荐把团队共用、非敏感的环境变量写进项目配置，把个人私密变量留在本地 shell 或本地配置中。

示例：

```json
{
  "env": {
    "NODE_ENV": "development",
    "CI": "true",
    "FORCE_COLOR": "1"
  }
}
```

这类配置比较安全，因为它们不包含密钥。

不要这样写：

```json
{
  "env": {
    "OPENAI_API_KEY": "sk-xxxx",
    "DATABASE_URL": "postgresql://prod-user:password@prod-db:5432/app",
    "AWS_SECRET_ACCESS_KEY": "xxxx"
  }
}
```

密钥不应该提交到仓库，也不应该暴露给 Claude Code。即使是本地配置，也要谨慎。

更好的方式是：

* 密钥放在本地环境变量管理器中
* Claude Code 默认不读取 `.env`
* 测试使用假数据或本地模拟服务
* 数据库连接使用只读、非生产账号
* CI/CD 中单独配置受控 secret

如果团队多人使用 Claude Code，可以约定：

```json
{
  "env": {
    "CLAUDE_CODE_PROJECT": "admin-dashboard",
    "CLAUDE_CODE_ENV": "local-dev"
  }
}
```

这样在脚本、Hooks 或日志里可以明确知道当前 Claude Code 运行在哪个项目和环境中。

## 推荐的一套 Claude Code 起步配置

下面是一份可以直接复制后按项目调整的基础配置。

文件路径：

```bash
.claude/settings.json
```

配置内容：

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

再创建：

```bash
.claudeignore
```

写入：

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

最后创建：

```bash
CLAUDE.md
```

写入：

```markdown
# Claude Code Project Guide

## 项目简介
请在这里写清楚项目用途、主要用户、核心业务模块。

## 技术栈
- 请填写前端框架
- 请填写后端框架
- 请填写数据库
- 请填写测试工具

## 常用命令
- 安装依赖：
- 启动开发：
- 运行测试：
- 类型检查：
- 代码检查：
- 构建项目：

## 代码规范
- 修改代码前先阅读相关文件
- 新功能必须补充测试
- 不要随意引入新依赖
- 不要修改与任务无关的文件
- 不要使用 any，除非说明原因
- 不要删除现有测试，除非测试已经失效且说明原因

## 安全规则
- 不要读取 .env 文件
- 不要输出密钥、token、cookie
- 不要连接生产数据库
- 不要执行破坏性数据库命令
- 不要执行部署命令

## 工作流程
1. 先理解任务和相关文件
2. 简要说明计划
3. 再修改代码
4. 修改后运行测试和检查
5. 最后总结改动、验证结果和潜在风险
```

这套配置不复杂，但足够稳。它既告诉 Claude Code 项目怎么做，也告诉它什么不能做。

## Claude Code 配置常见错误

### 错误 1：只写 `CLAUDE.md`，不配权限

`CLAUDE.md` 是指令，不是硬边界。你可以在里面写“不要读取 `.env`”，但更稳妥的做法是在权限和忽略规则里也禁止它。

正确做法：

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

再配合：

```gitignore
.env
.env.*
```

### 错误 2：一上来就允许所有 Bash 命令

很多人为了省事，会给 Claude Code 很宽的命令权限。但 AI coding agent 能执行命令，就意味着它可能造成真实影响。

更好的做法是先允许这些安全命令：

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

不确定的命令，先让它请求确认。

### 错误 3：把生产环境变量交给 Claude Code

Claude Code 不应该默认拥有生产环境密钥。无论是 `.env.production`、数据库连接串，还是云服务 token，都应该和 AI agent 隔离。

尤其是数据库权限，要坚持：

* 本地库优先
* 测试库优先
* 只读账号优先
* 禁止生产写权限
* 禁止自动迁移生产库

### 错误 4：Hooks 写得太激进

Hooks 很强，但不能乱用。自动运行 lint、test、typecheck 是好事；自动 deploy、migrate、delete、reset 就很危险。

推荐 Hook：

```bash
npm run lint
npm run typecheck
npm test
```

不推荐 Hook：

```bash
npm run deploy
terraform apply
kubectl delete
rails db:reset
```

### 错误 5：没有团队统一配置

如果团队里每个人都用 Claude Code，但配置完全不同，就会出现结果不一致。有的人允许执行测试，有的人不允许；有的人能读某些目录，有的人不能；有的人遵守项目规则，有的人没加载规则。

建议把这些文件纳入团队规范：

```bash
CLAUDE.md
.claude/settings.json
.claudeignore
```

但不要提交：

```bash
.claude/settings.local.json
.env
.env.*
```

## Claude Code 配置验证清单

每次新项目接入 Claude Code 前，可以按这份清单检查。

| 检查项 | 是否完成 |
| --- | --- |
| 是否创建 `CLAUDE.md` | ✅ |
| 是否说明项目技术栈 | ✅ |
| 是否写明常用测试、lint、构建命令 | ✅ |
| 是否配置 `.claude/settings.json` | ✅ |
| 是否限制危险 Bash 命令 | ✅ |
| 是否禁止读取 `.env` 和密钥文件 | ✅ |
| 是否创建 `.claudeignore` | ✅ |
| 是否忽略构建产物和依赖目录 | ✅ |
| 是否避免连接生产数据库 | ✅ |
| 是否只配置必要 MCP | ✅ |
| 是否谨慎使用 Hooks | ✅ |
| 是否区分团队配置和本地配置 | ✅ |
| 是否把本地私密配置加入 `.gitignore` | ✅ |

## FAQ：Claude Code 配置常见问题

### 1. Claude Code 最重要的配置文件是什么？

最重要的是 `CLAUDE.md` 和 `.claude/settings.json`。前者告诉 Claude Code 项目规则和工作方式，后者控制权限、环境变量、Hooks 等行为。

### 2. `CLAUDE.md` 应该提交到 Git 吗？

通常应该提交。它是项目级协作说明，能让团队成员使用 Claude Code 时获得一致的项目上下文。

### 3. `.claude/settings.json` 应该提交到 Git 吗？

如果里面是团队共享规则，可以提交。如果包含个人路径、私密变量、本地实验配置，就不要提交。个人配置应放在本地配置文件中。

### 4. Claude Code 可以读取 `.env` 吗？

技术上可能可以，但不建议允许。更安全的做法是在权限和忽略规则里禁止读取 `.env`、密钥、证书和凭据文件。

### 5. MCP 要不要一开始就配置？

不需要。先用 Claude Code 完成本地代码阅读、修改、测试。等流程稳定后，再按需接入 GitHub、文档系统或测试工具。数据库和生产系统要特别谨慎。

### 6. Hooks 适合做什么？

Hooks 适合自动运行低风险验证命令，比如 lint、typecheck、unit test、formatter check。不要用 Hooks 自动部署、删除资源、重置数据库或执行生产变更。

### 7. Claude Code 适合完全自动化开发吗？

不建议一开始就完全自动化。Claude Code 更适合作为结对程序员：它可以主动完成任务，但你仍然应该保留关键审批、代码审查和测试验证。

## 结论：Claude Code 好不好用，关键在配置边界

Claude Code 的强大之处，不只是会写代码，而是能在你的项目里持续工作。它会读文件、理解上下文、执行命令、修改代码、总结结果。这样的工具配置好后，确实能像一位可靠的结对程序员。

前提是你先把边界配清楚。

这 7 件事建议优先完成：

1. 配好 `settings.json` 的层级
2. 配好权限规则
3. 写好 `CLAUDE.md` 项目记忆
4. 配好 `.claudeignore`
5. 谨慎接入 MCP
6. 克制使用 Hooks
7. 管好环境变量和团队配置

真正高效的 Claude Code 工作流，不是让它什么都能做，而是让它知道该做什么，也知道不该做什么。当配置、权限、记忆和验证流程都到位后，Claude Code 才能从一个聪明的聊天助手，变成一个可靠的工程协作者。

[1]: https://code.claude.com/docs/en/settings "Claude Code settings - Claude Code Docs"
[2]: https://code.claude.com/docs/en/permissions "Configure permissions - Claude Code Docs"
[3]: https://code.claude.com/docs/en/memory "How Claude remembers your project - Claude Code Docs"
[4]: https://code.claude.com/docs/en/hooks "Hooks reference - Claude Code Docs"
[5]: https://code.claude.com/docs/en/env-vars "Environment variables - Claude Code Docs"
