# How to Install and Use Codex Skills

## TL;DR

Codex skills are reusable instruction packs that teach Codex a workflow, tool convention, or domain-specific operating procedure. Install skills from a trusted source, restart Codex so they are picked up, then invoke them by name or by making a request that matches the skill description. For teams, treat skills like code: version them, review changes, and keep each skill focused on one workflow.

Last reviewed: 2026-05-27. Maintained by the [ToolOrbit Editorial Team](/authors/toolorbit-editorial-team).

Skills make Codex more consistent. Instead of repeating the same long instruction every time, a skill can define when it should be used, what files to inspect, which scripts to run, and how to report results. OpenAI's [Codex skills documentation](https://developers.openai.com/codex/skills) is the best official starting point for the concept.

In day-to-day work, skills are useful for repeated workflows: image generation, SEO audits, PDF handling, spreadsheets, Figma, GitHub review triage, frontend design systems, or repository-specific quality rules.

## What is a Codex skill?

A skill is usually a folder with a `SKILL.md` file. That file contains the description, trigger conditions, workflow, constraints, and references Codex should follow. Some skills also include scripts, templates, assets, or reference data.

The skill description matters because Codex uses it to decide when the skill applies. A good skill is not just a prompt. It is a small operating manual.

### Anatomy of a SKILL.md file

A well-structured `SKILL.md` typically contains these sections:

```markdown
---
name: imagegen
description: Generate and optimize project images using GPT Image 2.
---

# Image Generation Skill

## When to use
- User asks to create a blog cover, hero image, product mockup, or thumbnail.
- User wants to generate an image for a specific page or component.

## When NOT to use
- The asset should be SVG or code (icons, diagrams, UI controls).

## Workflow
1. Ask for: aspect ratio, subject, style, target file path.
2. Generate the image using the built-in image generation tool.
3. Show the result and ask for approval.
4. On approval, resize to the target dimensions and save to the specified path.
5. Update any page references to point to the new image.

## Constraints
- Never save images outside the project repository.
- Always optimize before saving (JPG 85% quality for photos, PNG for graphics).
- Do not generate images for UI elements.

## References
- Project image path convention: public/images/blog/{slug}.jpg
- House style: editorial photography, dark navy + warm accent, 16:9, no text.
```

The frontmatter block (between `---` delimiters) holds the skill name and a one-line description. Codex reads this first to decide whether the skill matches the current request. Make the description concrete and search-like: include the keywords a user would naturally type.

The body sections, when to use, workflow, constraints, and references, form the operating procedure. Each section reduces ambiguity. A well-written skill leaves little room for interpretation about what to do and what to avoid.

### Skills vs. prompts: the key difference

A prompt is a one-time instruction: "Generate a blog cover with these specs." A skill is a standing instruction: "Whenever someone asks for a blog cover, follow this procedure." The skill persists across sessions and conversations. It also includes negative rules (what not to do), which prompts rarely capture well.

## Where are skills installed?

In a local Codex environment, installed user skills normally live under:

```text
~/.codex/skills
```

System skills may be preinstalled under Codex-managed directories. You normally do not need to reinstall those.

After installing a new skill, restart Codex so the session can discover it. If you install a skill and immediately wonder why Codex cannot see it, a restart is usually the missing step.

### How skill discovery works

When Codex starts, it scans the skills directory and reads the frontmatter and description of each `SKILL.md` file. These are loaded into the session context as available tools. When you make a request, Codex compares your request against the description and trigger conditions of each skill.

This is why the description matters so much. A vague description like "helps with design" will rarely trigger, because Codex cannot reliably match it to specific requests. A precise description like "generate and optimize project images using GPT Image 2" matches cleanly against image-related requests.

Skills are not loaded into context until they are invoked. Having many installed skills does not bloat every conversation — only the skill descriptions are scanned at startup. The full skill content is loaded only when the skill is triggered.

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

### Understanding curated vs. community skills

Curated skills are maintained by the platform or trusted publishers. They have been reviewed for safety, follow conventions, and are typically versioned. Community skills come from individual developers or teams and may vary in quality and maintenance.

For production workflows, prefer curated skills when available. For experimental or team-specific workflows, community or self-authored skills can work. Apply the same review standards you would use for any dependency.

## Installing from GitHub

Skills can also come from a GitHub repository path. This is useful for private team workflows or experimental skills. Only install from sources you trust, because a skill can contain scripts and operational instructions.

A typical request looks like:

```text
Install the Codex skill from github.com/owner/repo at skills/my-workflow.
```

