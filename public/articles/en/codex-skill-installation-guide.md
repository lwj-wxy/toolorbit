# How to Install and Use Codex Skills

## TL;DR

Codex skills are reusable instruction packs that teach Codex a workflow, tool convention, or domain-specific operating procedure. Install skills from a trusted source, restart Codex so they are picked up, then invoke them by name or by making a request that matches the skill description.

Last reviewed: 2026-05-27. Maintained by the [ToolOrbit Editorial Team](/authors/toolorbit-editorial-team).

Skills make Codex more consistent. Instead of repeating the same long instruction every time, a skill can define when it should be used, what files to inspect, which scripts to run, and how to report results. OpenAI's [Codex skills documentation](https://developers.openai.com/codex/skills) is the best official starting point for the concept.

In day-to-day work, skills are useful for repeated workflows: image generation, SEO audits, PDF handling, spreadsheets, Figma, GitHub review triage, frontend design systems, or repository-specific quality rules.

## What is a Codex skill?

A skill is usually a folder with a `SKILL.md` file. That file contains the description, trigger conditions, workflow, constraints, and references Codex should follow. Some skills also include scripts, templates, assets, or reference data.

The skill description matters because Codex uses it to decide when the skill applies. A good skill is not just a prompt. It is a small operating manual.

## Where are skills installed?

In a local Codex environment, installed user skills normally live under:

```text
~/.codex/skills
```

System skills may be preinstalled under Codex-managed directories. You normally do not need to reinstall those.

After installing a new skill, restart Codex so the session can discover it. If you install a skill and immediately wonder why Codex cannot see it, a restart is usually the missing step.

## Installing from a curated list

If your Codex environment includes a skill installer, the safest path is to list available curated skills first, choose the one you need, and install only that skill. Avoid installing a large set of skills you do not plan to use; more skills can make behavior harder to predict.

A practical flow is:

1. Ask Codex to list available skills.
2. Pick the exact skill name.
3. Ask Codex to install that skill.
4. Restart Codex.
5. Start a new task that matches the skill.

For example:

```text
List available Codex skills.
Install the imagegen skill.
Restart Codex after installation.
```

Some system skills, such as image generation helpers, may already be present. If a skill is already installed, do not overwrite it unless you have a reason.

## Installing from GitHub

Skills can also come from a GitHub repository path. This is useful for private team workflows or experimental skills. Only install from sources you trust, because a skill can contain scripts and operational instructions.

A typical request looks like:

```text
Install the Codex skill from github.com/owner/repo at skills/my-workflow.
```

For private repositories, Codex may need existing Git credentials or a token. Treat this as normal software supply chain hygiene: review the skill folder before relying on it.

## How to invoke a skill

There are two common ways.

First, mention it explicitly:

```text
Use $imagegen to create a blog cover for this article.
```

Second, ask for a task that matches the skill description:

```text
Create a realistic product hero image and save it into public/images.
```

If the skill is well described, Codex can often select it without the dollar-name syntax. For important work, explicit invocation is clearer.

## How to evaluate skill quality

A useful skill should say:

- When to use it and when not to use it.
- What inputs to collect before acting.
- Which files or scripts to prefer.
- What safety rules apply.
- What final output the user should receive.

Weak skills are vague. They say "make good UI" or "do SEO" without explaining the workflow. Strong skills reduce ambiguity and make repeated work more reliable.

## Good habits for teams

Keep skills narrow. A design skill, an image generation skill, and an SEO audit skill should usually be separate. That makes behavior easier to predict.

Version important skills in Git. If a workflow matters to a team, treat it like code: review changes, document assumptions, and keep examples.

Use [JSON Formatter](/tools/dev/json-formatter) when editing metadata, [Text Diff](/tools/dev/text-diff) when comparing skill revisions, and [AI Prompt Generator](/tools/ai/prompt-generator) when drafting reusable instruction language.

## Common mistakes

The most common mistake is installing a skill and continuing in the same old session. Restart Codex after installation.

The second mistake is installing unreviewed skills. A skill can include scripts or rules that affect file edits, network access, and workflow decisions.

The third mistake is creating one giant skill for everything. Smaller skills are easier to test and easier for Codex to select correctly.

The fourth mistake is forgetting repository rules. A skill does not override local project instructions such as `AGENTS.md`; repository rules still matter.

## Bottom line

Codex skills are most valuable when they turn repeated judgment into a repeatable workflow. Install only what you need, restart Codex, invoke skills clearly, and review skill content with the same care you give project automation.
