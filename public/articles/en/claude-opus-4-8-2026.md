# Claude Opus 4.8: Better Uncertainty Handling for Coding

Anthropic released **Claude Opus 4.8** in the early hours of May 29, 2026 Beijing time.

The release arrived 43 days after Opus 4.7. The main change for developers is not only benchmark performance; Anthropic reports better uncertainty handling and fewer fabricated code findings.

---

## 1. Two Reported Zeros in Code Review Tests

Anyone who's written code with AI assistance knows this frustration: the AI confidently points out a "bug" in your code, explains it in convincing detail, and after twenty minutes of investigation, you discover — it doesn't exist.

Language models often fail by sounding confident when they should ask for more context. In code work, that means fabricated bugs, fabricated APIs, or explanations that sound plausible but do not match the repository.

Anthropic reports **0% scores** on two code-assistance metrics:

| Metric | Opus 4.5 | Opus 4.7 | Opus 4.8 |
|--------|----------|----------|----------|
| Code hallucination rate | 40% | 25% | **0%** |
| Laziness / premature handoff rate | 25% | — | **0%** |

What do these mean in practice?

**Code hallucination rate = 0%**: In standardized testing, Opus 4.8 did not fabricate a nonexistent bug. In the Opus 4.5 era, nearly half of all "findings" were false positives. By 4.7, that dropped to a quarter. With 4.8, Anthropic reports zero.

**Laziness rate = 0%**: When asked to investigate a problem deeply — say, tracing a performance bottleneck that spans multiple files — earlier models often did surface-level work and handed back an analysis that looked thorough but never touched the root cause. Opus 4.8 follows the trail to the end.

Crucially, the probability of Opus 4.8 reporting a code issue **without adequate explanation dropped to one-quarter of 4.7's rate**. When uncertain, it now proactively says: "I'm not sure — I need more information," instead of inventing something that sounds plausible.

> Bridgewater Associates, the hedge fund, reported that Opus 4.8 proactively flags analytical issues in both its inputs and outputs — problems that other models routinely miss.

### Why Uncertainty Handling Matters

In code review, security auditing, and financial analysis, a model that asks for more information is safer than one that invents a confident answer. A fabricated vulnerability wastes review time, and a missed real issue can reach production.

Anthropic frames this as **uncertainty calibration**: the model should judge how much confidence it has before it speaks.

---

## 2. Coding Prowess: Leading Across All 12 Benchmarks

Honesty isn't just attitude — it's backed by raw capability. In pure coding performance, Opus 4.8 leads across all 12 industry benchmarks.

**SWE-Bench Pro** jumped from 4.7's 64.3% to **69.2%** — more than 10 percentage points ahead of GPT-5.5 and over 15 points ahead of Gemini 3.1 Pro.

| Benchmark | Opus 4.8 | GPT-5.5 | Gemini 3.1 Pro |
|-----------|:--------:|:-------:|:--------------:|
| SWE-Bench Pro | **69.2%** | 58.6% | 54.2% |
| HLE Multidisciplinary Reasoning | **49.8%** | 41.4% | 44.4% |
| OSWorld Computer Use | **83.4%** | 78.7% | 76.2% |
| Knowledge Work (Elo) | **1890** | 1769 | 1314 |
| Financial Analysis | **53.9%** | 51.8% | 43.0% |

The one benchmark where GPT-5.5 edges ahead: **Terminal-Bench 2.1** (real terminal tasks), 78.2% vs. 74.6%. A domain worth watching.

But standard benchmarks only tell part of the story. Anthropic's internal **FrontierSWE** test suite is far more revealing:

- Write a PostgreSQL server from scratch in Zig
- Rewrite the git version control system
- Build a native Lua compiler

On these engineering challenges, Opus 4.8 tops the leaderboard with an **83% win rate**.

---

## 3. Dynamic Workflows: Multi-Agent Coding Tasks

**Dynamic Workflows** is available as a Research Preview inside Claude Code.

### How It Works

Traditional AI coding assistants work request-response: you give a task, they return code. Dynamic Workflows adds orchestration:

1. **Task Decomposition**: Claude receives your high-level task and first writes a JavaScript orchestration script
2. **Parallel Scheduling**: The complex task is broken into dozens to hundreds of subtasks
3. **Multi-Agent Parallel Execution**: A fleet of subagents works on subtasks simultaneously
4. **Cross-Review**: Once complete, another batch of agents reviews results from different angles, debating and challenging each other's work
5. **Convergence**: The process continues until the answer stabilizes under multi-party scrutiny

In practice, Claude Code can coordinate multiple agents for implementation and review instead of running one assistant at a time.

### A Large Task: The Bun Runtime Migration

One case study involved migrating the **Bun runtime**, 750,000 lines of Zig, to Rust.

This isn't "write a Hello World." This is rewriting the core infrastructure of a production-grade JavaScript runtime from one systems language to another.