For private repositories, Codex may need existing Git credentials or a token. Treat this as normal software supply chain hygiene: review the skill folder before relying on it.

### Installing from a local path

For skills you are actively developing or testing, you can install from a local directory:

```text
Install the skill from ~/projects/my-team-skills/imagegen.
```

This is the fastest way to test a skill before publishing it. Make changes to the local `SKILL.md`, restart Codex, and test with a matching request. Once the skill behaves as expected, push it to a shared repository for the team.

### Version pinning for team skills

If your team maintains skills in a Git repository, pin to a specific tag or commit rather than pulling from `main`:

```text
Install the skill from github.com/owner/repo at skills/my-workflow@v1.2.0.
```

This prevents unexpected behavior changes when the skill is updated upstream. Treat skill version updates the same way you treat dependency updates: review the changelog, test in a non-critical session, then roll out.

## Creating your own skill

The fastest way to create a skill is to write a `SKILL.md` file and place it in `~/.codex/skills/<skill-name>/`. Start with the frontmatter, then fill in each section.

### Start from a working prompt

If you already have a prompt that works well for a repeated task, use it as the starting point. Convert the one-time instructions into standing rules:

1. **When to use:** What request patterns should trigger this skill?
2. **Workflow:** What are the steps, in order?
3. **Constraints:** What should never happen?
4. **References:** What files, conventions, or external docs should Codex consult?

### A minimal template

```markdown
---
name: my-workflow
description: Short description with keywords users would type.
---

# My Workflow Skill

## When to use
- Scenario A.
- Scenario B.

## When NOT to use
- Scenario X (use Y instead).

## Workflow
1. Collect required inputs from the user.
2. Do the main task.
3. Validate the output.
4. Report results.

## Constraints
- Never do Z.
- Always check W before proceeding.

## References
- Project convention: [link or path].
```

### Testing your skill

After writing the skill, test it immediately:

1. Save the `SKILL.md` in the correct directory.
2. Restart Codex.
3. Ask Codex to list available skills and confirm yours appears.
4. Make a request that should trigger the skill.
5. Check that Codex follows the workflow, respects the constraints, and produces the expected output.

If the skill does not trigger, the description is probably too vague. Add more specific keywords and try again. If the skill triggers but produces wrong behavior, the workflow section likely has gaps. Add more explicit steps and constraints.

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

### When to use explicit vs. implicit invocation

**Explicit invocation (`$skillname`)** is best when:
- Multiple installed skills could match the same request.
- The task is high-stakes and you want to be certain which skill runs.
- You are testing a specific skill.

**Implicit invocation (natural language)** is best when:
- The skill has a unique, well-scoped description.
- The request is routine and the skill is the obvious match.
- You want a more natural conversational flow.

### Passing parameters to skills

Some skills accept parameters or flags. The syntax depends on the skill's design, but a common pattern is:

```text
Use $imagegen --style=photorealistic --ratio=16:9 to create a blog cover.
```

Check the skill's documentation for supported parameters. If the skill does not document parameters, describe what you want in natural language after the skill name.

## Managing installed skills

### Listing installed skills

Ask Codex directly:

```text
List all installed Codex skills.
```

This shows the skill name, description, and source for each installed skill. Use this to audit what is active before starting important work.

### Removing a skill

To remove a skill you no longer need:

```text
Remove the imagegen skill.
```

Or delete the skill folder directly from `~/.codex/skills/` and restart Codex. Removing unused skills keeps the skill list manageable and reduces the chance of unexpected skill matches.

### Updating a skill

For curated skills, reinstall from the source to get the latest version:

```text
Update the imagegen skill to the latest version.
```

For GitHub-installed skills, reinstall from the same path (optionally with a new version tag). For locally-developed skills, edit the `SKILL.md` directly and restart.

### Disabling a skill temporarily

If you want to keep a skill installed but prevent it from triggering, move its folder out of `~/.codex/skills/` and restart. This is useful when debugging whether a skill is causing unexpected behavior. Move it back and restart to re-enable.

## Skills and project-level instructions

A skill does not override local project instructions such as `AGENTS.md`, `CLAUDE.md`, or repository-specific rules. Project instructions and skills coexist, but they have different precedence:

1. **User request** — the explicit task you ask for.
2. **Project instructions** — `AGENTS.md`, `CLAUDE.md`, and similar files in the repository.
3. **Skill workflow** — the procedure defined in the skill.
4. **Codex defaults** — built-in behavior.

When a skill conflicts with a project instruction, the project instruction wins. For example, if `AGENTS.md` says "never modify files in `public/images/` directly," and a skill normally saves images there, Codex should respect the project rule and ask for guidance.

