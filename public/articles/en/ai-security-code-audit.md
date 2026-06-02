## AI Code Audits Are Finding Bugs Faster Than Teams Can Patch Them

Anthropic's security-specialized model, Claude Mythos, scanned over 1,000 open-source projects through Project Glasswing and identified **23,019 potential vulnerabilities**, including **6,202 rated high or critical severity**. Independent security firms cross-validated the findings and reported that **90.6% were genuine vulnerabilities, not false positives.**

A 6.2% false positive rate is low for security work. Human security researchers often operate in the 15-25% range. The important change is not only volume; the model produced findings that reviewers could confirm at a usable rate.

### 1. A Serious Bug in a Widely Deployed Library

wolfSSL is a lightweight TLS encryption library purpose-built for embedded systems. If your smart door lock verifies firmware signatures over a network, if your car's telematics unit syncs navigation data with the cloud, if a hospital ICU device transmits telemetry over Wi-Fi—wolfSSL is likely running underneath.

Claude Mythos found a critical vulnerability in wolfSSL. A flaw in certificate verification allowed attackers to **forge TLS certificates and impersonate a legitimate website or server**. Against affected versions of wolfSSL, a device could accept a malicious firmware server as trusted.

This vulnerability now has a CVE ID and a merged patch. The larger lesson is the audit gap. Embedded crypto libraries pack dense logic into compact codebases, and branch conditions interlock in ways that humans struggle to cover exhaustively during manual review.

### 2. Discovery Is Outpacing Remediation

Security has always been a cat-and-mouse game. Researchers find vulnerabilities. Vendors patch them. On long timescales, a rough equilibrium holds—because finding vulnerabilities is expensive, fixing them is slow, but the two rhythms roughly match.

Claude Mythos changes that balance.

Of the 530 disclosed high and critical severity vulnerabilities, only **75 have been fixed**. That is a remediation rate below 15%. For every 100 real, confirmed, high-severity vulnerabilities AI surfaces and reports to maintainers, 85 remain open attack surface today.

In the pre-AI era, discovering a single high-severity vulnerability required expensive manual work. A top-tier security researcher might spend days or weeks reading source code, constructing threat models, and building proof-of-concept exploits to validate a vague intuition.

Claude Mythos can scan a thousand repositories in one run and surface thousands of confirmed bugs.

Open-source maintainers have formally asked Anthropic to **slow down the rate of disclosure**. The issue is capacity. A team of three or four maintainers still has to read each report, understand the code, design a patch, run regression tests, notify downstream users, and cut a release.

The discovery side can now accelerate faster than the remediation side. Existing open-source maintenance workflows were not designed for that volume.

### 3. Large Organizations Are Treating AI Audits as Risk Management

Project Glasswing included AWS, Apple, Google, Microsoft, NVIDIA, JPMorgan, Cloudflare, Palantir, and other organizations across cloud infrastructure, consumer hardware, search, semiconductors, financial services, cybersecurity, and defense technology.

The participant list matters because these organizations have strict legal, compliance, and security review processes.

Their participation suggests that AI-driven code auditing has moved from research experiment to risk-management workflow. A CISO now has to answer whether the organization has scanned its open-source dependency tree with the best available tools.

### 4. 90.6% Accuracy: Why This Number Deserves to Be Read Three Times

Elite human security researchers operate with false positive rates typically in the 15–25% range. That means for every 100 vulnerabilities reported, 15 to 25 ultimately turn out to be non-exploitable—the conditions required for exploitation don't exist in practice, or the report misunderstood the code path.

Claude Mythos false positive rate: 6.2%. Accuracy: 93.8%.

That number has practical implications.

**First, the model is not using a "flag everything suspicious" strategy.** If the model reported every questionable path and left humans to triage the pile, the false positive rate would climb. The low false positive rate suggests better confidence calibration.

**Second, low false positive rates determine whether human teams can keep pace.** A security tool that generates 500 "possible vulnerabilities" per day, 400 of which are false alarms, causes alert fatigue. Claude Mythos at 93.8% accuracy lets security teams spend more time on remediation and less time on triage.

**Third, this starts to change the division of labor.** When a tool's error rate stays below a human expert's, teams can route some findings straight into remediation planning instead of treating every report as speculative.

### 5. The 6-to-12-Month Window: When This Capability Reaches Every Developer Machine

Anthropic's public statements provide a temporal anchor: Mythos-level models will become more broadly accessible over the next 6 to 12 months. "More broadly accessible" is not "open-sourced for free"—the likely path is API-based access or enterprise licensing that covers large customers first before gradually moving downstream.

Developers should watch this window.

When vulnerability discovery at this level moves from Big Tech labs into the hands of ordinary developers—and, inevitably, malicious actors—several cascading effects become nearly certain.

**First, the security bar for open-source projects will be forcibly raised.** To earn community trust, a project having "no known vulnerabilities" will no longer suffice. The question will become: "Have you run an AI audit? What were the results?"—in the same way people today ask "Do you have CI? What's your test coverage?"

**Second, the economic model of bug bounty platforms will break.** When AI can discover vulnerabilities at industrial scale, the "discovery value" of an individual bug trends toward zero. HackerOne and Bugcrowd built their pricing models on the premise that finding vulnerabilities is scarce labor. AI demolishes that premise.

**Third, "security debt" will enter mainstream discourse as a quantifiable concept.** Just like technical debt, every project that depends on hundreds of open-source packages carries security debt—vulnerabilities that exist but haven't been scanned for, or have been found by AI but not yet patched. This debt is transitioning from invisible to visible. And visible debt attracts compliance pressure.

### 6. The Good News and the Bad News Are the Same Sentence

This is the deepest paradox our industry is now confronting.

AI auditors can find serious vulnerabilities that stayed buried in old, critical code. That gives maintainers and security teams better visibility into supply-chain risk.

The bad news: the more we discover, the more remains unpatched. The 23,000 vulnerabilities Claude Mythos found represent a tiny slice—it scanned roughly 1,000 projects, and the global open-source ecosystem contains millions of active repositories. If discovery continues growing exponentially while remediation remains linear, the gap only widens.

The same capability can also help attackers. Anthropic is restricting access for valid reasons, but model capabilities tend to spread. Defenders and attackers may end up scanning the same code, and the advantage goes to whoever finds and acts on the critical vulnerability first.

### Conclusion

AI code auditing changes the bottleneck from discovery to response. The hard work now sits in remediation workflows, maintainer capacity, downstream notification, liability rules, and compliance processes. Teams that adopt AI scanners also need a plan for the queue those scanners create.