The result?
- From first commit to merge: **just 11 days**
- **6,000+ commits** generated
- Existing test suite pass rate: **99.8%**

Bun creator Jarred Sumner noted the process was completed almost "**without human line-by-line review**." A swarm of AI agents decomposed the task themselves, wrote the code themselves, reviewed each other's work, and merged it themselves.

That amount of migration work would usually take a human team much longer.

### When Should You Use Dynamic Workflows?

Anthropic outlines the ideal scenarios:
- **Repository-wide bug hunting**: A bug scattered across multiple services and dozens of files
- **Large-scale code migration**: Framework upgrades, language migrations, API refactors
- **Framework / runtime rewrites**: Bun-like cases
- **Architecture stress testing**: Agents playing attacker and defender, testing each other

But the company is candid: **"Extremely capable, but also expensive."** Dynamic Workflows consumes significantly more tokens than a standard session — after all, you're running an entire engineering team, not a single programmer. It's still in Research Preview, and Anthropic is likely still optimizing costs and stability.

---

## 4. Effort Control: Turning "Think Harder" Into a Dial

Opus 4.8 introduces **five levels of effort control**.

```
Low → Medium → High (default) → Extra → Max
```

What each level means:

| Level | Best For | Characteristics |
|-------|----------|-----------------|
| Low | Simple completions, format conversions | Fast response, low token usage |
| Medium | Daily coding assistance | Balanced |
| High (default) | Complex logic, code review | Deep reasoning, high quality |
| Extra | Architecture design, system refactoring | Deeper analysis |
| Max | Security audits, critical decisions | Maximum compute |

The design gives users direct control over reasoning depth.

Previously, developers often used long prompts to ask for deeper analysis. Now they can choose an effort level.

Writing a simple utility function? Low, instant response. Investigating a production concurrency bug? Max, let it burn compute.

### Bonus: Mid-Conversation System Instruction Injection

The Messages API now supports **inserting system instructions mid-conversation**. Critically, this **doesn't break the prompt cache**.

Developers can adjust a task's permission level, token budget, or context environment mid-stream in a long conversation without starting over.

---

## 5. Fast Mode: Three Times Cheaper, Three Times Faster

The performance and pricing improvements deserve mention:

| Mode | Input Price | Output Price |
|------|-------------|--------------|
| Standard | $5 / million tokens | $25 / million tokens |
| Fast | $10 / million tokens | $50 / million tokens |

Fast Mode speed increased to **2.5×** standard mode, while the price dropped to **one-third** of the Opus 4.7 era.

Standard mode pricing is unchanged, but capability is up across the board — **more for the same price**. This is rarer in the AI industry than it should be.

---

## 6. Claude Mythos Preview

Anthropic also previewed **Claude Mythos**.

Mythos is a **higher-tier model family** positioned above Opus, expected to open to all customers **"in the coming weeks."**

What we know so far:

- Mythos Preview has been tested under **Project Glasswing** with approximately 50 partners, including **Apple, Google, Microsoft, and AWS**
- During testing, Mythos has already discovered **10,000+ high / critical severity software vulnerabilities**
- Mythos has demonstrated the ability to **autonomously discover zero-day vulnerabilities and write exploits**
- Precisely because of this capability, Anthropic is strengthening network safeguards before public release

Some analysts speculate that Opus 4.8 is a **distilled version of Mythos**. If that guess holds, the full Mythos release could move security-focused coding tools forward again.

For security practitioners, Mythos's zero-day discovery capability creates both an opportunity and a risk. Automated vulnerability scanning helps defenders, but the same capability can also help attackers.

---

## 7. Industry Impact and What Comes Next

The Opus 4.8 release points to a product strategy:

**Anthropic's focus is shifting from "making models smarter" to "making models more capable of doing real work."**

That does not mean intelligence stops mattering. It means raw benchmark scores are not enough when the gap between leading models narrows to 5-10 percentage points. Real-world value depends on three dimensions:

1. **Trustworthiness**: Does the model know its own boundaries? Will it honestly say "I don't know" when uncertain?
2. **Engineering-system capability**: Can it level up from "answering a question" to "completing a project"? Can it coordinate multiple sub-agents working in parallel?
3. **User control**: Does it hand control over reasoning depth, cost, and speed back to the user?

Opus 4.8 delivers on all three: two historic zeros on honesty, Dynamic Workflows turning multi-agent collaboration into reality, and Effort Control making thinking depth a dial you can turn.

The summer of 2026 brings more model options, lower prices, and stronger coding capabilities. Opus 4.8's main angle is practical: fewer fabricated findings, better control over effort, and multi-agent workflows for tasks that one assistant session cannot handle well.

---

*Published: May 29, 2026*

*Sources: Anthropic Official Announcement, Artificial Analysis, Simon Willison's Blog, The Next Web, ZDNET, 36Kr, Tencent Tech, and others*