### Designing skills that respect project context

A well-designed skill acknowledges that project rules take precedence:

```markdown
## Constraints
- Save images to the project's image directory. If a project convention file
  (AGENTS.md, CLAUDE.md) specifies a different path, follow that path instead.
```

This makes the skill portable across projects without causing conflicts.

## Troubleshooting common issues

### Skill not appearing after installation

1. Confirm the skill folder exists in `~/.codex/skills/`.
2. Check that the folder contains a `SKILL.md` file.
3. Verify the `SKILL.md` has valid frontmatter with a `name` field.
4. Restart Codex.
5. Ask Codex to list installed skills and check if it appears.

If the skill still does not appear, the `SKILL.md` may have malformed frontmatter. Validate the YAML between the `---` delimiters.

### Skill not triggering on matching requests

1. Check the skill description — is it specific enough?
2. Try explicit invocation (`$skillname`) to confirm the skill is loaded.
3. If explicit invocation works but implicit does not, rewrite the description to include more matching keywords.
4. Check the "When to use" section — are the trigger conditions clear?

### Skill produces unexpected behavior

1. Read the full `SKILL.md` to understand the intended workflow.
2. Check if a project instruction is overriding part of the skill.
3. Check if another installed skill has an overlapping description and is being selected instead.
4. Try removing other skills temporarily to isolate the issue.

### Two skills conflict

If two installed skills have overlapping descriptions, Codex may pick the wrong one. Solutions:

- Make the descriptions more distinct by adding differentiating keywords.
- Use explicit invocation for the skill you want.
- Remove or disable the skill you use less often.

## How to evaluate skill quality

A useful skill should say:

- When to use it and when not to use it.
- What inputs to collect before acting.
- Which files or scripts to prefer.
- What safety rules apply.
- What final output the user should receive.

Weak skills are vague. They say "make good UI" or "do SEO" without explaining the workflow. Strong skills reduce ambiguity and make repeated work more reliable.

### Red flags in third-party skills

Before installing a skill from an unfamiliar source, check for:

- **No "When NOT to use" section.** A skill that never says no is likely to trigger inappropriately.
- **Overly broad file system access.** Skills should only touch files relevant to their workflow.
- **Network requests without disclosure.** The skill should document any external API calls.
- **No constraints section.** A skill without safety rules is a liability.
- **Obfuscated scripts.** If the skill includes scripts, read them before installing.

## Good habits for teams

Keep skills narrow. A design skill, an image generation skill, and an SEO audit skill should usually be separate. That makes behavior easier to predict.

Version important skills in Git. If a workflow matters to a team, treat it like code: review changes, document assumptions, and keep examples.

Write a short `README.md` alongside the `SKILL.md` for team skills. The README is for humans — it explains why the skill exists, who maintains it, and what conventions it follows. The `SKILL.md` is for Codex — it contains the operational instructions.

Use [JSON Formatter](/tools/dev/json-formatter) when editing metadata, [Text Diff](/tools/dev/text-diff) when comparing skill revisions, and [AI Prompt Generator](/tools/ai/prompt-generator) when drafting reusable instruction language.

### Skill review checklist for teams

Before merging a new or updated skill:

1. Does the description accurately describe what the skill does?
2. Are the trigger conditions specific enough to avoid false matches?
3. Does the workflow cover the full task, including validation and error cases?
4. Are constraints clear and enforceable?
5. Has the skill been tested with at least three different requests?
6. Does the skill respect project-level instruction precedence?

## Common mistakes

The most common mistake is installing a skill and continuing in the same old session. Restart Codex after installation.

The second mistake is installing unreviewed skills. A skill can include scripts or rules that affect file edits, network access, and workflow decisions.

The third mistake is creating one giant skill for everything. Smaller skills are easier to test and easier for Codex to select correctly.

The fourth mistake is forgetting repository rules. A skill does not override local project instructions such as `AGENTS.md`; repository rules still matter.

The fifth mistake is writing a skill description that is too generic. "Helps with frontend work" matches too many things and will either trigger constantly or never. Be specific: "Review React components for accessibility, responsive layout, and design consistency."

The sixth mistake is never updating skills. As project conventions change, skills become stale. Schedule a quarterly review of installed skills: remove unused ones, update active ones, and check that skill behavior still aligns with the current workflow.

## Bottom line

Codex skills are most valuable when they turn repeated judgment into a repeatable workflow. Install only what you need, restart Codex, invoke skills clearly, and review skill content with the same care you give project automation. For teams, a well-written skill saves repeated instructions and reduces repeated mistakes.
